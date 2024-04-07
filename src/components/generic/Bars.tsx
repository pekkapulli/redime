import styled from "styled-components";
import { theme } from "../../theme";

export const BarContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.grey(2)};
`;

export const Bar = styled.div<{ widthPercentage?: number }>`
  width: ${(p) =>
    p.widthPercentage !== undefined ? `${p.widthPercentage}%` : "80%"};
  transition: background-color 0.3s;
`;
