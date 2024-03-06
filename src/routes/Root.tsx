import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

const AppContent = styled.div`
  width: 100%;
  position: relative;
`;

const SiteContent = styled.div``;

const Root = () => {
  return (
    <AppContent>
      <Header />
      <SiteContent>
        <Outlet />
      </SiteContent>
    </AppContent>
  );
};

export default Root;
