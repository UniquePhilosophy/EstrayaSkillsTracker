import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toggleSidebar } from '../Slices/sidebarSlice';
import { setTargetSkill } from '../Slices/summarySlice';

function Sidebar() {
  const dispatch = useDispatch();
  const sidebarState = useSelector((state) => state.sidebar);
  const skillsState = useSelector((state) => state.summary.currentUserSummary.skillLevels)

  const fetchTargetSkill = async (skill) => {
    const response = await fetch(`https://localhost:8000/usertask-byskill/${skill.id}/`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("(Sidebar) Target Skill: ", data)
    dispatch(setTargetSkill({ skill: data }));
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
