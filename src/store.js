import { createSlice, configureStore } from '@reduxjs/toolkit'

let userinfo = createSlice({
  name : "userinfo",
  initialState : {username : ""},
  reducers : {
    setUserName(state, action){
      state.username = action.payload
    }
  }
})

let userLogin = createSlice({
  name : "userLogin",
  initialState : {isLoginModalOpen : false},
  reducers : {
    switchLoginModal(state){
      state.isLoginModalOpen = !state.isLoginModalOpen
    }
  }
})

let rankUserSelected = createSlice({
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

let selectIndex = createSlice({
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
    userLogin : userLogin.reducer,
    rankUserSelected : rankUserSelected.reducer,
    selectIndex : selectIndex.reducer,
   }
}) 

export let { setUserName } = userinfo.actions
export let { switchLoginModal } = userLogin.actions
export let { setTitleView, setKeyAndDifficulty, setDescending, setCleanKeyAndDifficulty } = rankUserSelected.actions
export let { setClass, cleanClass } = selectIndex.actions
