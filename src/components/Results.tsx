import styled from "styled-components";
import { calculateImpact } from "../util/calculateImpact";
import { useDeepMemo } from "../util/useDeepMemo";
import { useContext } from "react";
import { ParamsContext } from "../contexts/ParamsContext";

const ResultsContainer = styled.div``;

const Results = () => {
  const { params } = useContext(ParamsContext);
  const [impact] = useDeepMemo(() => {
    return [
      calculateImpact(
        params.deviceType,
        params.contentType,
        params.connectivityMethod,
        1
      ),
    ];
  }, [params]);

  return <ResultsContainer>{impact.total.carbon}</ResultsContainer>;
};

export default Results;
