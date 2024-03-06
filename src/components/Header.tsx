import styled from "styled-components";
import { theme } from "../theme";

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing(3)} ${theme.spacing(4)};
  background-color: ${theme.colors.green};
`;

const Title = styled.h1`
  color: white;
  ${theme.fontSize(3)};
  ${theme.fontBold};
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <Title>ReDime prototypes</Title>
    </HeaderContainer>
  );
};
