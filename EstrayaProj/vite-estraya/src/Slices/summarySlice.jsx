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
      const { skill } = action.payload;
      state.targetSkill = skill
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

export const { setCurrentUserSummary, setTargetSkill, setTargetUserSummary } = summarySlice.actions;
export default summarySlice.reducer;
