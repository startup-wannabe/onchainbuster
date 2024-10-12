import * as d3 from 'd3';

type CircularPackingProps = {
  width: number;
  height: number;
  data: TCircularTree;
};

const colors = ['#266EFF', '#92B6FF', '#D3E1FF', '#003EC1', '#266EFF'];

export const CircularPackingChart = ({
  width,
  height,
  data,
}: CircularPackingProps) => {
  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    .sort((a, b) => b.value! - a.value!);

  const packGenerator = d3
    .pack<TCircularTree>()
    .size([width, height])
    .padding(4);
  const root = packGenerator(hierarchy);

  // List of item of level 1 (just under root) & related color scale
  const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(firstLevelGroups || [])
    .range(colors);

  // Circles for level 1 of the hierarchy
  const allLevel1Circles = root
    .descendants()
    .filter((node) => node.depth === 1)
    .map((node) => {
      const parentName = node.data.name;
      return (
        <g key={node.data.name}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            stroke={colorScale(parentName)}
            strokeWidth={5}
            strokeOpacity={0.3}
            fill={colorScale(parentName)}
            fillOpacity={0.1}
          />
        </g>
      );
    });

  // Circles for level 2 = leaves
  const allLeafCircles = root.leaves().map((leaf) => {
    const parentName = leaf.parent?.data.name;

    if (!parentName) {
      return null;
    }

    return (
      <g key={leaf.data.name}>
        <circle
          cx={leaf.x}
          cy={leaf.y}
          r={leaf.r}
          stroke={colorScale(parentName)}
          strokeWidth={2}
          fill={colorScale(parentName)}
          fillOpacity={0.2}
        />
        {(leaf.value || 0) > ((root.value || 1) * 1) / 100 && (
          <text
            key={leaf.data.name}
            x={leaf.x}
            y={leaf.y}
            fontSize={12}
            fontWeight={14}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {leaf.data.name}
          </text>
        )}
      </g>
    );
  });

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'inline-block' }}
      role="img"
      aria-label="svg"
    >
      {allLevel1Circles}
      {allLeafCircles}
    </svg>
  );
};
