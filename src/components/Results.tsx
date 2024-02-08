import { Params } from "../types";
import { calculateImpact } from "../util/calculateImpact";
import { useDeepMemo } from "../util/useDeepMemo";

interface ResultsProps {
  params: Params;
}

const Results = ({ params }: ResultsProps) => {
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

  return <div>{impact.carbon}</div>;
};

export default Results;
