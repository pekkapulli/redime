import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { SectionTitle } from "../common-components";
import { useDeepMemo } from "../../util/useDeepMemo";
import { simulateArticleFootprint } from "../../util/simulations";
import Meter from "../generic/Meter";
import { theme } from "../../theme";
import { getCarbonKg, getTotalComparisons } from "../../util/calculationUtils";
import Comparisons from "./Comparisons";

const ResultsContainer = styled.div``;

const Results = () => {
  const { params } = useContext(ArticleParamsContext);
  const [impact] = useDeepMemo(() => {
    return [simulateArticleFootprint(params)];
  }, [params]);

  const [maxCarbonKg, maxComparisons] = useDeepMemo(() => {
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
    return [maxCarbonKg, maxComparisons];
  }, [params]);

  return (
    <ResultsContainer>
      <SectionTitle>Results</SectionTitle>
      <Meter
        title="CO₂ equivalent emissions"
        maxValue={maxCarbonKg}
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
