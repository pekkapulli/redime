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
import { P, SectionTitle } from "../components/common-components";

// interface PageProps {}

const PageContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 240px;
  grid-column-gap: ${theme.spacing(5)};
  padding: ${theme.spacing(4)};
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.tablet}px) {
    grid-template-columns: 100%;
  }
`;

const PageIntro = styled.section`
  width: 100%;
  max-width: 640px;
  padding: ${theme.spacing(4)};
  margin: 0 auto;
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
      <PageIntro>
        <SectionTitle>Online Article carbon calculator</SectionTitle>
        <P>
          Digital media is not emission free. With this calculator, you can see
          how choices you make in publishing an article or streaming content
          online affect its carbon frootprint. Green bars above buttons indicate
          total carbon equivalent emissions from the choice.
        </P>
        <P>
          Carbon emissions are calculated by analyzing the device, network,
          server, and data transfer .
        </P>
      </PageIntro>
      <PageContainer>
        <Controls />
        <ArticleResults />
      </PageContainer>
    </ArticleParamsContext.Provider>
  );
};

export default Article;
