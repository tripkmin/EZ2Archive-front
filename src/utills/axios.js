/*eslint-disable*/

import axios from "axios"
import store from "../store";
import {
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime
} from "../store";
import {
  API_URL,
} from "../services/temp"

// const AT = localStorage.getItem("accessToken")
// 왜 AT는 작동하지 않고 localStorage.getItem("accessToken")는 작동하는거지?

// Login 관련
export const login = async (id, password) => {
  try {
    const loginResponse = await axios.post(`${API_URL}/login`, {
      "userId": id,
      "password": password,
    }, {
      withCredentials: true
    });
    localStorage.setItem("accessToken", loginResponse.data.data.accessToken);
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true
    })
  } catch (error) {
    throw error
  }
}


export const getMyInfo = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/members/myInfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
    store.dispatch(setUserName(response.data.data.name))
    store.dispatch(setUserId(response.data.data.userId))
    store.dispatch(setUserAuth(response.data.data.authority))
    store.dispatch(setUserAddTime(response.data.data.addTime))
    return response.data.data
  } catch (error) {
    throw error
  }
}

export const reIssue = async () => {
  try {
    // 액세스 토큰이 만료되었을 경우 갖고있는 리프레시 토큰을 통해 액세스 토큰 재발급 요청
    const newAccessToken = await axios.post(`${API_URL}/reIssue`, {}, {
      withCredentials: true
    })
    localStorage.setItem("accessToken", newAccessToken.data.data.accessToken)
  } catch (error) {
    throw error
  }
}

// 회원가입 관련 요청들
export const idCheck = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/idCheck?userId=${id}`)
    return response.data.data
  } catch (error) {
    throw error
  }
}

export const emailCheck = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/emailCheck?email=${email}`)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// RankOrderList 컴포넌트에서 사용하는 함수들

export const getRankList = async (selectedKeyCaps, selectedLevel) => {
  try {
    let songList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
    songList = songList.data.data;
    return songList
  } catch (error) {
    throw error
  }
}

// Achievement Detail 컴포넌트에서 사용하는 axios 함수들

export const getHistory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/musicInfo/${id}/history`, {
      headers: {
        // Authorization: `Bearer ${AT}`
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    return response.data.data
  } catch (error) {
    throw error
  }
}

export const deleteHistory = async (recordHistoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/record/${recordHistoryId}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getMemo = async (id) => {
  try {
    const memo = await axios.get(`${API_URL}/musicInfo/${id}/memo`, {
      headers: {
        // Authorization: `Bearer ${AT}`
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    return memo.data.data.content
  } catch (error) {
    throw error
  }
}

export const postMemo = async (id, tempMemo) => {
  try {
    const response = await axios.post(`${API_URL}/musicInfo/${id}/memo/save`, {
      content: tempMemo
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
    });
    return response.data;
  } catch (error) {
    throw error
  }
}

export const deleteMemo = async (id) => {
  try {
    const deleteMemoRequest = async () => {
      const response = await axios.delete(`${API_URL}/musicInfo/${id}/memo/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      });
      return response;
    };
    await deleteMemoRequest();
  } catch (error) {
    throw error;
  }
};

export const postScore = async (id, isWriteAllCool, isWriteAllCombo, scoreInputValue) => {
  try {
    await axios.post(
      `${API_URL}/record/save`, {
        "allCool": isWriteAllCool,
        "musicInfoId": id,
        "noMiss": isWriteAllCombo,
        "score": scoreInputValue
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
  } catch (error) {
    throw error
  }
}

export const getUserAchievementData = async (selectedKeyCaps, selectedLevel) => {
  try {
    let recordList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/record`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    let songList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
    let songWithRecordData = []

    recordList = recordList.data.data
    songList = songList.data.data;

    // 유저가 플레이한 곡의 정보와 단순 곡 정보를 합치고, 
    // 유저가 플레이하지 않은 곡은 단순 곡 정보만 갖고 userAchievementData에 넣음
    songList.forEach((singleSong) => {
      let userRecordData = recordList.find(singleRecord => singleRecord.musicInfoId === singleSong.id)
      if (userRecordData) {
        let combinedData = {
          ...singleSong,
          userRecordData
        }
        songWithRecordData.push(combinedData)
      } else {
        let combinedData = {
          ...singleSong,
          userRecordData: {}
        }
        songWithRecordData.push(combinedData)
      }
    })

    return songWithRecordData
  } catch (error) {
    throw error
  }
}

export const refreshTokenExpired = () => {
  alert('로그인이 만료되어 로그아웃 됩니다.')
  localStorage.removeItem('accessToken')
}