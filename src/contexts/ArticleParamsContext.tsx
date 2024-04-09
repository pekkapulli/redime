import { createContext } from "react";
import { ArticleSimulationParams } from "../types";

interface ArticleParamsContextShape {
  params: ArticleSimulationParams;
  updateParams: (newParams: Partial<ArticleSimulationParams>) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const initialArticleSimulationParams: ArticleSimulationParams = {
  percentageOfMobileUsers: 80,
  contentType: "Video",
  users: 100000,
  percentageOfUsersPlayingStreamContent: 60,
  autoplay: true,
  optimizeVideo: false,
  site: "HS",
  textAlt: false,
  streamContentLengthInMinutes: 2,

  kwhPerGB_4G: 0.117,
  kwhPerGB_5G: 0.501,
  initialVolumeInMB: 1,
};

export const ArticleParamsContext = createContext<ArticleParamsContextShape>({
  params: initialArticleSimulationParams,
  updateParams: (newParams) => {
    newParams;
  },
});
