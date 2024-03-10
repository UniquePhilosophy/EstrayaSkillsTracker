import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { deleteUserTask } from './actions';

const Lightbox = ({ userTaskId, taskId, taskDescription, onClose }) => {
  const userTasks = useSelector(state => state.userTasks);
  const dispatch = useDispatch();

  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  useEffect(() => {
    setIsTaskCompleted(userTasks.some(task => task.id === taskId));
  }, [userTasks, taskId]);

  const handleDelete = () => {
    fetch(`https://localhost:8000/usertask/${userTaskId}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      dispatch(deleteUserTask(userTaskId));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
      }}>
        <p>{taskDescription}</p>
        {isTaskCompleted && <button onClick={handleDelete}>Delete Task</button>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );  
}

export default Lightbox;