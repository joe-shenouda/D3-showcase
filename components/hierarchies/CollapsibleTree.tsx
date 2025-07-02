import React, { useEffect, useRef, useCallback, useState } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import type { HierarchyData } from '../../types';

declare const d3: any;

const initialData: HierarchyData = {
    name: "CEO",
    children: [
      {
        name: "Manager A",
        children: [
          { name: "Team Lead 1", children: [{ name: "Dev 1" }, { name: "Dev 2" }] },
          { name: "Team Lead 2", children: [{ name: "Dev 3" }, { name: "Dev 4" }] },
        ],
      },
      {
        name: "Manager B",
        children: [
            { name: "Team Lead 3" },
            { name: "Team Lead 4", children: [{name: "Dev 5"}] }
        ],
      },
      {
        name: "Manager C",
      }
    ],
  };

const CollapsibleTree: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [data, setData] = useState(initialData);

    const draw = useCallback(() => {
        if (!dimensions || !svgRef.current) return;

        const { width, height } = dimensions;
        const margin = { top: 50, right: 120, bottom: 50, left: 120 };
        const innerWidth = width - margin.left - margin.right;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-margin.left, -margin.top, width, height])
            .classed('overflow-visible', true);
        
        svg.selectAll("*").remove();
        
        const g = svg.append("g");
        
        const root = d3.hierarchy(data);
        const dx = 25;
        const dy = innerWidth / (root.height + 1);
        const treeLayout = d3.tree().nodeSize([dx, dy]);

        root.x0 = dy / 2;
        root.y0 = 0;
        root.descendants().forEach((d: any, i: number) => {
          d.id = i;
          d._children = d.children;
          if (d.depth && d.data.name.length !== 7) d.children = null;
        });
        
        const update = (source: any) => {
            const duration = 250;
            const nodes = root.descendants().reverse();
            const links = root.links();

            treeLayout(root);

            root.eachBefore((node: any) => {
                if (node.x < (left as any).x) left = node;
                if (node.x > (right as any).x) right = node;
            });
            
            const transition = g.transition().duration(duration);

            const node = g.selectAll('g.node')
                .data(nodes, (d:any) => d.id);

            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on('click', (event: any, d: any) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                });
            
            nodeEnter.append('circle')
                .attr('r', 5)
                .attr('class', (d: any) => d._children ? 'stroke-cyan-400 fill-cyan-400' : 'stroke-gray-500 fill-gray-500')
                .attr("stroke-width", 2);

            nodeEnter.append('text')
                .attr('dy', '0.31em')
                .attr('x', (d: any) => d._children ? -10 : 10)
                .attr('text-anchor', (d: any) => d._children ? 'end' : 'start')
                .text((d:any) => d.data.name)
                .attr('class', 'fill-gray-200 stroke-gray-900')
                .style('paint-order', 'stroke');

            node.merge(nodeEnter).transition(transition)
                .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);
            
            node.exit().transition(transition).remove()
                .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            const link = g.selectAll('path.link')
                .data(links, (d:any) => d.target.id);
            
            const linkEnter = link.enter().append('path')
                .attr('class', 'link fill-none stroke-gray-600')
                .attr('d', (d: any) => {
                    const o = {x: source.x0, y: source.y0};
                    return d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x)({source: o, target: o})
                });
            
            link.merge(linkEnter).transition(transition)
                .attr('d', d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x));

            link.exit().transition(transition).remove()
                .attr('d', (d: any) => {
                    const o = {x: source.x, y: source.y};
                    return d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x)({source: o, target: o})
                });
            
            root.eachBefore((d: any) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        
        let left = root;
        let right = root;
        update(root);
    }, [dimensions, data]);

    useEffect(() => {
        draw();
    }, [draw]);

  return (
    <div ref={wrapperRef} className="w-full h-full cursor-pointer">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CollapsibleTree;
