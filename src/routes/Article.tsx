import styled from "styled-components";
import { breakpoints, theme } from "../theme";
import Controls from "../components/Article/Controls";
import {
  ArticleParamsContext,
  initialArticleSimulationParams,
} from "../contexts/ArticleParamsContext";
import { ArticleSimulationParams } from "../types";
import { useState } from "react";
import ArticleResults from "../components/Article/ArticleResults";

// interface PageProps {}

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-column-gap: ${theme.spacing(5)};
  padding: ${theme.spacing(4)};
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    grid-template-columns: 100%;
  }
`;

const Article = () => {
  const [params, setParams] = useState<ArticleSimulationParams>(
    initialArticleSimulationParams
  );

  const setParamsHelper = (newParams: Partial<ArticleSimulationParams>) => {
    setParams((oldParams) => ({
      ...oldParams,
      ...newParams,
    }));
  };

  return (
    <ArticleParamsContext.Provider
      value={{ params, updateParams: setParamsHelper }}
    >
      <PageContainer>
        <Controls />
        <ArticleResults />
      </PageContainer>
    </ArticleParamsContext.Provider>
  );
};

export default Article;
