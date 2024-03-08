import React, { useRef, useEffect } from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@7.8.4";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { useSelector, useDispatch } from 'react-redux';
import { appendUserTasks } from '../Slices/summarySlice';

const SkillTree = () => {
  const targetSkill = useSelector(state => state.summary.targetSkill);
  const allTasks = targetSkill.allTasks;
  const userTasks = targetSkill.userTasks;

  const currentUser = useSelector(state => state.user.currentUser);
  console.log("[SkillTree] currentUser = ", currentUser, "of type ", typeof currentUser)

  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // Cleanup function to remove existing SVG content
    const cleanup = () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  
    if (allTasks && allTasks.length > 0) {
      cleanup();
      console.log("[SkillTree] allTasks", allTasks)
      console.log("[SkillTree] userTasks", userTasks)

      // create our builder and turn the raw data into a graph
      const builder = d3dag.graphStratify();
      const graph = builder(allTasks);
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

      // Define the filter
      const defs = svg.append("defs");

      const pattern = defs.selectAll('pattern')
        .data(allTasks)
        .enter()
        .append('pattern')
        .attr('id', d => `img-${d.id}`)
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', 1)
        .attr('width', 1)
        .attr('preserveAspectRatio', 'none')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('xlink:href', d => d.img_url);

      const radialGradient = defs.append("radialGradient")
        .attr("id", "radial-gradient");

      radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "gold");

      radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "gold")
        .attr("stop-opacity", "0.5");

      const hoverGradient = defs.append("radialGradient")
        .attr("id", "hover-gradient");
      
      hoverGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "orange");
      
      hoverGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "orange")
        .attr("stop-opacity", "0.5");      

      node.append("circle")
        .attr("fill", d => `url(#img-${d.data.id})`)
        .attr("r", nodeRadius)
        .style("stroke", d => userTasks.some(task => task.id === d.data.id) ? "url(#radial-gradient)" : "none")
        .style("stroke-width", "15px")
        .on("mouseover", function() {
          d3.select(this).style("stroke", "url(#hover-gradient)");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("stroke", d => userTasks.some(task => task.id === d.data.id) ? "url(#radial-gradient)" : "none");
        })
        .on("click", function(d) {
          let data = d3.select(this).data()[0];
          let nodeId = data.data.id;
          console.log("[Click] nodeId: ", nodeId)
          fetch('https://localhost:8000/usertask/', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: currentUser,
              task: parseInt(nodeId)
            }),
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => {
            console.error('Error:', error);
          });
          dispatch(appendUserTasks({ userTasks: [{id: nodeId}] }));
        })
        .on("contextmenu", function(d, i) {
          d3.event.preventDefault();
          // Create your overlay box here
          // You can access the description with d.data.description
        });

      node.append("text")
        .text((d) => d.data.name)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle") 
        .attr('y', -25); 
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
  }, [allTasks, userTasks]);

  return (
    <svg ref={ref} style={{ width: '100%', height: '100vh' }}></svg>
  );
}

export default SkillTree;
  