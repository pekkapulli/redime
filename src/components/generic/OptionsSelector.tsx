import styled from "styled-components";
import { theme } from "../../theme";
import { ArticleSimulationParams } from "../../types";
import { useDeepMemo } from "../../util/useDeepMemo";
import { simulateArticleFootprint } from "../../util/simulations";
import { getCarbonKg } from "../../util/calculationUtils";

type LabelValue<T> = {
  label: string;
  value: T;
};

interface OptionsSelectorProps<T> {
  options: LabelValue<T>[];
  onChange: (newOption: T) => void;
  value: T;
  disabled?: boolean;
  params: ArticleSimulationParams;
  paramName: keyof ArticleSimulationParams;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing(1)};
`;

const SelectItem = styled.div<{ selected: boolean; disabled?: boolean }>`
  height: 48px;
  width: 60px;
  border-bottom: ${(p) =>
    p.selected ? `3px solid ${theme.colors.darkGreen}` : "none"};
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  padding: 0 0 ${theme.spacing(0)};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  ${(p) =>
    p.disabled
      ? `
    color: ${theme.colors.grey(3)};
    border-bottom: ${p.selected ? `3px solid ${theme.colors.grey(3)}` : "none"};
  `
      : ""}
`;

const BarContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Bar = styled.div`
  width: 100%;
  background-color: ${theme.colors.green};
`;

const OptionsSelector = <T extends string>(props: OptionsSelectorProps<T>) => {
  const { value, options, onChange, disabled, params, paramName } = props;

  const [optionsWithImpact, maxCarbon] = useDeepMemo(() => {
    const optionsWithImpact = options.map((o) => {
      return {
        ...o,
        carbon: getCarbonKg(
          simulateArticleFootprint({
            ...params,
            [paramName]: o.value,
          }),
          "totalImpact"
        ),
      };
    });
    const maxCarbon = Math.max(...optionsWithImpact.map((o) => o.carbon));

    return [optionsWithImpact, maxCarbon];
  }, [params, paramName]);

  return (
    <SelectorContainer>
      {optionsWithImpact.map((o) => (
        <SelectItem
          key={o.value}
          selected={o.value === value}
          onClick={() => !disabled && onChange(o.value)}
          disabled={disabled}
        >
          <BarContainer>
            <Bar
              style={{
                height: `${(o.carbon / maxCarbon) * 100}%`,
                backgroundColor:
                  o.value === value ? theme.colors.green : theme.colors.grey(3),
              }}
            />
          </BarContainer>
          {o.label}
        </SelectItem>
      ))}
    </SelectorContainer>
  );
};

export default OptionsSelector;
