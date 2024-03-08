import { createSlice } from '@reduxjs/toolkit';
import { computeSkillLevels, computeTopSkills, computeRecentTasks, computeOverallLevel } from '../Utils/summaryUtils';

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    currentUserSummary: {
      topSkills: [],
      skillLevels: [],
      recentTasks: [],
      overallLevel: 0
    },
    targetSkill: {
      userTasks: [],
      allTasks: []
    },
    targetUserSummary: {
      topSkills: [],
      skillLevels: [],
      recentTasks: [],
      overallLevel: 0
    },
  },
  reducers: {
    setCurrentUserSummary: (state, action) => {
      const { userTasks, tasks } = action.payload;
      state.currentUserSummary.skillLevels = computeSkillLevels(userTasks, tasks);
      state.currentUserSummary.topSkills = computeTopSkills(state.currentUserSummary.skillLevels);
      state.currentUserSummary.recentTasks = computeRecentTasks(userTasks);
      state.currentUserSummary.overallLevel = computeOverallLevel(userTasks, tasks);
    },
    setTargetSkill: (state, action) => {
      const { userTasks, allTasks } = action.payload;
      state.targetSkill.userTasks = userTasks;
      state.targetSkill.allTasks = allTasks;
    },
    appendUserTasks: (state, action) => {
      const { userTasks } = action.payload;
      state.targetSkill.userTasks = [...state.targetSkill.userTasks, ...userTasks];
    },
    appendAllTasks: (state, action) => {
      const { allTasks } = action.payload;
      state.targetSkill.allTasks = [...state.targetSkill.allTasks, ...allTasks];
    },      
    setTargetUserSummary: (state, action) => {
      const { userTasks, tasks } = action.payload;
      state.targetUserSummary.skillLevels = computeSkillLevels(userTasks, tasks);
      state.targetUserSummary.topSkills = computeTopSkills(state.targetUserSummary.skillLevels);
      state.targetUserSummary.recentTasks = computeRecentTasks(userTasks);
      state.targetUserSummary.overallLevel = computeOverallLevel(userTasks, tasks);
    },
  },
});

export const { setCurrentUserSummary, setTargetSkill, setTargetUserSummary, appendUserTasks, appendAllTasks } = summarySlice.actions;
export default summarySlice.reducer;
