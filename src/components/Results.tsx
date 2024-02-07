import { Params } from "../types";
import { calculateImpact } from "../util/calculateImpact";

interface ResultsProps {
  params: Params;
}

const Results = ({ params }: ResultsProps) => {
  const results = calculateImpact(
    params.deviceType,
    params.contentType,
    params.connectivityMethod,
    1
  );
  return <div>{results.carbon}</div>;
};

export default Results;
