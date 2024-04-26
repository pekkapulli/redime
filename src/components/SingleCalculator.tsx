import styled from "styled-components";
import { ArticleSimulationParams } from "../types";
import { GraphTitle, Selector, SmallP } from "./common-components";
import { useState } from "react";
import { initialArticleSimulationParams } from "../contexts/ArticleParamsContext";
import { useDeepMemo } from "../util/useDeepMemo";
import { getResultCalculation } from "../util/simulations";
import Meter from "./generic/Meter";
import { calculationParts } from "../util/calculationUtils";
import { theme } from "../theme";
import { getLabel } from "../util/texts";
import { ContentTypeSelector } from "./ControlTypes";
import { NumberInput } from "./generic/NumberInput";

const SingleCalculatorContainer = styled.div`
  width: 100%;
`;

type SelectorType = "contentType";

interface Props {
  title: string;
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
    default:
      return undefined;
  }
};

export const SingleCalculator = ({ title, details, type }: Props) => {
  const [params, setParams] = useState<ArticleSimulationParams>(
    initialArticleSimulationParams
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
      <GraphTitle>{title}</GraphTitle>
      <SmallP>{details}</SmallP>
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
