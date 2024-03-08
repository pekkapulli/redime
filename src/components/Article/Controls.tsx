import { ContentType, Site, allContentTypes, allSites } from "../../types";
import { SectionTitle, Selector, SelectorLabel } from "../common-components";
import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { breakpoints, theme } from "../../theme";
import { NumberInput } from "../generic/NumberInput";
import { CheckboxInput } from "../generic/CheckboxInput";
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

  return (
    <ControlsContainer>
      <SectionTitle>Options</SectionTitle>
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
            <Selector horizontal>
              <CheckboxInput
                checked={params.optimizeVideo}
                handleClick={() =>
                  updateParams({ optimizeVideo: !params.optimizeVideo })
                }
              />
              <SelectorLabel horizontal>
                Optimize video (360p on mobile)
              </SelectorLabel>
            </Selector>
          )}
          <Selector horizontal>
            <CheckboxInput
              checked={params.autoplay}
              handleClick={() => updateParams({ autoplay: !params.autoplay })}
            />
            <SelectorLabel horizontal>Autoplay</SelectorLabel>
          </Selector>
          {!params.autoplay && (
            <Selector>
              <SelectorLabel>
                Percentage of users who play streamed content (if not on
                autoplay)
              </SelectorLabel>
              <SliderInput
                value={params.percentageOfUsersPlayingStreamContent}
                onChange={(value) =>
                  updateParams({ percentageOfUsersPlayingStreamContent: value })
                }
                showNumberInput
              />
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
      </Selector>
    </ControlsContainer>
  );
};

export default Controls;
