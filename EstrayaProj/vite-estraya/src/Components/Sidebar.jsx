import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toggleSidebar } from '../Slices/sidebarSlice';
import { setTargetSkill } from '../Slices/summarySlice';

function Sidebar() {
  const dispatch = useDispatch();
  const sidebarState = useSelector((state) => state.sidebar);
  const skillsState = useSelector((state) => state.summary.currentUserSummary.skillLevels)

  const fetchTargetSkill = async (skill) => {
    const userTasksResponse = await fetch(`https://localhost:8000/usertask-byskill/${skill.id}/`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!userTasksResponse.ok) {
      throw new Error(`HTTP error! status: ${userTasksResponse.status}`);
    }

    const userTasksData = await userTasksResponse.json();

    const allTasksResponse = await fetch(`https://localhost:8000/task/${skill.id}/`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!allTasksResponse.ok) {
      throw new Error(`HTTP error! status: ${allTasksResponse.status}`);
    }

    const allTasksData = await allTasksResponse.json();

    console.log("(Sidebar) Target Skill userTasks: ", userTasksData)
    console.log("(Sidebar) Target Skill allTasks: ", allTasksData)

    dispatch(setTargetSkill({ userTasks: userTasksData, allTasks: allTasksData }));
  }

  return (
    <div>
      <div className={`left-column ${sidebarState.isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <h2>Skills</h2>
        </div>
        <div className="skill-list">
          {Object.values(skillsState).map((skill) => (
            <NavLink to={`/skill/${skill.id}`} key={skill.name} onClick={() => fetchTargetSkill(skill)}>
              <div className="skill-item">
                <h3>{skill.name}</h3>
                <h3>{skill.skill_level}</h3>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <div>
        <button id="toggleButton" onClick={() => dispatch(toggleSidebar())}>
          {sidebarState.isOpen ? '<' : '>'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
