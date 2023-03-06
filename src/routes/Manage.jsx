/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserName, setUserId, setUserAuth, setUserAddTime, setDefault, setManageMode } from "../store"
import { API_URL } from "../services/temp";

// state에 따라 nav, footer 드러나는 페이지도 단계에 맞게 수정해놓을 것.
// Manage 컴포넌트에 들어오자마자 무조건 신원확인 요청
// 실패시 바로 홈 화면으로 리다이렉트 요청할 것. 
// Admin이 아닐 시에도 똑같이 홈 화면 리다이렉트
// 성공하고 Admin일 경우 관리자 페이지로 전환
// 관리자 페이지로 전환 된 뒤에는 푸터 (+@네비바)가 사라지기.

const Manage = () => {
  // const API_URL = "https://api.ez2archive.kr"
  const state = useSelector( (state)=> state )
  const dispatch = useDispatch()
  const [pageBlock, setPageBlock] = useState(false)
  const [pageBlockClass, setPageBlockClass] = useState("")

  useEffect(()=>{
    const AT = localStorage.getItem("accessToken");
    // 컴포넌트별 공통 적용을 위해 hooks으로 빼줘야 함.
    if (AT) {
      axios
        .get(`${API_URL}/members/myInfo` , {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        })
        .then((res) => {
          dispatch(setUserName(res.data.data.name))
          dispatch(setUserId(res.data.data.userId))
          dispatch(setUserAuth(res.data.data.authority))
          dispatch(setUserAddTime(res.data.data.addTime))
        })
        .then(()=>{
          if( state.userinfo.userAuth === "ADMIN"){ 
            dispatch(setManageMode(true))
          } 
          else { window.location.href = '/' }
        })
        .catch((error) => { console.log(error) });
    } else { window.location.href = '/' }
  }, [])
  return (
    <div>
      <div className={`page-block ${pageBlockClass}`}>Page Blocker</div>
      <div>Manage Page</div>
    </div>
  )
}

export default Manage