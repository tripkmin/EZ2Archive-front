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

const rankUserSelected = createSlice({
  name : "rankUserSelected",
  initialState : {selectedKey : "", selectedDifficulty : 0, songTitleView : true, isDescending : true},
  reducers : {
    setTitleView(state, action){
      state.songTitleView = action.payload
    },
    setDescending(state, action){
      state.isDescending = action.payload
    },
    setKeyAndDifficulty(state, action){
      state.selectedKey = action.payload.key;
      state.selectedDifficulty = action.payload.difficulty;
      // RankOrderSelector에서 특정 키, 난이도 선택했을 때 실행 되도록 함.
    },
    setCleanKeyAndDifficulty(state){
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
    // userLogin : userLogin.reducer,
    rankUserSelected : rankUserSelected.reducer,
    selectIndex : selectIndex.reducer,
   }
}) 

export const { setUserName, setUserId, setUserAuth, setUserAddTime, setManageMode, setDefault } = userinfo.actions
export const { switchModalOpen, setModalStep } = memberModal.actions
// export const { switchLoginModal } = userLogin.actions
export const { setTitleView, setKeyAndDifficulty, setDescending, setCleanKeyAndDifficulty } = rankUserSelected.actions
export const { setClass, cleanClass } = selectIndex.actions
