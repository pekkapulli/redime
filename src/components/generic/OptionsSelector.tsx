import styled from "styled-components";
import { theme } from "../../theme";

type LabelValue<T> = {
  label: string;
  value: T;
};

interface OptionsSelectorProps<T> {
  options: LabelValue<T>[];
  onChange: (newOption: T) => void;
  value: T;
  disabled?: boolean;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing(1)};
`;

const SelectItem = styled.div<{ selected: boolean; disabled?: boolean }>`
  height: 24px;
  border-bottom: ${(p) =>
    p.selected ? `3px solid ${theme.colors.darkGreen}` : "none"};
  white-space: nowrap;
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  cursor: pointer;
  ${(p) =>
    p.disabled
      ? `
    color: ${theme.colors.grey(3)};
    border-bottom: ${p.selected ? `3px solid ${theme.colors.grey(3)}` : "none"};
  `
      : ""}
`;

const OptionsSelector = <T extends string>(props: OptionsSelectorProps<T>) => {
  const { value, options, onChange, disabled } = props;
  return (
    <SelectorContainer>
      {options.map((o) => (
        <SelectItem
          key={o.value}
          selected={o.value === value}
          onClick={() => !disabled && onChange(o.value)}
          disabled={disabled}
        >
          {o.label}
        </SelectItem>
      ))}
    </SelectorContainer>
  );
};

export default OptionsSelector;
