import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { graphlib, dagre } from 'dagre-d3';

const SkillTree = () => {
  const svgRef = useRef();
  const skill = useSelector(state => state.summary.targetSkill);

  useEffect(() => {
    if (!skill || Object.keys(skill).length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Create nodes and links from "allTasks"
    const nodes = skill.allTasks.map(task => ({
      id: task.name,
      label: task.name, // Define label for node
    }));
    const links = skill.allTasks.reduce((acc, task) => {
      task.prerequisite.forEach(p => acc.push({ source: task.name, target: p }));
      return acc;
    }, []);

    // Create a DAG using dagre layout
    const g = new graphlib.Graph();
    nodes.forEach(n => g.addNode(n.id, n));
    links.forEach(l => g.addEdge(l.source, l.target));

    // Perform dagre layout
    dagre.layout(g);

    // Create scales for positioning
    const x = d3.scaleLinear().domain(d3.extent(g.nodes(), d => d.x)).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(g.nodes(), d => d.y)).range([0, height]);

    // Render nodes as circles
    svg.append('g')
      .selectAll('circle')
      .data(g.nodes())
      .join('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 10)
      .attr('fill', '#000');

    // Render links as paths
    svg.append('g')
      .selectAll('path')
      .data(g.edges())
      .join('path')
      .attr('d', d => `
        M${x(g.node(d.source).x)},${y(g.node(d.source).y)}
        L${x(g.node(d.target).x)},${y(g.node(d.target).y)}
      `)
      .attr('stroke', '#ccc')
      .attr('fill', 'none');

  }, [skill]);

  if (!skill || Object.keys(skill).length === 0) {
    return <div>Waiting for skills...</div>;
  }

  return <svg ref={svgRef} width="960" height="600" />;
};

export default SkillTree;
