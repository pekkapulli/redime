import styled from "styled-components";
import {
  ParentDimensionsProps,
  withParentDimensions,
} from "../../util/withParentDimensions";
import { scaleLinear } from "d3-scale";
import { theme } from "../../theme";
import { SmallGraphTitle } from "../common-components";
import { Legend, LegendItem } from "./Legend";
import { useState } from "react";
import { brighten } from "../../util/colors";

const MeterContainer = styled.figure`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: ${theme.spacing(1)} 0;
`;

const Bar = styled.rect`
  stroke: none;
  transition: fill 0.3s;
`;

const Label = styled.text`
  text-anchor: left;
  ${theme.fontSize(0)};
  ${theme.fontBold};
  fill: ${theme.colors.darkGreen};
`;

const Tick = styled.text`
  text-anchor: middle;
  ${theme.fontSize(-1)};
  ${theme.fontNormal};
  fill: ${theme.colors.darkGreen};
`;

type Value = {
  label: string;
  value: number;
  color: string;
};

interface MeterProps {
  maxValue: number;
  values: Value[];
  unit: string;
  title: string;
  maxValueLabel?: string;
}

const Meter = withParentDimensions(
  ({
    maxValue,
    values,
    unit,
    title,
    parentDimensions,
    maxValueLabel,
  }: MeterProps & ParentDimensionsProps) => {
    const [hoveredLabel, setHoveredLabel] = useState<string | undefined>();

    const barHeight = 30;

    const margins = {
      top: 24,
      bottom: maxValueLabel !== undefined ? 50 : 20,
      left: 5,
      right: 10,
    };

    const width = Math.min(480, parentDimensions.width);
    const height = barHeight + margins.top + margins.bottom;
    const contentWidth = width - margins.left - margins.right;
    const widthScale = scaleLinear<number, number>()
      .range([0, contentWidth])
      .domain([0, maxValue]);

    const totalValue = values.reduce((total, v) => total + v.value, 0);

    const { valueBars } = values.reduce<{
      valueBars: { x: number; width: number; value: Value }[];
      location: number;
    }>(
      (result, v) => {
        const barWidth = widthScale(v.value);
        return {
          valueBars: result.valueBars.concat({
            x: result.location,
            width: barWidth,
            value: v,
          }),
          location: result.location + barWidth,
        };
      },
      {
        valueBars: [],
        location: 0,
      }
    );

    const label = `${totalValue.toLocaleString("fi-FI", {
      maximumFractionDigits: 3,
    })} ${unit}`;

    return (
      <MeterContainer>
        <SmallGraphTitle>{title}</SmallGraphTitle>
        {width > 0 && (
          <svg width={width} height={height}>
            {maxValueLabel !== undefined && (
              <g>
                <line
                  stroke={theme.colors.grey(2)}
                  strokeWidth={2}
                  y1={0}
                  y2={height}
                  x1={margins.left + widthScale(maxValue)}
                  x2={margins.left + widthScale(maxValue)}
                />

                <text
                  textAnchor="end"
                  x={margins.left + widthScale(maxValue) - 3}
                  y={height - 4}
                  fontSize={theme.fontSizeNumber(0)}
                  fill={theme.colors.grey(2)}
                  fontWeight="bold"
                >
                  {maxValueLabel}
                </text>
              </g>
            )}
            {widthScale.ticks(5).map((t) => {
              const x = margins.left + widthScale(t);
              return (
                x < width - margins.right && (
                  <g key={t}>
                    <line
                      stroke={theme.colors.darkGreen}
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      y1={margins.top - 3}
                      y2={margins.top + barHeight + 4}
                      x1={x}
                      x2={x}
                    />
                    <Tick x={x} y={margins.top + barHeight + 18}>
                      {t.toLocaleString("fi-FI", { maximumFractionDigits: 2 })}
                    </Tick>
                  </g>
                )
              );
            })}
            <line
              stroke={theme.colors.darkGreen}
              strokeWidth={2}
              y1={0}
              y2={margins.top + barHeight + 3}
              x1={margins.left}
              x2={margins.left}
            />
            {valueBars.map((bar) => {
              return (
                <Bar
                  key={bar.value.label}
                  x={margins.left + bar.x}
                  y={margins.top}
                  width={bar.width}
                  height={barHeight}
                  fill={
                    hoveredLabel === bar.value.label
                      ? brighten(bar.value.color)
                      : bar.value.color
                  }
                  onMouseEnter={() => setHoveredLabel(bar.value.label)}
                  onMouseLeave={() => setHoveredLabel(undefined)}
                />
              );
            })}
            <Label x={margins.left + 3} y={margins.top - 8}>
              {label}
            </Label>
          </svg>
        )}
        <Legend>
          {values.map((v) => (
            <LegendItem
              color={hoveredLabel === v.label ? brighten(v.color) : v.color}
              key={v.label}
              onMouseEnter={() => setHoveredLabel(v.label)}
              onMouseLeave={() => setHoveredLabel(undefined)}
            >
              {v.value.toLocaleString("fi-FI", { maximumFractionDigits: 2 })} kg{" "}
              {v.label}
            </LegendItem>
          ))}
        </Legend>
      </MeterContainer>
    );
  }
);

export default Meter;
