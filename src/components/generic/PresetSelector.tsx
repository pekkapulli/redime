import styled from "styled-components";
import { theme } from "../../theme";
import { useState } from "react";
import { brighten } from "../../util/colors";

type LabelValue<T> = {
  label: string;
  value: T;
};

interface OptionsSelectorProps<T> {
  options: LabelValue<T>[];
  onChange: (newOption: T) => void;
  value: T;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${theme.spacing(2)} 0;
`;

const SelectItem = styled.div<{
  selected: boolean;
  $hovered: boolean;
  disabled?: boolean;
}>`
  width: 60px;
  border-bottom: ${(p) =>
    p.selected
      ? `3px solid ${
          p.$hovered ? brighten(theme.colors.darkGreen) : theme.colors.darkGreen
        }`
      : p.$hovered
      ? `3px solid ${brighten(theme.colors.grey(2))}`
      : "none"};
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  padding: 0 0 2px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  transition: 0.3s border-width;
  ${(p) =>
    p.disabled
      ? `
    color: ${theme.colors.grey(3)};
    border-bottom: ${
      p.selected ? `3px solid ${brighten(theme.colors.grey(3))}` : "none"
    };
  `
      : ""}
`;

const Label = styled.span`
  color: ${theme.colors.darkGreen};
`;

const PresetSelector = <T extends string | boolean | number>(
  props: OptionsSelectorProps<T>
) => {
  const { options, onChange, value } = props;
  const [hoveredValue, setHoveredValue] = useState<
    string | boolean | number | undefined
  >();

  return (
    <SelectorContainer>
      {options.map((o) => (
        <SelectItem
          key={o.value.toString()}
          selected={o.value === value}
          $hovered={hoveredValue === o.value}
          onClick={() => onChange(o.value)}
          onMouseEnter={() => setHoveredValue(o.value)}
          onMouseLeave={() => setHoveredValue(undefined)}
        >
          <Label>{o.label}</Label>
        </SelectItem>
      ))}
    </SelectorContainer>
  );
};

export default PresetSelector;
