import styled from "styled-components";
import {
  ArticleParamsContext,
  initialArticleSimulationParams,
} from "../contexts/ArticleParamsContext";
import { ArticleSimulationParams } from "../types";
import { useState } from "react";
import {
  A,
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
import { Scenarios } from "../components/Scenarios";

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

  const pdfUrl =
    "https://blogs.helsinki.fi/smlaakso/files/2024/04/ReDime-report-v1.pdf";

  return (
    <ArticleParamsContext.Provider
      value={{ params, updateParams: setParamsHelper }}
    >
      <ArticleContainer>
        <TextContent>
          <FactBox>
            <P>
              This is an interactive online summary of the final report of the
              research project Redime: Roadmap towards resource-wise digital
              media. Download the full PDF report <A href={pdfUrl}>here</A>.
            </P>
          </FactBox>
          <SectionTitle>
            Future outlook of digital media sustainability
          </SectionTitle>
          <P>
            Digitalisation is often portrayed as a sustainable and green
            solution, but digital services themselves have an increasingly large
            carbon footprint. Although we know that excessive consumption is
            generally at the heart of the climate crisis, consumption of digital
            services is typically perceived as intangible and therefore
            low-carbon consumption despite its growing rate and intensity.
            Furthermore, there is very little public or consumer awareness of
            the environmental aspects of digital media consumption and
            production.
          </P>
          <P>
            Digital media consumption is growing rapidly, and the content
            formats are increasingly data-intensive. Therefore it is essential
            to understand the overall environmental burden and the environmental
            impact of different digital media consumption patterns. For an
            individual consumer, the contribution of digital media consumption
            to their overall carbon footprint is unlikely to be significant, but
            at the same time, for example, 162 million Eurovision Song Contest
            streamers together produce a much larger carbon footprint.
          </P>
          <P>
            Emissions and waste result not only from direct electricity
            consumption, but also from the server infrastructure, data centres,
            network maintenance, and end-user equipment required by digital
            technologies. The digital ecosystem is complex and the resources it
            consumes are difficult to calculate and model. Currently, the ICT
            sector is estimated to contribute roughly 2-4 % of global carbon
            emissions, which makes it a bigger emitter than the airline industry
            (at 2 %). Some estimates predict that the share of the ICT sector
            will grow to 14 % of global emissions by the year 2040.
          </P>
          <P>
            This energy consumption and related emissions are largely invisible
            and abstract to the consumer, which makes limiting them at the
            customer end very hard. Yet, the downstream emissions resulting from
            media product use combine to around 90 % of all the emissions of
            media companies. Where does the responsibility for greener
            consumption lie, then?
          </P>
          <SectionTitle>
            Calculating the footprint of digital media
          </SectionTitle>
          <P>
            In ReDime, we created a calculator for assessing a web article’s
            Scope 3 emissions. The calculator explores how choices made when
            publishing digital content affect the emissions caused by consuming
            the content in the Finnish context. The tool was inspired by a
            previous tool generated in the UK, which later became known as{" "}
            <A href="https://dimpact.org/">The Dimpact Tool</A>.
          </P>
          <SectionSubTitle>The ReDime calculator explained</SectionSubTitle>
          <P>
            The impact of an article, or any web content, consists of four
            parts: device energy consumption, data energy consumption, network
            energy consumption, and server energy consumption.
          </P>
          <P>
            You can use the full calculator{" "}
            <StyledLink to="/calculator">on the calculator page</StyledLink>,
            but we will explain the reasoning for the main ideas in this
            article.
          </P>
          <GraphTitle>Video, audio, or text?</GraphTitle>
          <P>
            The most impactful choice for a published article is whether it has
            video content. We found that even audio content is relatively
            sustainable compared to any video material being streamed. As you
            can observe from the impact per source bar, most of the emissions
            come from the last mile of data transfer over either 4G or 5G mobile
            networks, so caching or server-side optimization will not have a
            great effect.
          </P>
          <SingleCalculator
            details={`How content type affects an article's carbon footprint (${params.users.toLocaleString(
              "fi-FI"
            )} users):`}
            type="contentType"
          />
          <GraphTitle>Video optimization</GraphTitle>
          <P>
            Optimizing the video stream for the receiver’s screen size and
            network is an effective way to cut emissions. By sending standard
            definition (720p) content to mobile devices, around 25% of emissions
            can be saved compared to HD content, which typically is unecessarily
            high quality for the mobile screen.
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
            automatically upon opening the article. If autoplay is not on, a
            significant share of the data in news articles might not have to be
            loaded.
          </P>
          <SingleCalculator
            details={`How removing autoplay might affect the article carbon footprint (${params.users.toLocaleString(
              "fi-FI"
            )} users and ${params.streamContentLengthInMinutes.toLocaleString(
              "fi-FI"
            )} minutes of video):`}
            type="autoPlay"
          />
          <SectionTitle>Future Scenarios</SectionTitle>
          <P>
            The conventional wisdom of digitalisation as an intangible carbon
            sink is strong, and critical discourse typically translates slowly
            and awkwardly into behavioural change. From a technology design
            perspective, an interesting question is whether digital media
            services can be designed so that they would raise environmental
            concerns about their use in the context of their use, and encourage
            consumers to use them in a more environmentally friendly way. What
            "greener" choices could be offered to media consumers, while
            recognising that responsibility for more sustainable consumption
            cannot be shifted entirely to the consumer?
          </P>
          <P>
            To answer these questions we conducted workshops and interviews with
            Nordic media companies. Based on our research, we created six future
            scenarios through which digital media could evolve toward more
            sustainable futures. The scenarios are based on research literature,
            published reports, workshop data, and interviews collected in the
            research project. Nevertheless, they are scenarios: roadmaps towards
            possible futures, each of which has both benefits and drawbacks, and
            some that are more likely than others. They should therefore be read
            as partly fictional and speculative descriptions of the future, but
            nevertheless as descriptions that offer guidance on the journey
            towards greener digital media.
          </P>

          <Scenarios />

          <P>
            In the ReDime research project, we studied the views, discourses,
            and practices of digital media producers regarding the
            sustainability of media consumption and digital technology. In
            addition, we sought to find ways to make the carbon footprint of
            digital media services more visible. The research project was
            conducted in 2023-2024 at the Centre for Consumer Society Research
            at the University of Helsinki and Funded by the Media Industry
            Research Foundation of Finland. Download the full PDF report{" "}
            <A href={pdfUrl}>here</A>. Team members: Salla-Maaria Laaksonen,
            Meri Frig, Pekka Pulli, Erjon Skenderi, and Selma Suppanen.
          </P>
          <P>
            Original tree photo by{" "}
            <A href="https://unsplash.com/@niko_photos?utm_content=creditCopyText">
              niko photos
            </A>{" "}
            on Unsplash.
          </P>
        </TextContent>
      </ArticleContainer>
    </ArticleParamsContext.Provider>
  );
};

export default Article;
