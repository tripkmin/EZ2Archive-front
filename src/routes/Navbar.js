/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchModalOpen, setModalStep, setUserName } from "../store"

function Navbar(){

  const navigate = useNavigate()
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const [user, setUser] = useState("")
  const AT = localStorage.getItem("accessToken");
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(()=>{
    if (AT) {
      axios
        .get('https://api.ez2archive.kr/members/myInfo' , {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        })
        .then((res) => {
          setUser(res.data.data.name);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem("accessToken");
            setUser("");
            window.location.reload();
          } else {
            console.error(error);
          }
        });
    }
  }, [])

  const logout = () => {
    axios
      .post('https://api.ez2archive.kr/logout', 
      // {
      //   headers: {
          // Authorization: `Bearer ${AT}`
      //   }
      // }
      )
      .then((res) => {
        localStorage.removeItem("accessToken");
        setUser("");
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 402 || error.response.status === 403) {
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
                user !== ""
                ? <span className="category-link">{user}님</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span>
              }
              {/* <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(0)) }}>로그인</span> */}
              {
                user !== ""
                ? <span className="category-link" onClick={logout}>로그아웃</span>
                : <span className="category-link" onClick={()=>{ dispatch(switchModalOpen()); dispatch(setModalStep(1)) }}>회원가입</span>
              }
              {/* <span className="category-link" onClick={()=>{ navigate('/signin') }}>회원가입</span> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar