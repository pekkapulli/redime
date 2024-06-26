import { ArticleSimulationParams, Calculation } from "../types";
import {
  PageLoadParams,
  PageUseParams,
  calculatePageLoadImpact,
  calculatePageUseImpact,
} from "./calculateImpact";
import {
  combineCalculations,
  getCarbonKg,
  getSimulationParts,
  getTotalComparisons,
} from "./calculationUtils";

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

export type SimulationResult = {
  params: SimulationParameters;
  impacts: {
    pageLoadImpact: Calculation;
    pageUseImpact: Calculation;
    totalImpact: Calculation;
  };
};

export const simulateArticleFootprint = (
  params: ArticleSimulationParams
): SimulationResult[] => {
  const {
    contentType,
    autoplay,
    optimizeVideo,
    percentageOfMobileUsers,
    percentageOfUsersPlayingStreamContent,
    users,
    streamContentLengthInMinutes,
  } = params;

  const hasStreamContent = contentType !== "Text";
  const streamContentPlayChance = getStreamContentPlayChance(
    hasStreamContent,
    autoplay,
    percentageOfUsersPlayingStreamContent
  );

  const calculations: SimulationParameters[] = [];

  // Create a calculation for all different states

  allStates.playsVideo.forEach((playStreamContentSimulationState) => {
    allStates.mobile.forEach((mobileSimulationState) => {
      const streamContentPlaySimulationMatch = playStreamContentSimulationState
        ? streamContentPlayChance
        : 1 - streamContentPlayChance;
      const userGroupMatch = mobileSimulationState
        ? percentageOfMobileUsers / 100
        : 1 - percentageOfMobileUsers / 100;

      const deviceType = mobileSimulationState ? "Phone" : "Laptop";

      const amount = getAmount(users, [
        streamContentPlaySimulationMatch,
        userGroupMatch,
      ]);

      calculations.push({
        amount,
        loadParams: {
          deviceType,
          dataVolume: params.initialVolumeInMB * 1000000,
          userAmount: amount,
        },
        useParams: {
          deviceType,
          contentType: playStreamContentSimulationState ? contentType : "Text",
          // Assume it takes a minute to read the article
          durationInSeconds:
            hasStreamContent && playStreamContentSimulationState
              ? streamContentLengthInMinutes * 60
              : 60,
          optimizeVideo: optimizeVideo && deviceType === "Phone",
          userAmount: amount,
        },
      });
    });
  });

  return calculations.map((calcParams) => {
    const pageLoadImpact = calculatePageLoadImpact(
      calcParams.loadParams,
      params
    );
    const pageUseImpact = calculatePageUseImpact(calcParams.useParams, params);
    const totalImpact = combineCalculations([pageLoadImpact, pageUseImpact]);
    return {
      params: calcParams,
      impacts: { pageLoadImpact, pageUseImpact, totalImpact },
    };
  });
};

export const getResultCalculation = (params: ArticleSimulationParams) => {
  const impact = simulateArticleFootprint(params);
  const totalCalculation = getSimulationParts(impact, "totalImpact");

  const max = simulateArticleFootprint({
    ...params,
    autoplay: true,
    contentType: "Video",
    optimizeVideo: false,
    percentageOfMobileUsers: 100,
    percentageOfUsersPlayingStreamContent: 100,
  });
  const maxCarbonKg = getCarbonKg(max, "totalImpact");
  const maxComparisons = getTotalComparisons(max);

  return { impact, totalCalculation, maxCarbonKg, maxComparisons };
};
