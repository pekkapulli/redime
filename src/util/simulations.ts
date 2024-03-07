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

const getStreamContentPlayChance = (
  hasStreamContent: boolean,
  autoPlay: boolean,
  percentageOfUsersPlayingStreamContent: number
) => {
  if (!hasStreamContent) {
    return 0;
  }
  if (autoPlay) {
    return 1;
  }
  return percentageOfUsersPlayingStreamContent / 100;
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
    percentageOfUsersPlayingStreamContent,
    users,
    videoLengthInMinutes,
  } = params;

  const hasStreamContent = articleType !== "Text";
  const streamContentPlayChance = getStreamContentPlayChance(
    hasStreamContent,
    autoplay,
    percentageOfUsersPlayingStreamContent
  );

  const calculations: SimulationParameters[] = [];

  // Create a calculation for all different states

  allStates.playsVideo.forEach((playVideoSimulationState) => {
    allStates.mobile.forEach((mobileSimulationState) => {
      const connectivityMethod = mobileSimulationState ? "3G" : "WIFI"; // TODO: Not accurate

      const videoPlaySimulationMatch = playVideoSimulationState
        ? streamContentPlayChance
        : 1 - streamContentPlayChance;
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
          dataVolume: hasStreamContent ? 8000000 : 10000000, // TODO: not accurate
          userAmount: amount,
          site,
        },
        useParams: {
          connectivityMethod,
          deviceType,
          contentType: playVideoSimulationState ? "Video" : "Text",
          // assume it takes a minute to read the article
          durationInSeconds:
            hasStreamContent && playVideoSimulationState
              ? videoLengthInMinutes * 60
              : 60,
          optimizeVideo: optimizeVideo && deviceType === "Phone",
          userAmount: amount,
          site,
        },
      });
    });
  });

  return calculations.map((calcParams) => {
    const pageLoadImpact = calculatePageLoadImpact(calcParams.loadParams);
    const pageUseImpact = calculatePageUseImpact(calcParams.useParams);
    const totalImpact = combineCalculations([pageLoadImpact, pageUseImpact]);
    return {
      params: calcParams,
      pageLoadImpact,
      pageUseImpact,
      totalImpact,
    };
  });
};
