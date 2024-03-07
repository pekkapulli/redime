import styled from "styled-components";
import { theme } from "../theme";

export const Selector = styled.div<{ horizontal?: boolean }>`
  margin-top: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};
  display: flex;
  width: 100%;
  ${theme.fontSize(-1)};
  ${(p) =>
    p.horizontal
      ? `
    flex-direcion: row;
    align-items: center;
    gap: ${theme.spacing(1)}
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

export const SectionTitle = styled.h2`
  ${theme.fontBold};
  ${theme.fontSize(2)};
`;

// eslint-disable-next-line react-refresh/only-export-components
export const P = styled.p`
  ${theme.fontNormal};
  ${theme.fontSize(0)};
  color: ${theme.colors.darkGreen};
  margin: 0 0 ${theme.spacing(3)} 0;
  line-height: 1.6;
  max-width: 640px;
  width: 100%;
`;
