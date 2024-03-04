import React, { useRef, useEffect } from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@7.8.4";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { useSelector } from 'react-redux';

const SkillTree = () => {
  const targetSkill = useSelector(state => state.summary.targetSkill);
  const data = targetSkill.allTasks;
  const ref = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("[SkillTree] allTasks", data)

      // create our builder and turn the raw data into a graph
      const builder = d3dag.graphStratify();
      const graph = builder(data);
      // Compute Layout
    
      const nodeRadius = 20;
      const nodeSize = [nodeRadius * 2, nodeRadius * 2];
    
      const line = d3.line().curve(d3.curveMonotoneY);
    
      const layout = d3dag
        .sugiyama()
        .nodeSize(nodeSize)
        .gap([nodeRadius, nodeRadius]);

      console.log("[SkillTree] Layout: ", layout)
    
      // actually perform the layout and get the final size
      const { width, height } = layout(graph);
    
      // Rendering
    
      // colors (grayscale instead of rainbow)
      const steps = graph.nnodes() - 1;
      const grayscale = d3.scaleLinear()
        .domain([0, steps])
        .range(["black", "lightgray"]);
    
      // global
      const svg = d3
        .select(ref.current)
        // pad a little for link thickness
        .style("width", width + 4)
        .style("height", height + 4);
    
      // nodes
      svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes())
        .enter()
        .append("circle")
        .attr("fill", (d) => grayscale(d.layer))
        .attr("r", nodeRadius)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    
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
  