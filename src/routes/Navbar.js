/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchModalOpen, setModalStep, setUserName, setUserId, setUserAuth, setUserAddTime, setDefault } from "./../store"

function Navbar(){

  const navigate = useNavigate()
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const [user, setUser] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  // const AT = localStorage.getItem("accessToken");

  useEffect(()=>{
    const AT = localStorage.getItem("accessToken");
    // 컴포넌트별 공통 적용을 위해 hooks으로 빼줘야 함.
    if (AT) {
      axios
        .get('https://api.ez2archive.kr/members/myInfo' , {
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
        // 향후 구현할 것
          // 리프레시 토큰으로 액세스 토큰 재발급 후 다시 시행
          // 만약 리프레시 토큰이 만료되었다면 다시 로그인해달라는 알림과 함께 로그아웃
        .catch((error) => {
          if (error.response.status >= 400 && error.repsonse.status < 500) {
            localStorage.removeItem("accessToken");
            setUser("");
            dispatch(setDefault())
            window.location.reload();
          } else {
            console.error(error);
          }
        });
    }
  }, [])

  const logout = () => {
    // localStorage.removeItem("accessToken");
    // window.location.reload();
    // 리프레시 토큰 문제 해결 전까지는 일단 위 방식으로 진행하는 것으로.
    axios
      .post('https://api.ez2archive.kr/logout', {}, {
        withCredentials: true
        /* 현재 CORS 에러 이슈로 잠시 막아둠
        Default값으로 withCredentials : true를 줘야 할수도 있음. */
      })
      .then((res) => {
        localStorage.removeItem("accessToken");
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status >= 400 && error.response.status < 500) {
          setErrorMsg(error.response.data.message)
        } else if (error.response.status === 500){
          setErrorMsg("서버 오류입니다. 관리자에게 문의하십시오.")
        }
        console.log(error)
      });
  };

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
              {
                state.userinfo.userName !== ""
                ? <span className="category-link">{state.userinfo.userName}님</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span>
              }
              {/* <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span> */}
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