import { ContentType, Site, allContentTypes, allSites } from "../../types";
import {
  Details,
  P,
  SectionTitle,
  Selector,
  SelectorLabel,
  Summary,
} from "../common-components";
import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { breakpoints, theme } from "../../theme";
import { NumberInput } from "../generic/NumberInput";
import OptionsSelector from "../generic/OptionsSelector";
import SliderInput from "../generic/SliderInput";

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

  const streamedContentDescription =
    params.contentType === "Video" ? "video" : "audio";

  return (
    <ControlsContainer>
      <SectionTitle>Options</SectionTitle>
      <P>
        Green bars above buttons indicate total carbon emissions related to the
        choice.
      </P>
      <Selector>
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
      </Selector>
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
      </Selector>
      <Selector>
        <SelectorLabel>Users</SelectorLabel>
        <NumberInput
          min={1}
          step={1}
          value={params.users}
          onChange={(value) => updateParams({ users: value })}
        />
      </Selector>
      {params.contentType !== "Text" && (
        <>
          <Selector>
            <SelectorLabel>{params.contentType} length (minutes)</SelectorLabel>
            <NumberInput
              min={0.5}
              step={0.5}
              value={params.streamContentLengthInMinutes}
              onChange={(value) =>
                updateParams({ streamContentLengthInMinutes: value })
              }
            />
          </Selector>
          {params.contentType === "Video" && (
            <Selector>
              <SelectorLabel>Optimize video (360p on mobile)</SelectorLabel>
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
              <Details>
                <Summary>Optimization details</Summary>
                E.g. YouTube has a data saver mode, and generally optimizes
                video definition by network speed and device size.
              </Details>
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
          </Selector>
          {!params.autoplay && (
            <Selector>
              <SelectorLabel>
                Percentage of users who play {streamedContentDescription} (when
                not on autoplay)
              </SelectorLabel>
              <SliderInput
                value={params.percentageOfUsersPlayingStreamContent}
                onChange={(value) =>
                  updateParams({ percentageOfUsersPlayingStreamContent: value })
                }
                showNumberInput
              />
              <Details>
                <Summary>Reasoning for user choice</Summary>
                Some users may prefer text alternatives to{" "}
                {streamedContentDescription}s or just want to read the text
                article. You can simulate these choices with this slider.
              </Details>
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
        />
        <Details>
          <Summary>Mobile use effects</Summary>
          Mobile use increases energy needed for data transfer, but decreases
          device power consumption.
        </Details>
      </Selector>
    </ControlsContainer>
  );
};

export default Controls;
