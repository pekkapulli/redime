import { useState } from "react";
import { Params } from "../types";
import Controls from "../components/Controls";
import Results from "../components/Results";
import styled from "styled-components";
import { breakpoints, theme } from "../theme";
import { Outlet } from "react-router-dom";
import { ParamsContext } from "../contexts/ParamsContext";

const AppContent = styled.div`
  width: 100%;
  position: relative;
`;

const ControlsAndResults = styled.div`
  width: 240px;
  position: fixed;
  right: 0;
  top: ${theme.spacing(4)};
  padding: ${theme.spacing(3)};

  @media (max-width: ${breakpoints.tablet}px) {
    position: relative;
    width: 100%;
  }
`;

const SiteContent = styled.div``;

const Root = () => {
  const [params, setParams] = useState<Params>({
    connectivityMethod: "WIFI",
    deviceType: "Phone",
    contentType: "Text",
  });

  const setParamsHelper = (newParams: Partial<Params>) => {
    setParams((oldParams) => ({
      ...oldParams,
      ...newParams,
    }));
  };

  return (
    <AppContent>
      <ParamsContext.Provider value={{ params, updateParams: setParamsHelper }}>
        <ControlsAndResults>
          <Controls />
          <Results />
        </ControlsAndResults>
        <SiteContent>
          <Outlet />
        </SiteContent>
      </ParamsContext.Provider>
    </AppContent>
  );
};

export default Root;
