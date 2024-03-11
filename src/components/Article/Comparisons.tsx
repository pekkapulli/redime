import styled from "styled-components";
import { ComparisonValues } from "../../types";
import SingleValueCircle from "../generic/SingleValueCircle";
import { theme } from "../../theme";
import { P } from "../common-components";

interface ComparisonProps {
  maxComparisons: ComparisonValues;
  comparisons: ComparisonValues;
}

const ComparisonsContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  max-width: 440px;
  width: 100%;
  gap: ${theme.spacing(3)};
`;

const Comparison = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Comparisons = (props: ComparisonProps) => {
  const { maxComparisons, comparisons } = props;
  return (
    <ComparisonsContainer>
      <Comparison>
        <SingleValueCircle
          maxValue={maxComparisons.drivingKMPetrolCar}
          value={comparisons.drivingKMPetrolCar}
        />
      </Comparison>
      <Comparison>
        <P style={{ fontWeight: 700, marginBottom: theme.spacing(2) }}>
          {(comparisons.lightBulbDurationSeconds / 3600).toLocaleString(
            "fi-FI",
            { maximumFractionDigits: 1 }
          )}{" "}
          hours of 40W lightbulb use.
        </P>
        <P style={{ fontWeight: 700 }}>
          {comparisons.drivingKMPetrolCar.toLocaleString("fi-FI", {
            maximumFractionDigits: 1,
          })}{" "}
          km of driving a petrol-powered car. use.
        </P>
      </Comparison>
    </ComparisonsContainer>
  );
};

export default Comparisons;
