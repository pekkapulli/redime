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
  disabled?: boolean;
}>`
  ${theme.fontBold};
  width: "100%";
  margin-bottom: ${theme.spacing(0)};
  color: ${(p) => (p.disabled ? theme.colors.grey(3) : theme.colors.black)};
`;

export const SectionTitle = styled.h2`
  ${theme.fontBold};
  ${theme.fontSize(2)};
`;

export const SubSectionTitle = styled.h3`
  ${theme.fontBold};
  ${theme.fontSize(1)};
`;

export const GraphTitle = styled.h3`
  ${theme.fontBold};
  ${theme.fontSize(0)};
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

export const Details = styled.details`
  ${theme.fontSize(-1)};
  ${theme.fontNormal};
  color: ${theme.colors.grey(1)};
`;

export const Summary = styled.summary`
  ${theme.fontSize(-1)};
  color: ${theme.colors.grey(1)};
  cursor: help;
`;

export const Spacer = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.grey(3)};
  margin: ${theme.spacing(5)} 0;
`;
