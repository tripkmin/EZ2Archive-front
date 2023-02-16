/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchModalOpen, setModalStep, setUserName } from "../store"

function Navbar(){

  let navigate = useNavigate()
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()
  const [user, setUser] = useState("")
  // const isVaildAT = () => {
  //   const AT = localStorage.getItem("AccessToken")
  //   const base64Payload = AT.split('.')[1];
  //   const payload = decodeURIComponent(window.atob(base64Payload)); 
  //   const ATParse = JSON.parse(payload) 
  //   setUser(ATParse.sub)
  // }

  // useEffect(()=>{
  //   const AT = localStorage.getItem("AccessToken")
  //   const base64Payload = AT.split('.')[1]; // .을 기준으로 나누고 거기서 2번째 요소를 고름
  //   const payload = decodeURIComponent(window.atob(base64Payload)); // JSON화 된 거라 한 번 파싱을 해줘야 함.
  //   const ATParse = JSON.parse(payload) // {"typ": "access", "sub": "frontadmin", "iss": "ez2archive-api", "jti": "7f58c08d-3152-41b8-9f10-708149d159e3", "iat": 1676369245, "exp": 1676369845}
  //   setUser(ATParse.sub)
  // }, [])

  // 개발 진행중
  // useEffect(() => {
  //   const AT = localStorage.getItem("accessToken") 
  //   if (AT !== null) {
  //     axios.get('http://api.ez2archive.kr/members/myInfo', {
  //       headers: {
  //         Authorization: `Bearer ${AT}`
  //       }
  //     })
  //     .then( (res) => {
  //       dispatch(setUserName(res.data.data.name))
  //     })
  //     .catch( console.log("토큰이 만료되었거나 요청이 잘못되었습니다.") )
  //     }
  // }, [])

  return (
    <header>
      <nav className="nav-wrapper theme-pp-shadow">
        <div className="container">
          <div className="nav">
            <img className="logo" src={process.env.PUBLIC_URL + '/navbar/ez2archive_logo.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div className="category-box">
              <span className="category-link" onClick={()=>{ alert('준비 중입니다') }}>성과표</span>
              <span className="category-link" onClick={()=>{ navigate('/rank')}}>서열표</span>
              <span className="category-link" onClick={()=>{ navigate('/tier')}}>티어표</span>
              <span className="category-link" onClick={()=>{ alert('준비 중입니다') }}>안내</span>
            </div>
            <img className="pp-navbar-pattern" src={process.env.PUBLIC_URL + '/navbar/Asset 1.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div>
              
              {/* { user !== "" && ? */}
              {/* {
                state.userinfo.userName !== "" 
                ? <span className="category-link">{state.userinfo.userName}</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span>
              } */}
              <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span>
              <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(1)) }}>회원가입</span>
              {/* <span className="category-link" onClick={()=>{ navigate('/signin') }}>회원가입</span> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar