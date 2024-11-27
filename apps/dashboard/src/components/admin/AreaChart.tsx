import { AreaChart as TremorAreaChart } from '@tremor/react';

interface AreaChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
}

export function AreaChart({ data, index, categories, colors }: AreaChartProps) {
  return (
    <TremorAreaChart
      className="h-72"
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      showLegend={false}
      showGridLines={false}
      showAnimation
      curveType="monotone"
    />
  );
}