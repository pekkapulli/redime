import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { P, SectionSubTitle, SectionTitle, Spacer } from "../common-components";
import { useDeepMemo } from "../../util/useDeepMemo";
import { getResultCalculation } from "../../util/simulations";
import Meter from "../generic/Meter";
import { theme } from "../../theme";
import {
  calculationParts,
  getCarbonKg,
  getTotalComparisons,
} from "../../util/calculationUtils";
import Comparisons from "./Comparisons";
import { getLabel } from "../../util/texts";

const ResultsContainer = styled.div``;

const Results = () => {
  const { params } = useContext(ArticleParamsContext);

  const { impact, totalCalculation, maxCarbonKg, maxComparisons } = useDeepMemo(
    () => getResultCalculation(params),
    [params]
  );

  if (params.users < 10) {
    return (
      <ResultsContainer>
        <SectionTitle>Results</SectionTitle>
        <P>
          The simulation does not work accurately for less than 10 users, please
          add more.
        </P>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <SectionTitle>Results</SectionTitle>
      <Meter
        title="CO₂ equivalent emissions"
        maxValue={maxCarbonKg}
        // maxValueLabel={`Max with ${params.users.toLocaleString("en-GB")} users${
        //   params.contentType !== "Text"
        //     ? ` and ${
        //         params.streamContentLengthInMinutes
        //       } min of ${getStreamedContentDescription(params.contentType)}.`
        //     : ""
        // }`}
        values={[
          {
            label: "Page load emissions",
            color: theme.colors.darkGreen,
            value: getCarbonKg(impact, "pageLoadImpact"),
          },
          {
            label: "Page use emissions",
            color: theme.colors.green,
            value: getCarbonKg(impact, "pageUseImpact"),
          },
        ]}
        unit="kg CO₂e"
      />
      <Comparisons
        maxComparisons={maxComparisons}
        comparisons={getTotalComparisons(impact)}
      />
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
      <Spacer />
      <SectionSubTitle>Additional details</SectionSubTitle>
      <Meter
        title="Emissions, mobile users"
        maxValue={maxCarbonKg}
        values={[
          {
            label: "Page load emissions",
            color: theme.colors.darkGreen,
            value: getCarbonKg(
              impact.filter((i) => i.params.loadParams.deviceType === "Phone"),
              "pageLoadImpact"
            ),
          },
          {
            label: "Page use emissions",
            color: theme.colors.green,
            value: getCarbonKg(
              impact.filter((i) => i.params.loadParams.deviceType === "Phone"),
              "pageUseImpact"
            ),
          },
        ]}
        unit="kg CO₂e"
      />
      <Meter
        title="Emissions, computer users"
        maxValue={maxCarbonKg}
        values={[
          {
            label: "Page load emissions",
            color: theme.colors.darkGreen,
            value: getCarbonKg(
              impact.filter((i) => i.params.loadParams.deviceType !== "Phone"),
              "pageLoadImpact"
            ),
          },
          {
            label: "Page use emissions",
            color: theme.colors.green,
            value: getCarbonKg(
              impact.filter((i) => i.params.loadParams.deviceType !== "Phone"),
              "pageUseImpact"
            ),
          },
        ]}
        unit="kg CO₂e"
      />
    </ResultsContainer>
  );
};

export default Results;
