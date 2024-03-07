import styled from "styled-components";
import { theme } from "../../theme";

export const SelectorInput = styled.input`
  padding: 5px;
  flex-grow: 1;
  border: 1px solid
    ${(p) => (p.disabled ? theme.colors.grey(3) : theme.colors.grey(3))};
  border-radius: 4px;
  height: 24px;
  ${theme.fontSize(-1)};
  color: ${(p) => (p.disabled ? theme.colors.grey(2) : theme.colors.darkGreen)};
  background-color: ${(p) =>
    p.disabled ? theme.colors.grey(4) : theme.colors.white};
`;

export interface NumberSelectorProps {
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  isFloat?: boolean;
  value?: number | string;
  onChange?: (value: number) => void;
}

export const NumberInput = (props: NumberSelectorProps): JSX.Element => {
  const { disabled, min, max, step, value, onChange } = props;

  return (
    <SelectorInput
      value={value}
      type="number"
      onChange={(e) =>
        e.target.value && onChange && onChange(Number(e.target.value))
      }
      disabled={disabled}
      min={min}
      step={step}
      max={max}
    />
  );
};
