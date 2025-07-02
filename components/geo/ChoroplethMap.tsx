import React, { useEffect, useRef, useCallback, useState } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import { Tooltip } from '../Tooltip';

declare const d3: any;
declare const topojson: any;

const ChoroplethMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [worldData, setWorldData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    setLoading(true);
    // Using a reliable source for TopoJSON data
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((data: any) => {
        setWorldData(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Error loading map data:", err);
        setLoading(false);
      });
  }, []);

  const drawMap = useCallback(() => {
    if (!dimensions || !svgRef.current || !worldData) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();
    
    const projection = d3.geoMercator()
        .fitSize([width, height], topojson.feature(worldData, worldData.objects.countries));

    const path = d3.geoPath().projection(projection);
    
    const populationData = new Map(d3.range(200).map((i: number) => [i.toString(), Math.random() * 1000]));

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain(d3.extent(Array.from(populationData.values())) as [number, number]);
    
    const g = svg.append("g");

    g.selectAll("path")
      .data(topojson.feature(worldData, worldData.objects.countries).features)
      .join("path")
      .attr("d", path)
      .attr("class", "stroke-gray-800 stroke-[0.5px] transition-opacity duration-200")
      .attr("fill", (d: any) => colorScale(populationData.get(String(d.id)) || 0))
      .on("mouseover", (event: any, d: any) => {
          d3.select(event.currentTarget).style("opacity", 0.7);
          setTooltip({
              visible: true,
              x: event.pageX,
              y: event.pageY,
              content: `${d.properties.name}: ${Math.round(populationData.get(String(d.id)) || 0)}`
          });
      })
      .on("mousemove", (event: any) => {
          setTooltip((prev: any) => ({ ...prev, x: event.pageX, y: event.pageY }));
      })
      .on("mouseout", (event: any) => {
          d3.select(event.currentTarget).style("opacity", 1);
          setTooltip({ visible: false, x: 0, y: 0, content: '' });
      });

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event: any) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom as any);

  }, [dimensions, worldData]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading Map Data...</div>;
  }

  return (
    <>
      <div ref={wrapperRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <svg ref={svgRef}></svg>
      </div>
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} content={tooltip.content} />
    </>
  );
};

export default ChoroplethMap;
