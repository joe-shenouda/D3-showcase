import React, { useEffect, useRef, useCallback, useState } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import type { PieData } from '../../types';
import { Tooltip } from '../Tooltip';

declare const d3: any;

const data: PieData[] = [
    { name: 'USA', value: 40 },
    { name: 'India', value: 30 },
    { name: 'China', value: 20 },
    { name: 'Germany', value: 15 },
    { name: 'France', value: 10 },
];

const PieChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, content: string }>({ visible: false, x: 0, y: 0, content: '' });

    const drawChart = useCallback(() => {
        if (!dimensions || !svgRef.current) return;

        const { width, height } = dimensions;
        const radius = Math.min(width, height) / 2 - 20;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll("*").remove();

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeTableau10);

        const pie = d3.pie<PieData>().value((d: PieData) => d.value).sort(null);
        const data_ready = pie(data);

        const arc = d3.arc<any>()
            .innerRadius(radius * 0.5)
            .outerRadius(radius);
            
        const outerArc = d3.arc<any>()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        g.selectAll('path')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', (d: any) => color(d.data.name))
            .attr('class', 'stroke-gray-800 stroke-2 cursor-pointer transition-transform duration-200')
            .on('mouseover', (event: any, d: any) => {
                d3.select(event.currentTarget).attr('transform', 'scale(1.05)');
                setTooltip({
                    visible: true,
                    x: event.pageX,
                    y: event.pageY,
                    content: `${d.data.name}: ${d.data.value}`
                });
            })
            .on('mousemove', (event: any) => {
                setTooltip((prev: any) => ({ ...prev, x: event.pageX, y: event.pageY }));
            })
            .on('mouseout', (event: any, d: any) => {
                d3.select(event.currentTarget).attr('transform', '');
                setTooltip({ visible: false, x: 0, y: 0, content: '' });
            });
            
        // Add labels
        g.selectAll('text')
            .data(data_ready)
            .enter()
            .append('text')
            .text((d: any) => d.data.name)
            .attr('transform', (d: any) => `translate(${outerArc.centroid(d)})`)
            .attr('class', 'fill-white text-xs text-center pointer-events-none')
            .style('text-anchor', 'middle')

    }, [dimensions]);
    
    useEffect(() => {
        drawChart();
    }, [drawChart]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative">
            <svg ref={svgRef}></svg>
            <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} content={tooltip.content} />
        </div>
    );
};

export default PieChart;
