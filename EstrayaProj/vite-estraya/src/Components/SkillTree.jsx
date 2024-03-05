import React, { useRef, useEffect } from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@7.8.4";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { useSelector } from 'react-redux';

const SkillTree = () => {
  const targetSkill = useSelector(state => state.summary.targetSkill);
  const data = targetSkill.allTasks;
  const ref = useRef();

  useEffect(() => {
    // Cleanup function to remove existing SVG content
    const cleanup = () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  
    if (data && data.length > 0) {
      cleanup();
      console.log("[SkillTree] allTasks", data)

      // create our builder and turn the raw data into a graph
      const builder = d3dag.graphStratify();
      const graph = builder(data);
      // Compute Layout
    
      const nodeRadius = 30;
      const nodeSize = [nodeRadius * 2, nodeRadius * 2];
    
      const line = d3.line().curve(d3.curveMonotoneY);
    
      const layout = d3dag
        .sugiyama()
        .nodeSize(nodeSize)
        .gap([nodeRadius * 2.5, nodeRadius * 2.5]);
    
      // actually perform the layout and get the final size
      const { width, height } = layout(graph);
    
      // global
      const svg = d3
        .select(ref.current)
        // pad a little for link thickness
        .style("width", width + 4)
        .style("height", height + 4);
      
      // nodes
      const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes())
        .enter()
        .append("g")
        .attr('transform', d => `translate(${d.x},${d.y})`);

      node.append("circle")
          .attr("fill", "gray")
          .attr("r", nodeRadius);

      node.append("text")
          .text((d) => d.data.name)
          .attr("font-weight", "bold")
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle") 
          // Adjust y attribute for positioning above the circle
          // You may need to adjust -25 based on your specific needs
          .attr('y', -25) 
          // If you want to center align it horizontally, set x attribute to 0
          //.attr('x', 0)
          //.style('fill', 'black');

      // edges (without arrows)
      svg.append("g")
        .attr("class", "edges")
        .selectAll("path")
        .data(graph.links())
        .enter()
        .append("path")
        .attr("d", (d) => line(d.points))
        .attr("stroke", "#ccc")
        .attr("fill", "none");
    }
  }, [data]);

  return (
    <svg ref={ref} style={{ width: '100%', height: '100vh' }}></svg>
  );
}

export default SkillTree;
  