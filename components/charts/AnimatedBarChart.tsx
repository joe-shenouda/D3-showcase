import React, { useState, useEffect, useRef, useCallback } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import type { BarData, Dimension } from '../../types';

declare const d3: any;

const generateData = (): BarData[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
    name: letters[i],
    value: Math.floor(Math.random() * 100) + 10,
  }));
};

const AnimatedBarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [data, setData] = useState<BarData[]>(generateData);

  const drawChart = useCallback((dataToDraw: BarData[]) => {
    if (!dimensions || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // Clear previous render
    svg.selectAll("*").remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const x = d3.scaleBand()
      .domain(dataToDraw.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataToDraw, (d: BarData) => d.value) || 100])
      .range([height, 0]);

    const xAxis = g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .attr('class', 'text-gray-400');
    
    xAxis.selectAll('path, line').attr('class', 'stroke-gray-600');

    const yAxis = g.append('g')
      .call(d3.axisLeft(y))
      .attr('class', 'text-gray-400');

    yAxis.selectAll('path, line').attr('class', 'stroke-gray-600');

    const t = svg.transition().duration(750);

    g.selectAll('rect')
      .data(dataToDraw, (d: any) => d.name)
      .join(
        (enter: any) => enter.append('rect')
          .attr('x', (d: BarData) => x(d.name)!)
          .attr('y', y(0))
          .attr('width', x.bandwidth())
          .attr('height', 0)
          .attr('class', 'fill-cyan-500 hover:fill-cyan-400 transition-colors')
          .call((enter: any) => enter.transition(t)
            .attr('y', (d: BarData) => y(d.value))
            .attr('height', (d: BarData) => height - y(d.value))),
        (update: any) => update
          .call((update: any) => update.transition(t)
            .attr('x', (d: BarData) => x(d.name)!)
            .attr('y', (d: BarData) => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', (d: BarData) => height - y(d.value))),
        (exit: any) => exit
          .attr('class', 'fill-red-500')
          .call((exit: any) => exit.transition(t)
            .attr('y', y(0))
            .attr('height', 0)
            .remove())
      );

  }, [dimensions]);

  useEffect(() => {
    drawChart(data);
  }, [data, drawChart]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div ref={wrapperRef} className="w-full flex-grow">
        <svg ref={svgRef}></svg>
      </div>
      <button
        onClick={() => setData(generateData())}
        className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-md transition-colors"
      >
        Update Data
      </button>
    </div>
  );
};

export default AnimatedBarChart;
