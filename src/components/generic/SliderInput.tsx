import styled from "styled-components";
import { NumberInput } from "./NumberInput";

interface SliderInputProps {
  min?: number;
  max?: number;
  step?: number;
  onChange: (newValue: number) => void;
  value: number;
  showNumberInput?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
`;

const RangeComponent = styled.input`
  width: 60%;
  max-width: 320px;
`;

const SliderInput = (props: SliderInputProps) => {
  const { min, max, step, onChange, value, showNumberInput } = props;

  return (
    <Container>
      <RangeComponent
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        value={value}
        step={step ?? 1}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
      />
      {showNumberInput && (
        <NumberInput
          value={value}
          onChange={(value) => onChange(value)}
          min={min ?? 0}
          max={max ?? 100}
          step={step ?? 1}
        />
      )}
    </Container>
  );
};

export default SliderInput;
