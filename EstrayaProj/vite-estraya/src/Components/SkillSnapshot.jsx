import IndividualSnapshotSkill from './IndividualSnapshotSkill';

function SkillSnapshot({ skills }) {
  if (!skills) {
    return null;
  }
  return (
    <div className="skill-snapshot">
      <h2 className="snapshot-heading">Top Skills</h2>
      <div className="skills-list">
        {skills.map((skill) => (
          <IndividualSnapshotSkill key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export default SkillSnapshot;
