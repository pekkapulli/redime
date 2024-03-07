import { ArticleSimulationParams } from "../types";
import {
  PageLoadParams,
  PageUseParams,
  calculatePageLoadImpact,
  calculatePageUseImpact,
} from "./calculateImpact";
import { combineCalculations } from "./calculationUtils";

type SimulationParam = "mobile" | "playsVideo";

const allStates: Record<SimulationParam, boolean[]> = {
  playsVideo: [true, false],
  mobile: [true, false],
};

interface SimulationParameters {
  amount: number;
  loadParams: PageLoadParams;
  useParams: PageUseParams;
}

const getVideoPlayChance = (
  hasVideo: boolean,
  autoPlay: boolean,
  percentageOfUsersPlayingVideo: number
) => {
  if (!hasVideo) {
    return 0;
  }
  if (autoPlay) {
    return 1;
  }
  return percentageOfUsersPlayingVideo / 100;
};

const getAmount = (users: number, chances: number[]) =>
  Math.round(
    chances.reduce<number>((result, chance) => result * chance, users)
  );

export const simulateArticleFootprint = (params: ArticleSimulationParams) => {
  const {
    site,
    articleType,
    autoplay,
    optimizeVideo,
    percentageOfMobileUsers,
    percentageOfUsersPlayingVideo,
    users,
    videoLengthInMinutes,
  } = params;

  const hasVideo = site === "Areena" || articleType === "Video";
  const videoPlayChance = getVideoPlayChance(
    hasVideo,
    autoplay,
    percentageOfUsersPlayingVideo
  );

  const calculations: SimulationParameters[] = [];

  // Create a calculation for all different states

  allStates.playsVideo.forEach((playVideoSimulationState) => {
    allStates.mobile.forEach((mobileSimulationState) => {
      const connectivityMethod = mobileSimulationState ? "3G" : "WIFI"; // TODO: Not accurate

      const videoPlaySimulationMatch = playVideoSimulationState
        ? videoPlayChance
        : 1 - videoPlayChance;
      const userGroupMatch = mobileSimulationState
        ? percentageOfMobileUsers / 100
        : 1 - percentageOfMobileUsers / 100;

      const deviceType = mobileSimulationState ? "Phone" : "Laptop";

      const amount = getAmount(users, [
        videoPlaySimulationMatch,
        userGroupMatch,
      ]);

      calculations.push({
        amount,
        loadParams: {
          connectivityMethod,
          deviceType,
          dataVolume: hasVideo ? 8000000 : 10000000,
          userAmount: amount,
        },
        useParams: {
          connectivityMethod,
          deviceType,
          contentType: playVideoSimulationState ? "Video" : "Text",
          durationInSeconds:
            hasVideo && playVideoSimulationState
              ? videoLengthInMinutes * 60
              : 60,
          optimizeVideo: optimizeVideo && deviceType === "Phone",
          userAmount: amount,
        },
      });
    });
  });

  return calculations.map((calcParams) => {
    const pageLoadImpact = calculatePageLoadImpact(calcParams.loadParams);
    const pageUseImpact = calculatePageUseImpact(calcParams.useParams);
    const totalImpact = combineCalculations([pageLoadImpact, pageUseImpact]);
    console.log(totalImpact);
    return {
      params: calcParams,
      pageLoadImpact,
      pageUseImpact,
      totalImpact,
    };
  });
};
