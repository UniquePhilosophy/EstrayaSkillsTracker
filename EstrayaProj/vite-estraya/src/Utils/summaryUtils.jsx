import { useDispatch } from 'react-redux';

export const computeRecentTasks = (userTasks) => {
  const tasks = [];
  userTasks.sort((a, b) => new Date(b.task.created_date) - new Date(a.task.created_date));
  const topThreeTasks = userTasks.slice(0, 3);

  topThreeTasks.forEach((userTask) => {
    const task = userTask.task;
    tasks.push({
      id: task.id,
      name: task.name,
      description: task.description,   
      image_url: task.image_url,
      created_date: task.created_at,
    });
  });

  return tasks;
};

export const computeSkillLevels = (userTasks, tasks) => {
  const skills = [];
  Object.values(userTasks).forEach((userTask) => {
    const task = userTask.task;
    const skillsForTask = task.skill;

    // Add skills with counts to array
    skillsForTask.forEach((skill) => {
      const skillIndex = skills.findIndex((s) => s.id === skill.id);

      if (skillIndex === -1) {
        skills.push({
          id: skill.id,
          name: skill.name,
          image_url: skill.image_url,
          user_count: 1,
          total_count: 0,
          skill_level: 0,
        });
      } else {
        skills[skillIndex].user_count++;
      }
    });
  });

  // Count each skill on each task
  Object.values(tasks).forEach((task) => {
    task.skill.forEach((skill) => {
      const skillIndex = skills.findIndex((s) => s.id == skill);

      if (skillIndex !== -1) {
        skills[skillIndex].total_count++;
      }
    });
  });

  // Calculate each skill's level
  skills.forEach((skill) => {
    const userSkillLvlTemp = (skill.user_count / skill.total_count ) * 100;
    skill.skill_level = userSkillLvlTemp
  });

  skills.sort((a, b) => b.skill_level - a.skill_level);
  
  return skills;
};

export const computeTopSkills = (skillLevels) => {
  // Select the top 3 skills
  const topSkills = skillLevels.slice(0, 3);

  return topSkills;
};

export const computeOverallLevel = (userTasks, tasks) => {
  const countUserTasks = userTasks.length;
  const countTasks = tasks.length;
  const skillLevelTemp = (countUserTasks / countTasks) * 100

  return skillLevelTemp;
};
  