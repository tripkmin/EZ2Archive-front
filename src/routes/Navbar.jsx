/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchModalOpen, setModalStep, setUserName, setUserId, setUserAuth, setUserAddTime, setDefault } from "../store"
import { API_URL } from "../services/temp";

function Navbar(){
  const navigate = useNavigate()
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(()=>{
    const AT = localStorage.getItem("accessToken");
    const setUserInfo = (res) => {
      dispatch(setUserName(res.data.data.name))
      dispatch(setUserId(res.data.data.userId))
      dispatch(setUserAuth(res.data.data.authority))
      dispatch(setUserAddTime(res.data.data.addTime))
    }
    if (AT) {
        axios
          .get(`${API_URL}/members/myInfo` , {
            headers: {
              Authorization: `Bearer ${AT}`
            }
          })
        .then((res) => {
          setUserInfo(res)
          // window.location.reload();
        })
        .catch((error) => {
          if (error.response.status >= 400 && error.repsonse.status < 500) {
            axios
              .post(`${API_URL}/reIssue`, {}, {
                withCredentials: true
              })
            .then((res) => {
              setUserInfo(res)
              // window.location.reload();
            })
          } else {
            console.error(error);
          }
        });
    }
  }, [])

  const logout = () => {
    axios
      .post(`${API_URL}/logout`, {}, {
        withCredentials: true
      })
      .then((res) => {
        localStorage.removeItem("accessToken");
        window.location.reload(); 
      })
      .catch((error) => {
        if (error.response.status >= 400 && error.response.status < 500) {
          console.log(error.response.data.message)
        } else if (error.response.status === 500){
          console.log("서버 오류입니다. 관리자에게 문의하십시오.")
        }
        console.log(error)
      });
  };

  const verifyAndNavigate = (page) => {
    // if (){}
  }

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
              <span className="category-link" onClick={()=>{ alert('준비 중입니다') }}>안내</span>
            </div>
            <img className="pp-navbar-pattern" src={process.env.PUBLIC_URL + '/navbar/Asset 1.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div>
              {
                state.userinfo.userName !== ""
                ? <span className="category-link">{state.userinfo.userName}님</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span>
              }
              {
                state.userinfo.userName !== ""
                ? <span className="category-link" onClick={logout}>로그아웃</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(1)) }}>회원가입</span>
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
    </header>
  )
}

export default Navbar