import IndividualSnapshotTask from './IndividualSnapshotTask';

function TaskSnapshot({ tasks }) {
  if (!tasks) {
    return null;
  }
  return (
    <div className="task-snapshot">
      <h2 className="snapshot-heading">Recent Tasks</h2>
      <div className="tasks-list">
        {tasks.map((task) => (
          <IndividualSnapshotTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskSnapshot;
