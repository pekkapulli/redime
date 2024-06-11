import styled from "styled-components";
import { NumberInput } from "./NumberInput";
import { theme } from "../../theme";
import { simulateArticleFootprint } from "../../util/simulations";
import { getCarbonKg } from "../../util/calculationUtils";
import { useState } from "react";
import { useDeepMemo } from "../../util/useDeepMemo";
import { ArticleSimulationParams } from "../../types";
import { range } from "lodash";
import { Bar } from "./Bars";
import { brighten } from "../../util/colors";

interface SliderInputProps {
  min: number;
  max: number;
  step: number;
  onChange: (newValue: number) => void;
  value: number;
  params: ArticleSimulationParams;
  paramName: keyof ArticleSimulationParams;
  showNumberInput?: boolean;
  unit?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  margin: ${theme.spacing(2)} 0;
`;

const margin = 16;

const RangeComponent = styled.input`
  width: calc(100% - ${margin}px);
  max-width: calc(320px - ${margin}px);
  margin-right: 8px;
  margin-left: 8px;
`;

const Steps = styled.div`
  width: 100%;
  max-width: 320px;
  margin-right: 0;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const SliderInput = (props: SliderInputProps) => {
  const {
    min,
    max,
    step,
    onChange,
    value,
    showNumberInput,
    params,
    paramName,
    unit,
  } = props;

  const [hoveredValue, setHoveredValue] = useState<number | undefined>();

  const [stepsWithImpact, maxCarbon] = useDeepMemo(() => {
    const steps = range(min, max + step, step);
    const optionsWithImpact = steps.map((step) => {
      return {
        step,
        carbon: getCarbonKg(
          simulateArticleFootprint({
            ...params,
            [paramName]: step,
          }),
          "totalImpact"
        ),
      };
    });
    const maxCarbon = Math.max(...optionsWithImpact.map((o) => o.carbon));

    return [optionsWithImpact, maxCarbon];
  }, [params, paramName]);

  return (
    <Container>
      <Steps>
        {stepsWithImpact.map((step) => {
          return (
            <Bar
              key={step.step}
              style={{
                height: `${(step.carbon / maxCarbon) * 100}%`,
                backgroundColor:
                  hoveredValue === step.step
                    ? brighten(
                        step.step === value
                          ? theme.colors.darkGreen
                          : theme.colors.grey(3)
                      )
                    : step.step === value
                    ? theme.colors.darkGreen
                    : theme.colors.grey(3),
              }}
              $widthPercentage={100 / stepsWithImpact.length}
              onMouseEnter={() => setHoveredValue(step.step)}
              onMouseLeave={() => setHoveredValue(undefined)}
              onClick={() => onChange(step.step)}
            />
          );
        })}
      </Steps>

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
          unit={unit}
        />
      )}
    </Container>
  );
};

export default SliderInput;
