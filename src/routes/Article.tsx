import styled from "styled-components";
import {
  ArticleParamsContext,
  initialArticleSimulationParams,
} from "../contexts/ArticleParamsContext";
import { ArticleSimulationParams } from "../types";
import { useState } from "react";
import {
  GraphTitle,
  P,
  SectionSubTitle,
  SectionTitle,
  StyledLink,
  TextContent,
} from "../components/common-components";
import { SingleCalculator } from "../components/SingleCalculator";
import { FactBox } from "../components/generic/FactBox";
import { theme } from "../theme";

// interface PageProps {}

const ArticleContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  max-width: 100vw;
  padding: 0 ${theme.spacing(4)};
  box-sizing: border-box;
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
          <FactBox>
            <P>
              This is an interactive online summary of []. Download the full PDF
              report <a href="/">here</a>.
            </P>
          </FactBox>
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
          <SectionSubTitle>The ReDime calculator explained</SectionSubTitle>
          <P>
            The impact of an article, or any web content, consists of four
            parts: device consumption, data consumption, network consumption,
            and server consumption. You can use the full calculator on the{" "}
            <StyledLink to="/calculator">calculator page</StyledLink>, but we
            will explain the reasoning for the main choices below.
          </P>
          <GraphTitle>Video, audio, or text?</GraphTitle>
          <P>
            The most obvious and impactful choice for a published article is
            whether it has video content. We found that even audio content is
            relatively green compared to any amount of video material being
            streamed. Most of the emissions come from the last mile data
            transfer over either 4G or 5G mobile networks, so no amount of
            caching or server-side optimization will have a great effect.
          </P>
          <SingleCalculator
            details={`How content type affects an article's carbon footprint (${params.users.toLocaleString(
              "fi-FI"
            )} users):`}
            type="contentType"
          />
          <GraphTitle>Video optimizing</GraphTitle>
          <P>
            Optimizing the video stream for the receiver’s screen size and
            network is one effective way to cut emissions. By sending standard
            definition (720p) content to mobile devices, around 25% of emissions
            can already be saved compared to HD content.
          </P>
          <SingleCalculator
            details={`How video optimization for small devices affects the article carbon footprint (${params.users.toLocaleString(
              "fi-FI"
            )} users and ${params.streamContentLengthInMinutes.toLocaleString(
              "fi-FI"
            )} minutes of video):`}
            type="optimization"
          />
          <GraphTitle>Autoplay functionality</GraphTitle>
          <P>
            Video might not be the user’s first choice when skimming through
            text content such as news, but with the best ad revenue streams
            coming from video ads, and competition against other hyperintesified
            media, companies are pushed towards forcing the videos to play
            automatically upon opening the article. If autoplay wasn’t on, a
            significant amount of the data in news articles would be not loaded.
          </P>
          <SingleCalculator
            details={`How removing autoplay might affect the article carbon footprint (${params.users.toLocaleString(
              "fi-FI"
            )} users and ${params.streamContentLengthInMinutes.toLocaleString(
              "fi-FI"
            )} minutes of video):`}
            type="autoPlay"
          />
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
