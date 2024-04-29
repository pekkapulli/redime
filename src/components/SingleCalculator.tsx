import styled from "styled-components";
import { ArticleSimulationParams } from "../types";
import { GraphTitle, P, Selector, SmallGraphTitle } from "./common-components";
import { useState } from "react";
import { initialArticleSimulationParams } from "../contexts/ArticleParamsContext";
import { useDeepMemo } from "../util/useDeepMemo";
import { getResultCalculation } from "../util/simulations";
import Meter from "./generic/Meter";
import { calculationParts } from "../util/calculationUtils";
import { theme } from "../theme";
import { getLabel, getStreamedContentDescription } from "../util/texts";
import {
  AutoPlaySelector,
  ContentTypeSelector,
  OptimizeSelector,
} from "./ControlTypes";
import { NumberInput } from "./generic/NumberInput";
import PresetSelector from "./generic/PresetSelector";
import SliderInput from "./generic/SliderInput";

const SingleCalculatorContainer = styled.div`
  width: 100%;
`;

type SelectorType = "contentType" | "optimization" | "autoPlay";

interface Props {
  title?: string;
  details: string;
  type: SelectorType;
}

const Selectors = ({
  type,
  params,
  updateParams,
}: {
  type: SelectorType;
  params: ArticleSimulationParams;
  updateParams: (newParams: Partial<ArticleSimulationParams>) => void;
}) => {
  switch (type) {
    case "contentType":
      return (
        <>
          <ContentTypeSelector params={params} updateParams={updateParams} />
          <Selector>
            <NumberInput
              min={0.5}
              step={0.5}
              value={params.streamContentLengthInMinutes}
              onChange={(value) =>
                updateParams({ streamContentLengthInMinutes: value })
              }
              unit="min of stream content"
            />
          </Selector>
        </>
      );
    case "optimization":
      return (
        <>
          <Selector>
            <SmallGraphTitle>Optimize for small screens</SmallGraphTitle>
            <OptimizeSelector params={params} updateParams={updateParams} />
          </Selector>
          <Selector>
            <SmallGraphTitle>Optimized video quality</SmallGraphTitle>
            <NumberInput
              min={0}
              value={params.optimizedVideoMBitsPerSecond}
              onChange={(value) =>
                updateParams({ optimizedVideoMBitsPerSecond: value })
              }
              unit="Mbps"
            />
            <PresetSelector
              options={[
                { label: "360p", value: 1 },
                { label: "480p", value: 1.5 },
                { label: "720p", value: 3 },
              ]}
              onChange={(value) =>
                updateParams({ optimizedVideoMBitsPerSecond: value })
              }
              value={params.optimizedVideoMBitsPerSecond}
            />
          </Selector>
        </>
      );
    case "autoPlay":
      return (
        <>
          <Selector>
            <SmallGraphTitle>Autoplay video</SmallGraphTitle>
            <AutoPlaySelector params={params} updateParams={updateParams} />
          </Selector>
          <SmallGraphTitle>
            Percentage of users who play{" "}
            {getStreamedContentDescription(params.contentType)} (when not on
            autoplay)
          </SmallGraphTitle>
          <SliderInput
            value={params.percentageOfUsersPlayingStreamContent}
            onChange={(value) =>
              updateParams({ percentageOfUsersPlayingStreamContent: value })
            }
            showNumberInput
            min={0}
            max={100}
            step={10}
            params={params}
            paramName="percentageOfUsersPlayingStreamContent"
            unit="%"
          />
        </>
      );
    default:
      return undefined;
  }
};

const getInitialParams = (type: SelectorType): ArticleSimulationParams => {
  switch (type) {
    case "contentType": {
      return initialArticleSimulationParams;
    }
    case "optimization": {
      return {
        ...initialArticleSimulationParams,
        optimizeVideo: true,
      };
    }
    case "autoPlay": {
      return {
        ...initialArticleSimulationParams,
        autoplay: false,
      };
    }
  }
};

export const SingleCalculator = ({ title, details, type }: Props) => {
  const [params, setParams] = useState<ArticleSimulationParams>(
    getInitialParams(type)
  );

  const updateParams = (newParams: Partial<ArticleSimulationParams>) => {
    setParams({
      ...params,
      ...newParams,
    });
  };

  const { totalCalculation } = useDeepMemo(
    () => getResultCalculation(params),
    [params]
  );

  return (
    <SingleCalculatorContainer>
      {title && <GraphTitle>{title}</GraphTitle>}
      <P>{details}</P>
      <Selectors type={type} params={params} updateParams={updateParams} />
      <Meter
        title="Impact per source"
        maxValue={totalCalculation.total.carbonGrams / 1000}
        unit="kg CO₂e"
        values={calculationParts
          .filter((d) => d !== "total")
          .map((source, i) => ({
            color: theme.colors.categories[i],
            label: getLabel(source),
            value: totalCalculation[source].carbonGrams / 1000,
          }))}
      />
    </SingleCalculatorContainer>
  );
};
