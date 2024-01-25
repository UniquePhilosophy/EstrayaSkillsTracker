const IndividualSnapshotTask = ({ task }) => {
  const placeholderImageUrl = 'https://picsum.photos/200';

  return (
    <div className="task">
      <div className="task-icon-container">
        {task.image_url ? (
          <img
            className="task-img"
            src={task.image_url}
            alt={`Task icon for ${task.name}`}
          />
        ) : (
          <img
            className="task-img"
            src={placeholderImageUrl}
            alt="Placeholder Task Icon"
          />
        )}
      </div>
      <div className="task-details">
        <div className="task-name">
          <h3>{task.name}</h3>
        </div>
        <div className="task-description">{task.description}</div>
      </div>
    </div>
  );
};

export default IndividualSnapshotTask;
