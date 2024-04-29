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
              report <a href="/">here</a> for more details.
            </P>
          </FactBox>
          <SectionTitle>
            Future outlook of digital media & sustainability
          </SectionTitle>
          <P>
            Digitalisation is often portrayed as the eco-friendly solution, even
            though digital solutions have an increasingly large carbon
            footprint. In the ReDime research project, we studied the views,
            ways of speaking, and practices the producers of digital media have
            about the eco-friendliness of media consumption and digital
            technology.
          </P>
          <P>
            According to Statistics Finland, Finns spent four hours per day on
            average in front of different screens in 2021, and the trend is
            growing. Additionally, the amount of content and its intensity are
            growing: the yearly data consumption for an average mobile
            subscription in OECD countries has grown by 28 percent from 2022 to
            2023 (OECD, 2024).
          </P>
          <P>
            The ICT sector contributes to roughly 2-4 % of global carbon
            emissions, which already makes it a bigger emitter than the airline
            industry (at 2 %). Some estimates predict the ICT sector will emit
            14 % of global emissions by year 2040. The emissions are largely
            invisible and abstract to the consumer, which makes limiting them at
            the customer end very hard. Yet, these “scope 3 emissions” that are
            caused downstream from the media companies themselves, combine to
            around 90 % of all their emissions. Where does the responsibility
            for greener consumption lie, then?
          </P>
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
