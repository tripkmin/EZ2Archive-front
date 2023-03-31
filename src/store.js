import {
  createSlice,
  configureStore
} from '@reduxjs/toolkit'

const userinfo = createSlice({
  name: "userinfo",
  initialState: {
    isLoginTried: false,
    userName: "",
    userId: "",
    userAuth: "",
    userAddTime: "",
    manageMode: false
  },
  reducers: {
    setIsLoginTried(state, action) {
      state.isLoginTried = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setUserAuth(state, action) {
      state.userAuth = action.payload;
    },
    setUserAddTime(state, action) {
      state.userAddTime = action.payload;
    },
    setManageMode(state, action) {
      state.manageMode = action.payload;
    },
    setUserDefault(state) {
      state.userName = "";
      state.userId = "";
      state.userAuth = "";
      state.userAddTime = "";
      state.manageMode = false;
    }
  }
})

const modal = createSlice({
  name: "memberModal",
  initialState: {
    isModalOpen: false,
    modalStep: 0
  },
  reducers: {
    switchModalOpen(state) {
      state.isModalOpen = !state.isModalOpen;
    },
    setModalStep(state, action) {
      state.modalStep = action.payload;
    },
    setModalDefault(state) {
      state.isModalOpen = false;
      state.modalStep = 0;
    }
  }
})

// filterSelected같은 걸로 나중에 바꾸기
const achievementUserSelected = createSlice({
  name: "achievementUserSelected",
  // selectedKey는 4k, selectedKeyCaps는 FOUR와 같이 저장됨.
  initialState: {
    selectedKey: "",
    selectedKeyCaps: "",
    selectedLevel: 0,
    selectedRank: [],
    selectedRankView: "",
    songTitleView: true,
    isDescending: true,
  },
  reducers: {
    setTitleView(state, action) {
      state.songTitleView = action.payload
    },
    setDescending(state, action) {
      state.isDescending = action.payload
    },
    setAchievementKey(state, action) {
      state.selectedKey = action.payload;
      switch (action.payload) {
        case '4k':
          state.selectedKeyCaps = "FOUR";
          break;
        case '5k':
          state.selectedKeyCaps = "FIVE";
          break;
        case '6k':
          state.selectedKeyCaps = "SIX";
          break;
        case '8k':
          state.selectedKeyCaps = "EIGHT";
          break;
        default: // nothing
      }
    },
    setAchievementLevel(state, action) {
      state.selectedLevel = action.payload;
    },
    setAchievementRank(state, action) {
      const index = state.selectedRank.indexOf(action.payload)
      if (index !== -1) {
        state.selectedRank.splice(index, 1)
      } else {
        state.selectedRank.push(action.payload)
      }
    },
    setAchievementRankDefault(state) {
      state.selectedRank = [];
    },
    setAchievementClean(state) {
      state.selectedKey = "";
      state.selectedKeyCaps = "";
      state.selectedLevel = 0;
      state.selectedRank = [];
    }
  }
})

const achievementSongInfo = createSlice({
  name: "achievementSongInfo",
  initialState: {
    songList: [],
    songInfo: {},
    filteredElementIdx: -1
  },
  reducers: {
    setSongList(state, action) {
      state.songList = action.payload
    },
    setSongInfo(state, action) {
      state.songInfo = action.payload
    },
    setFilteredElementIdx(state, action) {
      state.filteredElementIdx = action.payload
    },
    cleanSongList(state) {
      state.songList = []
    }
  }
})

const rankUserSelected = createSlice({
  name: "rankUserSelected",
  initialState: {
    selectedKey: "",
    selectedLevel: 0,
    songTitleView: true,
    isDescending: true
  },
  reducers: {
    setRankTitleView(state, action) {
      state.songTitleView = action.payload
    },
    setRankDescending(state, action) {
      state.isDescending = action.payload
    },
    setRankKeyAndLevel(state, action) {
      state.selectedKey = action.payload.key;
      state.selectedLevel = action.payload.level;
      // RankOrderSelector에서 특정 키, 난이도 선택했을 때 실행 되도록 함.
    },
    setRankCleanKeyAndLevel(state) {
      state.selectedKey = "";
      state.selectedLevel = 0;
    }
  }
})

const selectIndex = createSlice({
  name: "selectIndex",
  initialState: [{
      key: '4k',
      level: [20, 19, 18, 17, 16],
      class: ["", "", "", "", ""]
    },
    {
      key: '5k',
      level: [20, 19, 18, 17, 16],
      class: ["", "", "", "", ""]
    },
    {
      key: '6k',
      level: [20, 19, 18, 17, 16],
      class: ["", "", "", "", ""]
    },
    {
      key: '8k',
      level: [20, 19, 18, 17, 16],
      class: ["", "", "", "", ""]
    }
  ],
  reducers: {
    setClass(state, action) {
      state[action.payload.step1].class[action.payload.step2] = "bold"
    },
    cleanClass(state) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
          state[i].class[j] = ""
        }
      }
    }
  }
})

export default configureStore({
  reducer: {
    userinfo: userinfo.reducer,
    modal: modal.reducer,
    achievementUserSelected: achievementUserSelected.reducer,
    achievementSongInfo: achievementSongInfo.reducer,
    rankUserSelected: rankUserSelected.reducer,
    selectIndex: selectIndex.reducer,
  }
})

export const {
  setIsLoginTried,
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime,
  setManageMode,
  setUserDefault
} = userinfo.actions
export const {
  switchModalOpen,
  setModalStep,
  setModalDefault
} = modal.actions
// export const { switchLoginModal } = userLogin.actions
export const {
  setTitleView,
  setDescending,
  setAchievementKey,
  setAchievementLevel,
  setAchievementRank,
  setAchievementRankDefault,
  setAchievementClean
} = achievementUserSelected.actions
export const {
  setSongList,
  cleanSongList,
  setFilteredElementIdx,
  setSongInfo
} = achievementSongInfo.actions
// export const {  } = achievementSelectIndex.actions
export const {
  setRankTitleView,
  setRankKeyAndLevel,
  setRankDescending,
  setRankCleanKeyAndLevel
} = rankUserSelected.actions
export const {
  setClass,
  cleanClass
} = selectIndex.actions