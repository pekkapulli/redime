import styled from "styled-components";
import {
  ArticleParamsContext,
  initialArticleSimulationParams,
} from "../contexts/ArticleParamsContext";
import { ArticleSimulationParams } from "../types";
import { useState } from "react";
import {
  P,
  SectionSubTitle,
  SectionTitle,
  TextContent,
} from "../components/common-components";

// interface PageProps {}

const ArticleContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
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
      <ArticleContainer>
        <TextContent>
          <SectionTitle>ReDime: A roadmap towards…</SectionTitle>
          <P>Fact box: Tell readers there's a longer PDF available (link)</P>
          <SectionTitle>
            Future outlook of digital media & sustainability
          </SectionTitle>
          <P>
            Hyperintensification, low visibility of consequences, social media
            and competition, AI (?), Advertising, lifecycle model of digital
            media consumption, modes of degrowth.
          </P>
          <SectionTitle>
            Calculating the footprint of digital media
          </SectionTitle>
          <SectionSubTitle>
            Present tools and how things are calculated (and Scope3)
          </SectionSubTitle>
          <SectionSubTitle>
            Our calculations (the interactive part)
          </SectionSubTitle>
          <SectionSubTitle>Advertising impact</SectionSubTitle>
          <SectionTitle>Future Scenarios</SectionTitle>
          <P>A brief version of future scenarios in the tool</P>
          <SectionTitle>Lead readers to the tool and the PDF</SectionTitle>
        </TextContent>
      </ArticleContainer>
    </ArticleParamsContext.Provider>
  );
};

export default Article;
