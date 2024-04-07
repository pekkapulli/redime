import { ContentType, Site, allContentTypes } from "../../types";
import { P, SectionTitle, Selector, SelectorLabel } from "../common-components";
import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { breakpoints, theme } from "../../theme";
import { NumberInput } from "../generic/NumberInput";
import OptionsSelector from "../generic/OptionsSelector";
import SliderInput from "../generic/SliderInput";
import { getStreamedContentDescription } from "../../util/texts";

const getOption = <T,>(option: T) => ({
  label: option,
  value: option,
});

const ControlsContainer = styled.div`
  border-right: 1px solid ${theme.colors.grey(4)};
  padding: 0 ${theme.spacing(3)} ${theme.spacing(3)} 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing(1)};

  @media (max-width: ${breakpoints.mobilePlus}px) {
    border-right: none;
    border-bottom: 1px solid ${theme.colors.grey(4)};
    padding: ${theme.spacing(3)} 0;
  }
`;

const forcedContentSites: Site[] = ["Areena"];

const Controls = () => {
  const { params, updateParams } = useContext(ArticleParamsContext);

  return (
    <ControlsContainer>
      <SectionTitle>Choices made in article content</SectionTitle>
      <Selector>
        <SelectorLabel>Content type</SelectorLabel>
        <OptionsSelector
          options={allContentTypes.map(getOption<ContentType>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ contentType: newValue })
          }
          value={params.contentType}
          disabled={forcedContentSites.includes(params.site)}
          params={params}
          paramName="contentType"
        />
        <P>
          The article's content type has the greatest effect on how much carbon
          is emitted. Video content produces so much transfer emissions that the
          amounts emitted from initial page loading are marginal.
        </P>
      </Selector>
      {/* <Selector>
        <SelectorLabel>Site</SelectorLabel>
        <OptionsSelector
          options={allSites.map(getOption<Site>)}
          onChange={(newValue) => {
            const forcedContentType: ContentType | undefined =
              newValue === "Areena" ? "Video" : undefined;
            updateParams({
              site: newValue,
              contentType: forcedContentType ?? params.contentType,
            });
          }}
          value={params.site}
          params={params}
          paramName="site"
        />
        <Details>
          <Summary>Site details</Summary>
          More data is downloaded on HS page load (due to Yle optimizations and
          HS ads), and HS uses a higher bit rate for video content.
        </Details>
      </Selector> */}
      <Selector>
        <SelectorLabel>Users</SelectorLabel>
        <NumberInput
          min={1000}
          step={1000}
          value={params.users}
          onChange={(value) => updateParams({ users: value })}
        />
      </Selector>
      {params.contentType !== "Text" && (
        <>
          <Selector>
            <SelectorLabel>{params.contentType} length</SelectorLabel>
            <NumberInput
              min={0.5}
              step={0.5}
              value={params.streamContentLengthInMinutes}
              onChange={(value) =>
                updateParams({ streamContentLengthInMinutes: value })
              }
              unit="min"
            />
          </Selector>
          {params.contentType === "Video" && (
            <Selector>
              <SelectorLabel>Optimize video</SelectorLabel>
              <OptionsSelector
                options={[
                  {
                    label: "On",
                    value: true,
                  },
                  {
                    label: "Off",
                    value: false,
                  },
                ]}
                onChange={(newValue) =>
                  updateParams({ optimizeVideo: newValue })
                }
                paramName="optimizeVideo"
                params={params}
                value={params.optimizeVideo}
              />
              <P>
                E.g. YouTube has a data saver mode, and generally optimizes
                video definition by network speed and device size. Here, for
                simplification, we optimize to 360p for mobile devices.
              </P>
            </Selector>
          )}
          <Selector>
            <SelectorLabel>Autoplay</SelectorLabel>
            <OptionsSelector
              options={[
                {
                  label: "On",
                  value: true,
                },
                {
                  label: "Off",
                  value: false,
                },
              ]}
              onChange={(newValue) => updateParams({ autoplay: newValue })}
              paramName="autoplay"
              params={params}
              value={params.autoplay}
            />
            <P>
              Playing the article's video automatically drastically reduces user
              choice on whether to play video content or not. Some users prefer
              to read a text version when available.
            </P>
          </Selector>
          {!params.autoplay && (
            <Selector>
              <SelectorLabel>
                Percentage of users who play{" "}
                {getStreamedContentDescription(params.contentType)} (when not on
                autoplay)
              </SelectorLabel>
              <SliderInput
                value={params.percentageOfUsersPlayingStreamContent}
                onChange={(value) =>
                  updateParams({ percentageOfUsersPlayingStreamContent: value })
                }
                showNumberInput
                min={0}
                max={100}
                step={10}
                params={params}
                paramName="percentageOfUsersPlayingStreamContent"
                unit="%"
              />
              <P>
                Some users may prefer text alternatives to{" "}
                {getStreamedContentDescription(params.contentType)}, or just
                want to read the text article. You can simulate these choices
                with this slider.
              </P>
            </Selector>
          )}
        </>
      )}

      <Selector>
        <SelectorLabel>Percentage of mobile users</SelectorLabel>
        <SliderInput
          value={params.percentageOfMobileUsers}
          onChange={(value) => updateParams({ percentageOfMobileUsers: value })}
          showNumberInput
          min={0}
          max={100}
          step={10}
          paramName="percentageOfMobileUsers"
          params={params}
          unit="%"
        />
        <P>
          Mobile use increases energy needed for data transfer, but decreases
          device power consumption. Around 40 % of Finnish households use 4G or
          5G routers for their home internet, so especially in Finland, using a
          computer doesn't always signify using a fixed internet connection.
        </P>
      </Selector>
    </ControlsContainer>
  );
};

export default Controls;
