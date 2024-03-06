import Select from "react-select";
import { ContentType, Site, allContentTypes, allSites } from "../../types";
import { SectionTitle, Selector, SelectorLabel } from "../common-components";
import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { breakpoints, theme } from "../../theme";
import { NumberInput } from "../generic/NumberInput";
import { CheckboxInput } from "../generic/CheckboxInput";

const getOption = <T,>(option: T) => ({
  label: option,
  value: option,
});

const ControlsContainer = styled.div`
  border-right: 1px solid ${theme.colors.grey(4)};
  padding: 0 ${theme.spacing(3)} ${theme.spacing(3)} 0;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    border-right: none;
    border-bottom: 1px solid ${theme.colors.grey(4)};
    padding: ${theme.spacing(3)} 0;
  }
`;

const Controls = () => {
  const { params, updateParams } = useContext(ArticleParamsContext);

  return (
    <ControlsContainer>
      <SectionTitle>Options</SectionTitle>
      <Selector>
        <SelectorLabel>Device</SelectorLabel>
        <Select
          options={allSites.map(getOption<Site>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ site: newValue.value })
          }
          value={getOption(params.site)}
        />
      </Selector>
      <Selector>
        <SelectorLabel>Article type</SelectorLabel>
        <Select
          options={allContentTypes.map(getOption<ContentType>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ articleType: newValue.value })
          }
          value={getOption(params.articleType)}
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
      <Selector>
        <SelectorLabel>Video length (minutes)</SelectorLabel>
        <NumberInput
          min={0}
          step={0.5}
          value={params.videoLengthInMinutes}
          onChange={(value) => updateParams({ videoLengthInMinutes: value })}
        />
      </Selector>
      <Selector horizontal>
        <CheckboxInput
          checked={params.optimizeVideo}
          handleClick={() =>
            updateParams({ optimizeVideo: !params.optimizeVideo })
          }
        />
        <SelectorLabel horizontal>Optimize video</SelectorLabel>
      </Selector>
    </ControlsContainer>
  );
};

export default Controls;
