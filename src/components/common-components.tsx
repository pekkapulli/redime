import styled from "styled-components";
import { theme } from "../theme";
import { brighten } from "../util/colors";

export const TextContent = styled.div`
  width: 100%;
  max-width: 640px;
`;

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
  ${theme.fontSize(1)};
  width: "100%";
  margin-bottom: ${theme.spacing(0)};
  color: ${(p) => (p.disabled ? theme.colors.grey(3) : theme.colors.black)};
`;

export const SectionTitle = styled.h2`
  ${theme.fontBold};
  ${theme.fontSize(2)};
`;

export const SectionSubTitle = styled.h3`
  ${theme.fontBold};
  ${theme.fontSize(1)};
`;

export const GraphTitle = styled.h3`
  ${theme.fontBold};
  ${theme.fontSize(0)};
`;

export const SmallGraphTitle = styled.h4`
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  text-transform: uppercase;
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

// eslint-disable-next-line react-refresh/only-export-components
export const SmallP = styled(P)`
  ${theme.fontSize(-1)};
  margin: ${theme.spacing(1)} 0 ${theme.spacing(3)} 0;
`;

// eslint-disable-next-line react-refresh/only-export-components
export const A = styled.a`
  ${theme.fontBold};
  color: ${theme.colors.green};

  &:hover {
    color: ${brighten(theme.colors.green)};
  }

  &:visited {
    color: ${theme.colors.green};
  }
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

export const Button = styled.button<{ selected?: boolean }>`
  background-color: ${theme.colors.green};
  padding: ${theme.spacing(0)} ${theme.spacing(2)};
  color: white;
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 1;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  display: inline-block;
  border-radius: 6px;
  border: 1px solid ${theme.colors.green};
  transition: all 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  & + & {
    margin-left: ${theme.spacing(2)};
  }

  &:hover {
    background-color: ${theme.colors.darkGreen};
    color: white;
  }

  &:disabled {
    background-color: ${theme.colors.grey(3)};
    border: 1px solid ${theme.colors.grey(2)};
    color: ${theme.colors.grey(2)};
    cursor: not-allowed;
  }
`;
