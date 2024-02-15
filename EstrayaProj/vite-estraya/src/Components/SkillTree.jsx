import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import * as d3dag from 'd3-dag';

const SkillTree = () => {
  const ref = useRef();
  const skill = useSelector(state => state.summary.targetSkill)
  console.log("Target Skill: ", skill)

  useEffect(() => {
    if (!skill || Object.keys(skill).length === 0) {
      return;
    }

    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Create nodes for each task
    const nodes = skill.allTasks.map(task => ({ id: task.name }));

    // Create links for each prerequisite
    const links = skill.allTasks.flatMap((task, i) =>
      task.prerequisite.map(prerequisite => ({ source: prerequisite.name, target: task.name }))
    );

    // Create the DAG
    const dag = d3dag.dagConnect()(links);

    // Layout the DAG
    d3dag.sugiyama()(dag);

    // Create scales for positioning
    const x = d3.scaleLinear().domain(d3.extent(dag.descendants(), d => d.x)).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(dag.descendants(), d => d.y)).range([0, height]);

    // Add lines for the links
    svg.append('g')
      .selectAll('path')
      .data(dag.links())
      .join('path')
      .attr('d', ({ data }) => `
        M${x(data.source.x)},${y(data.source.y)}
        C${x((data.source.x + data.target.x) / 2)},${y(data.source.y)}
         ${x((data.source.x + data.target.x) / 2)},${y(data.target.y)}
         ${x(data.target.x)},${y(data.target.y)}
      `)
      .attr('fill', 'none')
      .attr('stroke', '#000');

    // Add circles for the nodes
    svg.append('g')
      .selectAll('circle')
      .data(dag.descendants())
      .join('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 10)
      .attr('fill', '#000');
  }, [skill]);

  if (!skill || Object.keys(skill).length === 0) {
    return <div>Waiting for skills...</div>;
  }

  return <svg ref={ref} width="960" height="600" />;
};

export default SkillTree;
