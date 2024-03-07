import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

interface CheckMarkProps {
  checked: boolean;
  disabled?: boolean;
}

const CustomCheckmark = styled.div<CheckMarkProps>`
  position: relative;
  height: 24px;
  width: 25px;
  background-color: ${(p) => (p.checked ? theme.colors.darkGreen : "white")};
  border: ${(p) =>
    p.checked
      ? `1px solid ${theme.colors.darkGreen}`
      : `1px solid ${theme.colors.grey(3)}`};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(p) => (p.disabled ? 0.25 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "initial")};
`;

interface CheckboxInputProps {
  checked: boolean;
  handleClick: () => void;
  disabled?: boolean;
}

export const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = (
  props
): JSX.Element => {
  const checkMark = (
    <svg width="16px" height="12px" viewBox="0 0 22 16">
      <polygon
        fill="#FFFFFF"
        points="2.12132034 5.65685425 7.77746749 11.3130014 19.0918831 1.13686838e-13 21.2132034 2.12132034 7.77817459 15.5563492 -5.68434189e-14 7.77817459"
      />
    </svg>
  );

  return (
    <CustomCheckmark
      checked={props.checked}
      onMouseDown={props.handleClick}
      disabled={props.disabled}
    >
      {props.checked ? checkMark : undefined}
    </CustomCheckmark>
  );
};
