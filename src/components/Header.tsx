import styled from "styled-components";
import { theme } from "../theme";

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.green};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  max-width: 1280px;
  padding: ${theme.spacing(3)} ${theme.spacing(4)};
  width: 100%;
`;

const Title = styled.h1`
  color: white;
  ${theme.fontSize(3)};
  ${theme.fontBold};
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>ReDime Smarticle</Title>
      </HeaderContent>
    </HeaderContainer>
  );
};
