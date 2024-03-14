import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setCurrentUserSummary, setTargetUserSummary } from '../Slices/summarySlice';
import { setTargetUser } from '../Slices/userSlice';
import ProfileHeader from './ProfileHeader';
import SkillSnapshot from './SkillSnapshot';
import TaskSnapshot from './TaskSnapshot';

const Dashboard = () => {
  const { user_id } = useParams();
  let userIDInt;
  if (isNaN(user_id)) {
    console.log("ERROR: user_id parameter invalid");
  } else {
    userIDInt = parseInt(user_id);
  }
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.user.currentUser);
  const targetUser = useSelector(state => state.user.targetUser);
  const currentUserSummary = useSelector(state => state.summary.currentUserSummary);
  const targetUserSummary = useSelector(state => state.summary.targetUserSummary);  
  const [userSummary, setUserSummary] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userTasksResponse;
        if (!userIDInt && !currentUser) {
          navigate('/login');
        }

        if (userIDInt) {
          if (userIDInt === parseInt(currentUser.user_id)) {
            if (currentUserSummary.topSkills.length === 0) {
              userTasksResponse = await fetch(`https://localhost:8000/usertask-skill/?user_id=${user_id}`);
              if (!userTasksResponse.ok) {
                console.log("Fetching user tasks failed.")
                throw new Error('Failed to fetch user tasks');
              }
              const userTasksData = await userTasksResponse.json();
              const tasksResponse = await fetch(`https://localhost:8000/task/`);
              if (!tasksResponse.ok) {
                console.log("Fetching tasks failed.")
                throw new Error('Failed to fetch tasks');
              }
              const tasksData = await tasksResponse.json();

              dispatch(setCurrentUserSummary({ userTasks: userTasksData, tasks: tasksData }));

              // after dispatch, useSelector will cause re-render of component, the next block 
              // of logic will then be run which sets the 'userSummary' equal to the current 
              // user's summary.

            } else if (currentUserSummary.topSkills.length !== 0) {
            setUserSummary(currentUserSummary);
            setUserData(currentUser);
            }
          }        
          else if (userIDInt !== parseInt(targetUser)) {
            userTasksResponse = await fetch(`https://localhost:8000/usertask-skill/?user_id=${user_id}`);
            if (!userTasksResponse.ok) {
              console.log("Fetch user tasks failed.")
              throw new Error('Failed to fetch user tasks');
            }
            const userTasksData = await userTasksResponse.json();
            const tasksResponse = await fetch(`https://localhost:8000/task/`);
            if (!tasksResponse.ok) {
              console.log("Fetch tasks failed.")
              throw new Error('Failed to fetch tasks');
            }
            const tasksData = await tasksResponse.json();
            console.log("User Tasks = ", userTasksData)
            console.log("Tasks = ", tasksData)

            dispatch(setTargetUser(userIDInt));
            dispatch(setTargetUserSummary({ userTasks: userTasksData, tasks: tasksData }));

            setUserSummary(targetUserSummary);
            setUserData(targetUser);
          } 
          else if (userIDInt === parseInt(targetUser)) {
            if (targetUserSummary.topSkills.length === 0) {
              userTasksResponse = await fetch(`https://localhost:8000/usertask-skill/?user_id=${user_id}`);
              if (!userTasksResponse.ok) {
                console.log("Fetching user tasks failed.")
                throw new Error('Failed to fetch user tasks');
              }
              const userTasksData = await userTasksResponse.json();
              const tasksResponse = await fetch(`https://localhost:8000/task/`);
              if (!tasksResponse.ok) {
                console.log("Fetching tasks failed.")
                throw new Error('Failed to fetch tasks');
              }
              const tasksData = await tasksResponse.json();
              dispatch(setTargetUserSummary({ userTasks: userTasksData, tasks: tasksData }));

            } else if (targetUserSummary.topSkills.length === 0) {
            setUserSummary(targetUserSummary);
            setUserData(targetUser);
            }
          }
        }
        else {
          if (currentUser) {
            if (currentUserSummary.topSkills.length === 0) {
              userTasksResponse = await fetch(`https://localhost:8000/usertask-skill/?user_id=${currentUser.user_id}`);
              if (!userTasksResponse.ok) {
                console.log("Fetching user tasks failed.")
                throw new Error('Failed to fetch user tasks');
              }
              const userTasksData = await userTasksResponse.json();
              const tasksResponse = await fetch(`https://localhost:8000/task/`);
              if (!tasksResponse.ok) {
                console.log("Fetching tasks failed.")
                throw new Error('Failed to fetch tasks');
              }
              const tasksData = await tasksResponse.json();
              dispatch(setCurrentUserSummary({ userTasks: userTasksData, tasks: tasksData }));
              
            } else if (currentUserSummary.topSkills.length === 0) {
            setUserSummary(currentUserSummary);
            setUserData(currentUser);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUserSummary, targetUserSummary]);

  return (
    <div className="right-column">
      <ProfileHeader user={userData} userLevel={userSummary.overallLevel} />
      <SkillSnapshot skills={userSummary.topSkills} />
      <TaskSnapshot tasks={userSummary.recentTasks} />
    </div>
  );
};

export default Dashboard;
