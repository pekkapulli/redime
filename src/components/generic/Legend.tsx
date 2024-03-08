import styled from "styled-components";
import { theme } from "../../theme";
import { ReactNode } from "react";

export const Legend = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing(4)};
`;

interface LegendItemProps {
  color: string;
  children: ReactNode;
  textColor?: string;
}

const LegendItemElement = styled.div<{ textColor?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  margin-right: ${theme.spacing(2)};
  margin-top: ${theme.spacing(1)};
  ${theme.fontSize(-1)};
  ${theme.fontLabelBold};
  color: ${(p) => (p.textColor ? p.textColor : theme.colors.darkGreen)};
`;

const ColorMarker = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(p) => p.color};
  margin-right: ${theme.spacing(0)};
  border-radius: 50%;
`;

export const LegendItem: React.FunctionComponent<LegendItemProps> = (props) => (
  <LegendItemElement textColor={props.textColor}>
    <ColorMarker color={props.color} />
    <div>{props.children}</div>
  </LegendItemElement>
);
