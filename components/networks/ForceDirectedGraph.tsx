import React, { useEffect, useRef, useCallback } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import type { NetworkData, Node, Link } from '../../types';

declare const d3: any;

const data: NetworkData = {
  nodes: [
    { id: "A", group: 1 }, { id: "B", group: 1 }, { id: "C", group: 1 },
    { id: "D", group: 2 }, { id: "E", group: 2 }, { id: "F", group: 2 },
    { id: "G", group: 3 }, { id: "H", group: 3 }, { id: "I", group: 3 },
    { id: "J", group: 4 }, { id: "K", group: 4 }, { id: "L", group: 4 },
  ],
  links: [
    { source: "A", target: "B", value: 1 }, { source: "B", target: "C", value: 1 },
    { source: "C", target: "A", value: 1 }, { source: "D", target: "E", value: 2 },
    { source: "E", target: "F", value: 2 }, { source: "F", target: "D", value: 2 },
    { source: "G", target: "H", value: 3 }, { source: "H", target: "I", value: 3 },
    { source: "I", target: "G", value: 3 }, { source: "J", target: "K", value: 4 },
    { source: "K", target: "L", value: 4 }, { source: "L", target: "J", value: 4 },
    { source: "A", target: "D", value: 5 }, { source: "B", target: "G", value: 5 },
    { source: "C", target: "J", value: 5 },
  ],
};

const ForceDirectedGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  const drawChart = useCallback(() => {
    if (!dimensions || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    svg.selectAll("*").remove();

    const links: Link[] = data.links.map(d => ({...d}));
    const nodes: Node[] = data.nodes.map(d => ({...d}));
    
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    
    const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(0, 0));

    const link = svg.append("g")
        .attr("class", "stroke-gray-500/60 stroke-1")
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", (d: Link) => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("class", "stroke-gray-200 stroke-1")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 8)
        .attr("fill", (d: Node) => color(d.group.toString()));

    node.append("title")
        .text((d: Node) => d.id);
        
    const drag = (simulation: any) => {
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    node.call(drag(simulation) as any);

    simulation.on("tick", () => {
      link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

      node
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
    });

  }, [dimensions]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div ref={wrapperRef} className="w-full h-full cursor-grab active:cursor-grabbing">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ForceDirectedGraph;
