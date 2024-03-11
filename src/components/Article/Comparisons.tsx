import styled from "styled-components";
import { ComparisonValues } from "../../types";
import SingleValueCircle from "../generic/SingleValueCircle";
import { theme } from "../../theme";

interface ComparisonProps {
  maxComparisons: ComparisonValues;
  comparisons: ComparisonValues;
}

const ComparisonsContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  max-width: 480px;
  width: 100%;
  gid-column-gap: ${theme.spacing(3)};
`;

const Comparison = styled.div``;

const Comparisons = (props: ComparisonProps) => {
  const { maxComparisons, comparisons } = props;
  return (
    <ComparisonsContainer>
      <Comparison>
        <SingleValueCircle
          maxValue={maxComparisons.drivingKMPetrolCar}
          value={comparisons.drivingKMPetrolCar}
          unit="km"
          title="Driving with a petrol car"
        />
      </Comparison>
      <Comparison>
        <SingleValueCircle
          maxValue={maxComparisons.lightBulbsDuration / 3600}
          value={comparisons.lightBulbsDuration / 3600}
          unit="hours"
          title="Hours of 40W lightbulb use"
        />
      </Comparison>
    </ComparisonsContainer>
  );
};

export default Comparisons;
