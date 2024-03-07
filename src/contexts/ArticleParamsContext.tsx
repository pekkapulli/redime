import { createContext } from "react";
import { ArticleSimulationParams } from "../types";

interface ArticleParamsContextShape {
  params: ArticleSimulationParams;
  updateParams: (newParams: Partial<ArticleSimulationParams>) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const initialArticleSimulationParams: ArticleSimulationParams = {
  percentageOfMobileUsers: 80,
  articleType: "Video",
  users: 10000,
  percentageOfUsersPlayingStreamContent: 60,
  autoplay: true,
  optimizeVideo: false,
  site: "HS",
  textAlt: false,
  videoLengthInMinutes: 2,
};

export const ArticleParamsContext = createContext<ArticleParamsContextShape>({
  params: initialArticleSimulationParams,
  updateParams: (newParams) => {
    newParams;
  },
});
