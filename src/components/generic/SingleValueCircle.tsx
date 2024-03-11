import { scaleSqrt } from "d3-scale";
import {
  ParentDimensionsProps,
  withParentDimensions,
} from "../../util/withParentDimensions";
import styled from "styled-components";
import { theme } from "../../theme";
import { GraphTitle } from "../common-components";

const SingleValueCircleContainer = styled.figure`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing(0)};
`;

const Circle = styled.circle`
  transition: r 0.5s ease-in-out;
  fill: ${theme.colors.grey(2)};
`;

const Value = styled.div``;

const SingleValueCircle = withParentDimensions(
  (
    props: {
      maxValue: number;
      value: number;
      unit: string;
      title: string;
    } & ParentDimensionsProps
  ) => {
    const {
      parentDimensions: { width },
      maxValue,
      value,
      unit,
      title,
    } = props;

    const scaleSize = scaleSqrt()
      .range([0, width / 2])
      .domain([0, maxValue]);

    return (
      <SingleValueCircleContainer>
        <GraphTitle style={{ textAlign: "center" }}>{title}</GraphTitle>
        <svg width={width} height={width}>
          <Circle cx={width / 2} cy={width / 2} r={scaleSize(value)} />
        </svg>
        <Value>
          {value.toLocaleString("fi-FI", { maximumFractionDigits: 1 })} {unit}
        </Value>
      </SingleValueCircleContainer>
    );
  }
);

export default SingleValueCircle;
