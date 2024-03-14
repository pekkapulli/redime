import styled from "styled-components";
import { theme } from "../../theme";
import { ArticleSimulationParams } from "../../types";
import { useDeepMemo } from "../../util/useDeepMemo";
import { simulateArticleFootprint } from "../../util/simulations";
import { getCarbonKg } from "../../util/calculationUtils";
import { useState } from "react";
import { brighten } from "../../util/colors";

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
`;

const SelectItem = styled.div<{
  selected: boolean;
  hovered: "true" | "false";
  disabled?: boolean;
}>`
  height: 48px;
  width: 60px;
  border-bottom: ${(p) =>
    p.selected
      ? `3px solid ${
          p.hovered === "true"
            ? brighten(theme.colors.darkGreen)
            : theme.colors.darkGreen
        }`
      : p.hovered === "true"
      ? `3px solid ${brighten(theme.colors.grey(2))}`
      : "none"};
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  padding: 0 0 ${theme.spacing(0)} 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  transition: 0.3s border-width;
  ${(p) =>
    p.disabled
      ? `
    color: ${theme.colors.grey(3)};
    border-bottom: ${
      p.selected ? `3px solid ${brighten(theme.colors.grey(3))}` : "none"
    };
  `
      : ""}
`;

const BarContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.grey(2)};
`;

const Bar = styled.div`
  width: 80%;
  transition: background-color 0.3s;
`;

const Label = styled.span``;

const OptionsSelector = <T extends string | boolean>(
  props: OptionsSelectorProps<T>
) => {
  const { value, options, onChange, disabled, params, paramName } = props;
  const [hoveredValue, setHoveredValue] = useState<
    string | boolean | undefined
  >();

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
          key={o.value.toString()}
          selected={o.value === value}
          hovered={hoveredValue === o.value ? "true" : "false"}
          onClick={() => !disabled && onChange(o.value)}
          disabled={disabled}
          onMouseEnter={() => setHoveredValue(o.value)}
          onMouseLeave={() => setHoveredValue(undefined)}
        >
          <BarContainer>
            <Bar
              style={{
                height: `${(o.carbon / maxCarbon) * 100}%`,
                backgroundColor:
                  hoveredValue === o.value
                    ? brighten(
                        o.value === value
                          ? theme.colors.green
                          : theme.colors.grey(3)
                      )
                    : o.value === value
                    ? theme.colors.green
                    : theme.colors.grey(3),
              }}
            />
          </BarContainer>
          <Label>{o.label}</Label>
        </SelectItem>
      ))}
    </SelectorContainer>
  );
};

export default OptionsSelector;
