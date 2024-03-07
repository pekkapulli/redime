import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { P, SectionTitle } from "../common-components";
import { useDeepMemo } from "../../util/useDeepMemo";
import { simulateArticleFootprint } from "../../util/simulations";

const ResultsContainer = styled.div``;

const Results = () => {
  const { params } = useContext(ArticleParamsContext);
  const [impact] = useDeepMemo(() => {
    return [simulateArticleFootprint(params)];
  }, [params]);

  return (
    <ResultsContainer>
      <SectionTitle>Results</SectionTitle>
      <P>
        CO₂e total:{" "}
        {(
          impact.reduce(
            (result, curr) => result + curr.totalImpact.total.carbonGrams,
            0
          ) / 1000
        ).toLocaleString("fi-FI", { maximumFractionDigits: 4 })}{" "}
        kg
      </P>
      <P>
        CO₂e from page loads:{" "}
        {(
          impact.reduce(
            (result, curr) => result + curr.pageLoadImpact.total.carbonGrams,
            0
          ) / 1000
        ).toLocaleString("fi-FI", { maximumFractionDigits: 4 })}{" "}
        kg
      </P>
      <P>
        CO₂e from page use (after initial load):{" "}
        {(
          impact.reduce(
            (result, curr) => result + curr.pageUseImpact.total.carbonGrams,
            0
          ) / 1000
        ).toLocaleString("fi-FI", { maximumFractionDigits: 4 })}{" "}
        kg
      </P>
    </ResultsContainer>
  );
};

export default Results;
