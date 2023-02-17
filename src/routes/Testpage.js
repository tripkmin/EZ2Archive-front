/*eslint-disable*/

import axios from "axios"
import { useState } from "react"

function Testpage(){

  const [blockerPassword, setBlockerPassword] = useState("")
  const blockerPWHandler = (e) => {
    setBlockerPassword(e.target.value)
  }  

  const [AT, setAT] = useState("")
  const [myName, setMyName] = useState("")
  const [myId, setMyId] = useState("")
  const [myAuth, setMyAuth] = useState("")
  const [myAddTime, setMyAddTime] = useState("")

  const getLocalAT = () => {
    if (localStorage.getItem("accessToken") !== null) {
    setAT(localStorage.getItem("accessToken"))
  }}

  const myInfo = () => {
    axios.get('https://api.ez2archive.kr/members/myInfo', {
      headers: {
        Authorization: `Bearer ${AT}`
      }
    })
    .then( (res) => {
      setMyName(res.data.data.name)
      setMyId(res.data.data.userId)
      setMyAuth(res.data.data.authority)
      setMyAddTime(res.data.data.addTime)
    })
  }

  const newAccess = () => {
    axios.post('https://api.ez2archive.kr/reIssue')
    .then(res => console.log(res))
  }

  const login = () => {
    axios.post('https://api.ez2archive.kr/login', {
      "password": "test04",
      "userId": "test04"
    })
    .then(( (res) => {
      console.log(res)
      localStorage.setItem("accessToken", res.data.data.accessToken)
      getLocalAT()
    }))
  }

  // 로그인 시 받고나서 메인페이지로 옴. 그러면 리프레시, 네비바 컴포넌트도 리프레시 되면서 갖고 있는 액세스 토큰 유무 검사
  // 로컬 스토리지에 AT 있으면 유저정보 조회 API 돌림, 없으면 그냥 기본 상태로.
  // 200이 뜨면 이제 store.js에 저장, 401이 뜨면 alert()

  return (
    <div className="testpage-wrapper">
      <div>
        <h5>현재 로컬 스토리지에 액세스 토큰 저장 유무</h5>
        <p>{AT !== "" ? "Y" : "N"}</p>
      </div>
      <div>
        <h5>회원정보</h5>
        <p>{myName}</p>
        <p>{myId}</p>
        <p>{myAuth}</p>
        <p>{myAddTime}</p>
      </div>
      <button onClick={login}>test04 계정으로 로그인</button>
      <button onClick={myInfo}>현재 가지고 있는 액세스 토큰으로 회원정보 조회</button>
      <button onClick={newAccess}>액세스 토큰 교환</button>
    </div>
  )
}

export default Testpage