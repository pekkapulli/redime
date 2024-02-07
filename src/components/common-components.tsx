import styled from "styled-components";
import { theme } from "../theme";

export const Selector = styled.div<{ horizontal?: boolean }>`
  margin-top: ${theme.spacing(2)};
  display: flex;
  width: 100%;
  ${theme.fontSize(-1)};
  ${(p) =>
    p.horizontal
      ? `
    flex-direcion: row;
    align-items: center;
  `
      : `
    flex-direction: column;
  `}
`;

export const SelectorLabel = styled.label<{
  horizontal?: boolean;
  disabled?: boolean;
}>`
  width: ${(p) => (p.horizontal ? "auto" : "100%")};
  margin-${(p) => (p.horizontal ? "right" : "bottom")}: ${theme.spacing(0)}};
  color: ${(p) => (p.disabled ? theme.colors.grey(3) : theme.colors.black)};
`;
