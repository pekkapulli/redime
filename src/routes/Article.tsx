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
import { SingleCalculator } from "../components/SingleCalculator";

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
            Future outlook of digital media & sustainability: Background for the
            report and the article.
          </SectionTitle>
          <P>
            Hyperintensification, low visibility of consequences, social media
            and competition, AI (?), Advertising, lifecycle model of digital
            media consumption, modes of degrowth.
          </P>
          <P>Do we want pics or charts here?</P>
          <SectionTitle>
            Calculating the footprint of digital media
          </SectionTitle>
          <P>
            For this project, we created two kinds of inputs for the researched
            media companies: A calculator, and speculative prototypes. The
            prototypes were open-ended, speculative, and provocative versions of
            features and working models that could be implemented in media
            products. The calculator aimed at shining a light on emissions
            caused by digital products at a scale that is understandable and
            concrete enough for a media company: a web article, with or without
            media content.
          </P>
          <P>Present tools and how things are calculated (and Scope3)</P>
          <SectionSubTitle>
            Our calculations (the interactive part)
          </SectionSubTitle>
          <P>
            The impact of an article, or any web content, consists of four
            parts: device consumption, data consumption, network consumption,
            and server consumption.
          </P>
          <P>
            Researching the choices that media companies can make when
            publishing content, we concluded that the energy required to
            transfer…
          </P>
          <P>
            <SingleCalculator
              title="Video, audio, or text?"
              details={`How content type affects an article's carbon footprint (${params.users.toLocaleString(
                "fi-FI"
              )} users)`}
              type="contentType"
            />
            <b>Content type</b>
          </P>
          <P>
            <b>Video optimizing</b>
          </P>
          <P>
            <b>Autoplay functionality</b>
          </P>
          <P>
            <b>
              Do we want secondary choices collected here or do we just point
              the user to the calculator?
            </b>
          </P>
          <SectionSubTitle>Advertising impact (?)</SectionSubTitle>
          <SectionTitle>Workshops with media</SectionTitle>
          <P>What did we learn in the media workshops?</P>
          <SectionTitle>Future Scenarios</SectionTitle>
          <P>A brief version of future scenarios in the tool</P>
          <P>Fact box repeated: Lead readers to the tool and the PDF</P>
        </TextContent>
      </ArticleContainer>
    </ArticleParamsContext.Provider>
  );
};

export default Article;
