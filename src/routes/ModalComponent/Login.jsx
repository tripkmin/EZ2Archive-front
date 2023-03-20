/*eslint-disable*/

import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/temp";
import { setModalStep, setUserName, setUserId, setUserAuth, setUserAddTime } from "../../store";

const Login = () => {
  const dispatch = useDispatch()

  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/login`, {
      "password": password,
      "userId": id
    }, {
      withCredentials: true
    })
    .then((res) => {
      const AT = localStorage.getItem("accessToken")
      localStorage.setItem("accessToken", res.data.data.accessToken);
      axios
        .get(`${API_URL}/login`, {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        }) 
        .then((res) => {
          const { name, userId, authority, addTime } = res.data.data
          dispatch(setUserName(name))
          dispatch(setUserId(userId))
          dispatch(setUserAuth(authority))
          dispatch(setUserAddTime(addTime))
        })
      window.location.reload();
    })
    .catch((error) => {
      if (error.response.status >= 400 && error.response.status < 500) {
        setErrorMsg(error.response.data.message)
        console.log(errorMsg)
      } else if (error.response.status === 500){
        setErrorMsg("서버 오류입니다. 관리자에게 문의하십시오.")
        console.log(errorMsg)
      }
    });
  };

  return (
    <div className="login-body">
      <div className="login-body-header">
        <h3 className="theme-pp">로그인</h3>
        {
          <small className="login-error">{errorMsg}</small>
        }
      </div>
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="login-input-warning">
          </div>
          <div className="login-input-wrapper">
            <input id="id" type="text" name="user_id" required placeholder="아이디" onChange={(e)=>{
              setId(e.target.value)
              }}></input>
          </div>
          <div className="login-input-wrapper">
            <input id="password" type="password" name="user_password" required placeholder="비밀번호" onChange={(e)=>{
              setPassword(e.target.value)
              }}></input>
          </div>
          <button type="submit" className="theme-pp-button">로그인</button>
        </fieldset>
      </form>
      <div className="login-body-sub">
        <p onClick={()=>{dispatch(setModalStep(2))}}>회원가입</p>
        <p>ID/PW 찾기</p>
      </div>
    </div>
  )
}

export default Login