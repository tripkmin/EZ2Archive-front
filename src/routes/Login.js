import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import { useSelector, useDispatch } from "react-redux";
import { switchLoginModal } from "../store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login(props){
  // 로그인모달창트루냐 → 트루면 로그인 모달을 visibility on / opacity도 1로 하고
  let dispatch = useDispatch()
  let state = useSelector( (state) => state )
  let [isOpen, setIsOpen] = useState("")
  let navigate = useNavigate()
  let [id, setId] = useState("")
  let [password, setPassword] = useState("")
  // const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);

  useEffect(()=>{
    if(state.userLogin.isLoginModalOpen){setIsOpen("login-modal-open")} else {setIsOpen("")}
  }, [state.userLogin.isLoginModalOpen])

  const test = (event) => {
    event.preventDefault();
    axios.post('http://ez2archive.kr:54856/login', {
      "password": password,
      "userId": id
    })
    .then((res) => {
      /* 로그인이 성공했을 때 해야 하는 일.
        1. 서버에서는 성공했을 경우에 보내주는 데이터가 있음.
        그 중에서 엑세스 토큰, 리프레쉬 토큰이 또 따로 별도로 있네 보니까.
        status는 200이 뜨고, 이걸 쿠키 같은 데에다가 저장을 한다.
        2. 브라우저에 쿠키 정보가 있을 경우 계속 로그인을 유지시킨다.
        3. 만약 액세스 토큰의 유효기간이 만료되었을 경우 재발급 요청을 한다.
        4. 근데 여기서 리프레시 토큰까지 유효기간이 만료되면 로그인 하라고 창을 띄워준다.
      */

        
        // props.setCookie('accessToken', res.data.data.accessToken)
        // props.setCookie('refreshToken', res.data.data.refreshToken)
    //  setCookie('테스트', res.data.data.accessToken)
    })
    .catch(()=>{console.log('로그인 실패')})
  }

  return (
    <div className={`login-modal ${isOpen}`}>
      <div className="login-box">
        <div className="login-header">
          <FontAwesomeIcon icon={faXmark} onClick={()=>{dispatch(switchLoginModal())}} style={{'cursor':'pointer'}}></FontAwesomeIcon>
        </div>
        <div className="login-body">
          <div className="login-body-header">
            <h3>로그인</h3>
            <p>현재 테스트 중인 기능입니다.</p>
          </div>
          <form>
            <fieldset>
              <div>
                <input id="id" type="text" name="user_id" required placeholder="아이디" tabIndex="1" onChange={(e)=>{
                  setId(e.target.value)
                  }}></input>
              </div>
              <div>
                <input id="password" type="password" name="user_password" required placeholder="비밀번호" tabIndex="2" onChange={(e)=>{
                  setPassword(e.target.value)
                  }}></input>
              </div>
              <button className="theme-pp-button" onClick={(e)=>{test(e)}}>로그인</button>
            </fieldset>
          </form>
          <div className="login-body-sub">
            <p onClick={()=>{navigate('/signin'); dispatch(switchLoginModal())}}>회원가입 하기</p>
            <p>ID/PW 찾기</p>
          </div>
        </div>
      </div>
      <div className="login-bg" onClick={()=>{dispatch(switchLoginModal())}}></div>
    </div>
  )
}

export default Login