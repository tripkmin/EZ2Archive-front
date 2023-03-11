import { createSlice, configureStore } from '@reduxjs/toolkit'

const userinfo = createSlice({
  name : "userinfo",
  initialState : {userName : "", userId : "", userAuth: "", userAddTime: "", manageMode: false},
  reducers : {
    setUserName(state, action){
      state.userName = action.payload;
    },
    setUserId(state, action){
      state.userId = action.payload;
    },
    setUserAuth(state, action){
      state.userAuth = action.payload;
    },
    setUserAddTime(state, action){
      state.userAddTime = action.payload;
    },
    setManageMode(state, action){
      state.manageMode = action.payload;
    },
    setDefault(state, action){
      state.userName = "";
      state.userId = "";
      state.userAuth = "";
      state.userAddTime = "";
      state.manageMode = false;
    }
  }
})

const memberModal = createSlice({
  name : "memberModal",
  initialState : {isModalOpen : false, modalStep : 0 },
  reducers : {
    switchModalOpen(state){
      state.isModalOpen = !state.isModalOpen
    },
    setModalStep(state, action){
      state.modalStep = action.payload
    }
  }
})

const achievementUserSelected = createSlice({
  name : "achievementUserSelected",
  // selectedKey는 4k, selectedKeyCaps는 FOUR와 같이 저장됨.
  initialState : {selectedKey : "", selectedKeyCaps: "", selectedDifficulty : 0, selectedRank : "", selectedRankView : "", songTitleView : true, isDescending : true, },
  reducers : {
    setTitleView(state, action){
      state.songTitleView = action.payload
    },
    setDescending(state, action){
      state.isDescending = action.payload
    },
    setAchievementKey(state, action){
      state.selectedKey = action.payload;
      switch(action.payload) {
        case '4k' : state.selectedKeyCaps = "FOUR"; break;
        case '5k' : state.selectedKeyCaps = "FIVE"; break;
        case '6k' : state.selectedKeyCaps = "SIX"; break;
        case '8k' : state.selectedKeyCaps = "EIGHT"; break;
        default: // nothing
      }
    },
    setAchievementDifficulty(state, action){
      state.selectedDifficulty = action.payload;
    },
    setAchievementRank(state, action){
      state.selectedRank = action.payload;
    },
    setSelectedRankView(state, action){
      state.selectedRankView = action.payload;
    }
    ,
    setAchievementClean(state){
      state.selectedKey = "";
      state.selectedKeyCaps = "";
      state.selectedDifficulty = 0;
      state.selectedRank = "";
    }
  }
})

const achievementSelectIndex = createSlice({
  name : "achievementSelectIndex",
  initialState : [
    {
      key: '4k', 
      difficulty : Array.from({length: 20}, (_, i) => i + 1), 
      dbRank : ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F",],
      convertName : ["S⁺⁺⁺","S⁺⁺","S⁺","S","A⁺","A","B","C","D","E","F",],
      class: ["", "", "", "", ""]}, 
    {
      key: '5k', 
      difficulty : Array.from({length: 20}, (_, i) => i + 1), 
      dbRank : ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F",],
      convertName : ["S⁺⁺⁺","S⁺⁺","S⁺","S","A⁺","A","B","C","D","E","F",],
      class: ["", "", "", "", ""]}, 
    {
      key: '6k', 
      difficulty : Array.from({length: 20}, (_, i) => i + 1), 
      dbRank : ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F",],
      convertName : ["S⁺⁺⁺","S⁺⁺","S⁺","S","A⁺","A","B","C","D","E","F",],
      class: ["", "", "", "", ""]}, 
    {
      key: '8k', 
      difficulty : Array.from({length: 20}, (_, i) => i + 1), 
      dbRank : ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F",],
      convertName : ["S⁺⁺⁺","S⁺⁺","S⁺","S","A⁺","A","B","C","D","E","F",],
      class: ["", "", "", "", ""]}],
})

const rankUserSelected = createSlice({
  name : "rankUserSelected",
  initialState : {selectedKey : "", selectedDifficulty : 0, songTitleView : true, isDescending : true},
  reducers : {
    setRankTitleView(state, action){
      state.songTitleView = action.payload
    },
    setRankDescending(state, action){
      state.isDescending = action.payload
    },
    setRankKeyAndDifficulty(state, action){
      state.selectedKey = action.payload.key;
      state.selectedDifficulty = action.payload.difficulty;
      // RankOrderSelector에서 특정 키, 난이도 선택했을 때 실행 되도록 함.
    },
    setRankCleanKeyAndDifficulty(state){
      state.selectedKey = "";
      state.selectedDifficulty = 0;
    }
  }
})

const selectIndex = createSlice({
  name : "selectIndex",
  initialState : [
    {key: '4k', difficulty : [20, 19, 18, 17, 16], class: ["", "", "", "", ""]}, 
    {key: '5k', difficulty : [20, 19, 18, 17, 16], class: ["", "", "", "", ""]}, 
    {key: '6k', difficulty : [20, 19, 18, 17, 16], class: ["", "", "", "", ""]}, 
    {key: '8k', difficulty : [20, 19, 18, 17, 16], class: ["", "", "", "", ""]}],
  reducers : {
    setClass(state, action){
      state[action.payload.step1].class[action.payload.step2] = "bold"
    },
    cleanClass(state){
      for (let i = 0; i < 4; i++){
        for (let j = 0; j < 5; j++){
          state[i].class[j] = ""
        }
      }
    }
  }
})

export default configureStore({
  reducer: { 
    userinfo : userinfo.reducer,
    memberModal : memberModal.reducer,
    achievementUserSelected : achievementUserSelected.reducer,
    achievementSelectIndex : achievementSelectIndex.reducer,
    rankUserSelected : rankUserSelected.reducer,
    selectIndex : selectIndex.reducer,
   }
}) 

export const { setUserName, setUserId, setUserAuth, setUserAddTime, setManageMode, setDefault } = userinfo.actions
export const { switchModalOpen, setModalStep } = memberModal.actions
// export const { switchLoginModal } = userLogin.actions
export const { setTitleView, setDescending, setAchievementKey, setAchievementDifficulty, setAchievementRank, setAchievementClean, setSelectedRankView } = achievementUserSelected.actions
// export const {  } = achievementSelectIndex.actions
export const { setRankTitleView, setRankKeyAndDifficulty, setRankDescending, setRankCleanKeyAndDifficulty } = rankUserSelected.actions
export const { setClass, cleanClass } = selectIndex.actions

