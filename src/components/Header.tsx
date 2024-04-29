import styled from "styled-components";
import { breakpoints, theme } from "../theme";
import { Link, useLocation } from "react-router-dom";

import coverPhoto from "/cover.jpg";

const HeaderContainer = styled.header`
  width: 100%;
  height: 75vh;
  min-height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-image: url(${coverPhoto});
  background-size: cover;
  background-position: bottom;
`;

const HeaderContent = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  max-width: 1280px;
  padding: ${theme.spacing(5)} ${theme.spacing(4)} ${theme.spacing(4)}
    ${theme.spacing(4)};
  width: 100%;
  gap: 8px;

  @media (max-width: ${breakpoints.mobile}px) {
    padding-top: ${theme.spacing(6)};
  }
`;

const Title = styled.h1`
  color: ${theme.colors.black};
  ${theme.fontSize(4)};
  ${theme.fontBold};
  margin: ${theme.spacing(4)} auto;
  text-align: center;
  max-width: 480px;

  @media (max-width: ${breakpoints.tablet}px) {
    ${theme.fontSize(3)};
  }

  @media (max-width: ${breakpoints.mobile}px) {
    ${theme.fontSize(2)};
  }

  @media (min-width: ${breakpoints.desktop}px) {
    ${theme.fontSize(5)};
    max-width: 720px;
  }
`;

const Links = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(3)};
`;

const NavigationLink = styled(Link)<{ selected: boolean }>`
  ${theme.fontSize(1)};
  ${theme.fontBold};
  color: ${theme.colors.black};
  text-decoration: none;
  height: 40px;
  box-sizing: border-box;
  padding-top: 8px;
  ${(p) =>
    p.selected ? `border-bottom: 3px solid ${theme.colors.black};` : ""}
`;

export const Header = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>ReDime: A Roadmap Towards Resource-wise Digital Media</Title>
        <Links>
          <NavigationLink selected={location.pathname === "/"} to="/">
            Article
          </NavigationLink>
          <NavigationLink
            selected={location.pathname === "/calculator"}
            to="/calculator"
          >
            Calculator
          </NavigationLink>
        </Links>
      </HeaderContent>
    </HeaderContainer>
  );
};
