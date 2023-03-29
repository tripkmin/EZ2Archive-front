/*eslint-disable*/

import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchModalOpen, setModalStep, setUserName, setUserId, setUserAuth, setUserAddTime, setUserDefault } from "../store"
import { API_URL, AT } from "../services/temp";
import { getMyInfo, logout, reIssue } from "../utills/axios"

function Navbar(){
  const navigate = useNavigate()
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const dispatchUserData = (myInfoResponse) => {
      dispatch(setUserName(myInfoResponse.name));
      dispatch(setUserId(myInfoResponse.userId));
      dispatch(setUserAuth(myInfoResponse.authority));
      dispatch(setUserAddTime(myInfoResponse.addTime));
    }

    const myInfoProcess = async () => {
      try {
        const myInfoResponse = await getMyInfo();
        dispatchUserData(myInfoResponse)
      } catch (error) {
        try {
          await reIssue();
          const myInfoResponseAfterReIssue = await getMyInfo();
          dispatchUserData(myInfoResponseAfterReIssue)
        } catch (error) {
          // 리프레시 토큰 만료로 인한 처리
          // 로컬 스토리지도 삭제하고 쿠키도 삭제시켜야 함
        }
      }
    };
  
    if (AT) {
      myInfoProcess();
    } else {
      dispatch(setUserDefault());
    }
  }, [AT]);
  

  const logoutProcess = async () => {
    try {
      logout()
      localStorage.removeItem("accessToken");
      dispatch(setUserDefault());
      window.location.href = '/';
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        console.log(error.response.data.message)
      } else if (error.response.status === 500){
        console.log("서버 오류입니다. 관리자에게 문의하십시오.")
      }
      console.log(error)
    }
  };


  return (
    <header>
      <nav className="nav-wrapper theme-pp-shadow">
        <div className="container">
          <div className="nav">
            <img className="logo" src={process.env.PUBLIC_URL + '/navbar/ez2archive_logo.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div className="category-box">
              <span className="category-link" onClick={()=>{ navigate('/achievement') }}>성과표</span>
              <span className="category-link" onClick={()=>{ navigate('/rank') }}>서열표</span>
              <span className="category-link" onClick={()=>{ navigate('/tier') }}>티어표</span>
              <span className="category-link" onClick={()=>{ alert('현재 구현중입니다.')}}>NEW 서열표</span>
              <span className="category-link" onClick={()=>{ alert('현재 김현중입니다.') }}>안내</span>
            </div>
            <img className="pp-navbar-pattern" src={process.env.PUBLIC_URL + '/navbar/Asset 1.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div>
              {
                state.userinfo.userName !== ""
                ? <span className="category-link">{state.userinfo.userName}님</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(1)) }}>로그인</span>
              }
              {
                state.userinfo.userName !== ""
                ? <span className="category-link" onClick={logoutProcess}>로그아웃</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(2)) }}>회원가입</span>
              }
              {
                state.userinfo.userAuth == "ADMIN"
                ? <span className="category-link" onClick={()=>{ navigate('/manage')}}>관리</span>
                : null
              }
            </div>
          </div>
        </div>
      </nav>
      <div className="nav-blocker"></div>
    </header>
  )
}

export default Navbar