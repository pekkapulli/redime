import {
  ArticleSimulationParams,
  ContentType,
  allContentTypes,
} from "../types";
import OptionsSelector from "./generic/OptionsSelector";

const getOption = <T,>(option: T) => ({
  label: option,
  value: option,
});

export const ContentTypeSelector = ({
  params,
  updateParams,
}: {
  params: ArticleSimulationParams;
  updateParams: (params: Partial<ArticleSimulationParams>) => void;
}) => (
  <OptionsSelector
    options={allContentTypes.map(getOption<ContentType>)}
    onChange={(newValue) =>
      newValue !== null && updateParams({ contentType: newValue })
    }
    value={params.contentType}
    params={params}
    paramName="contentType"
  />
);

export const OptimizeSelector = ({
  params,
  updateParams,
}: {
  params: ArticleSimulationParams;
  updateParams: (params: Partial<ArticleSimulationParams>) => void;
}) => (
  <OptionsSelector
    options={[
      {
        label: "On",
        value: true,
      },
      {
        label: "Off",
        value: false,
      },
    ]}
    onChange={(newValue) => updateParams({ optimizeVideo: newValue })}
    paramName="optimizeVideo"
    params={params}
    value={params.optimizeVideo}
  />
);
