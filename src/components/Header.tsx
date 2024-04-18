import styled from "styled-components";
import { theme } from "../theme";
import { Link, useLocation } from "react-router-dom";

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
  padding: ${theme.spacing(2)} ${theme.spacing(4)};
  width: 100%;
  gap: 8px;
`;

const Title = styled.h1`
  color: white;
  ${theme.fontSize(1)};
  ${theme.fontBold};
  margin-right: ${theme.spacing(4)};
`;

const StyledLink = styled(Link)<{ selected: boolean }>`
  color: white;
  text-decoration: none;
  height: 40px;
  box-sizing: border-box;
  padding-top: 8px;
  ${(p) => (p.selected ? `border-bottom: 3px solid white;` : "")}
`;

export const Header = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>ReDime</Title>
        <StyledLink selected={location.pathname === "/"} to="/">
          Article
        </StyledLink>
        <StyledLink
          selected={location.pathname === "/calculator"}
          to="/calculator"
        >
          Calculator
        </StyledLink>
      </HeaderContent>
    </HeaderContainer>
  );
};
