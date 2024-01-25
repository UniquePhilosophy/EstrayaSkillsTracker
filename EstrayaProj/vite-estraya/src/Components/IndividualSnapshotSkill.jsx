const IndividualSnapshotSkill = ({ skill }) => {
  const placeholderImageUrl = 'https://picsum.photos/200';

  return (
    <div className="skill">
      <div className="skill-icon-container">
        {skill.image_url ? (
          <img
            className="skill-img"
            src={skill.image_url}
            alt={`Skill icon for ${skill.name}`}
          />
        ) : (
          <img
            className="skill-img"
            src={placeholderImageUrl}
            alt="Placeholder Skill Icon"
          />
        )}
      </div>
      <div className="skill-details">
        <div className="skill-name">
          <h3>{skill.name}</h3>
        </div>
        <div className="skill-level">Level {skill.skill_level}</div>
      </div>
    </div>
  );
};

export default IndividualSnapshotSkill;