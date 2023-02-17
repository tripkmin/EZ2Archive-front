/*eslint-disable*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useSelector, useDispatch } from "react-redux";
import { switchModalOpen, setModalStep } from "../store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login(props){
  let dispatch = useDispatch()
  let state = useSelector( (state) => state )
  let navigate = useNavigate()
  // const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  
  // 공통 기능
  let [isOpen, setIsOpen] = useState("")
  // const [step, setStep] = useState(0)
  const [modalClass, setModalClass] = useState(0)
  // step → 0 : 로그인 창 / 1 : 회원가입 창 / 2 : 이메일 인증 창
  useEffect(()=>{
    if(state.memberModal.isModalOpen){setIsOpen("member-modal-open")} else {setIsOpen("")}
  }, [state.memberModal.isModalOpen])

  useEffect(()=>{
    switch(state.memberModal.modalStep){
      case 0: setModalClass('modal-step-0'); break
      case 1: setModalClass('modal-step-1'); break
      case 2: setModalClass('modal-step-0'); break
      default: setModalClass('modal-step-0')
    }
  }, [state.memberModal.modalStep])

  // 로그인 기능
  let [id, setId] = useState("")
  let [password, setPassword] = useState("")

  const login = (event) => {
    event.preventDefault();
    axios.post('https://api.ez2archive.kr/login', {
      "password": password,
      "userId": id
    })
    .then((res) => {
      // 엑세스 토큰은 로컬 스토리지, 리프레쉬 토큰은 http only 쿠키에 저장하기로.
      // localStorage.setItem('accessToken', res.data.data.accessToken)
      console.log(res)
      // localStorage.setItem("AccessToken", res.data.data.accessToken)
    })
    // .catch(()=>{console.log('로그인 실패')})
  }

  // console.log(localStorage.getItem("AccessToken"))
  // 회원가입 기능
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)
  const [capsLockClass, setCapsLockClass] = useState("")

  const [signId, setSignId] = useState("")
  const [signPassword, setSignPassword] = useState("")
  const [signPasswordCheck, setSignPasswordCheck] = useState("")
  const [signNickname, setSignNickname] = useState("")
  const [signEmail, setSignEmail] = useState("")

  const [idOnly, setIdOnly] = useState(false)
  const [idValid, setIdValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordSame, setPasswordSame] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  const [emailOnly, setEmailOnly] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [agree, setAgree] = useState(false)
  const [isIdChecked, setIsIdChecked] = useState(false)
  const [isEmailChecked, setIsEmailChecked] = useState(false)

  const [notAllow, setNotAllow] = useState(true)

  const idHandler = (e) => {
    setSignId(e.target.value)
    setIdOnly(true)
    setIsIdChecked(false)
  }
  const passwordHandler = (e) => {
    setSignPassword(e.target.value)
    setPasswordSame(false)
  }
  const passwordCheckHandler = (e) => {
    setSignPasswordCheck(e.target.value)
    setPasswordSame(false)
  }
  const nicknameHandler = (e) => {
    setSignNickname(e.target.value)
  }
  const emailHandler = (e) => {
    setSignEmail(e.target.value)
    setEmailOnly(true)
    setIsEmailChecked(false)
  }
  const idChecker = (e) => {
    axios.get(`https://api.ez2archive.kr/idCheck?userId=${e.target.value}`)
    .then((res) => {
      // 아이디 중복이 있으면 true로 반환됨. → idOnly는 false로.
      if (res.data.data){setIdOnly(!res.data.data)} 
      else {setIdOnly(!res.data.data); setIsIdChecked(true)}      
    })
  }
  const emailChecker = (e) => {
    axios.get(`https://api.ez2archive.kr/emailCheck?email=${e.target.value}`)
    .then((res) => {
      // 이메일 중복이 있으면 true로 반환됨. → emailOnly는 false로.
      if (res.data.data){setEmailOnly(!res.data.data)}
      else {setEmailOnly(!res.data.data); setIsEmailChecked(true)}
    })
  }
  const passwordSameChecker = () => {
    if (signPassword === signPasswordCheck) {setPasswordSame(true)}
    else { setPasswordSame(false) }
  }
  const capslockChecker = (e) => {
    if (e.getModifierState("CapsLock")){setIsCapsLockOn(true)} 
    else {setIsCapsLockOn(false)}
  }

  /** 모달창 닫으면 인풋 내용 초기화 되도록 함 */
  const closeAndInputClean = () => {
    dispatch(switchModalOpen())
    setSignId("")
    setSignPassword("")
    setSignPasswordCheck("")
    setSignNickname("")
    setSignEmail("")
    setIdOnly(false)
    setIdValid(false)
    setPasswordValid(false)
    setPasswordSame(false)
    setNicknameValid(false)
    setEmailOnly(false)
    setEmailValid(false)
    setAgree(false)
    setIsIdChecked(false)
    setIsEmailChecked(false)
    setNotAllow(true)
  }

  // 유효한 인풋 검증
  useEffect(()=>{
    const idRegex = /^[a-zA-Z0-9]*$/; 
    if (idRegex.test(signId) && signId.length > 4 && signId.length < 13) {setIdValid(true)}
    else {setIdValid(false)}
  }, [signId])

  useEffect(()=>{
    if (signPassword.length > 4 && signPassword.length < 500 ) {setPasswordValid(true)}
    else {setPasswordValid(false)}
  }, [signPassword])

  useEffect(()=>{
    const nicknameRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/; 
    if (nicknameRegex.test(signNickname) ) {setNicknameValid(true)}
    else {setNicknameValid(false)}
  }, [signNickname])

  useEffect(()=>{
    const emailRegex = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/
    if (emailRegex.test(signEmail) ) {setEmailValid(true)}
    else {setEmailValid(false)}
  }, [signEmail])

  // 버튼 비활성화 관련
  useEffect(()=>{
    if (idValid && idOnly && passwordValid && passwordSame && nicknameValid && emailValid && emailOnly && agree && signId !== "" && signEmail !== "" && isIdChecked && isEmailChecked){
      setNotAllow(false)
      return;
    } 
    setNotAllow(true)
  }, [idValid, idOnly, passwordValid, passwordSame, nicknameValid, emailValid, emailOnly, agree, signId, signEmail, isIdChecked, isEmailChecked, signPassword, signNickname])

    return (
      <div className={`member-modal ${isOpen}`}>
        <div className={`${modalClass}`}>
          <div className="member-header">
            <FontAwesomeIcon icon={faXmark} onClick={closeAndInputClean} style={{cursor:'pointer' }}></FontAwesomeIcon>
            {
              // state.memberModal.modalStep === 0 || state.memberModal.modalStep === 1
              // ? 
              // <FontAwesomeIcon icon={faArrowRight} onClick={()=>{dispatch(setModalStep(state.memberModal.modalStep + 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
              // : null
            }
            { state.memberModal.modalStep === 1
            ? <FontAwesomeIcon icon={faArrowLeft} onClick={()=>{dispatch(setModalStep(state.memberModal.modalStep - 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
            : null
            }
          </div>
          { state.memberModal.modalStep === 0 && 
            <div className="login-body">
              <div className="login-body-header">
                <h3 className="theme-pp">로그인</h3>
                <small>로그인은 구현 진행 중입니다.</small>
              </div>
              <form>
                <fieldset>
                  <div className="login-input-warning">
                    {/* { isCapsLockOn ? 
                    <small className="input-warning-badge">CapsLock ON</small>
                    : null } */}
                  </div>
                  <div className="login-input-wrapper">
                    <input id="id" type="text" name="user_id" required placeholder="아이디" tabIndex="1" onKeyDown={capslockChecker} onChange={(e)=>{
                      setId(e.target.value)
                      }}></input>
                  </div>
                  <div className="login-input-wrapper">
                    <input id="password" type="password" name="user_password" required placeholder="비밀번호" tabIndex="2" onKeyDown={capslockChecker} onChange={(e)=>{
                      setPassword(e.target.value)
                      }}></input>
                  </div>
                  <button className="theme-pp-button" 
                  onClick={(e)=>{e.preventDefault()}}
                  // onClick={(e)=>{login(e)}}
                  >로그인</button>
                </fieldset>
              </form>
              <div className="login-body-sub">
                {/* <p onClick={()=>{navigate('/signin'); dispatch(switchLoginModal())}}>회원가입 하기</p> */}
                <p onClick={()=>{dispatch(setModalStep(1))}}>회원가입</p>
                <p>ID/PW 찾기</p>
              </div>
            </div>
          }
          { state.memberModal.modalStep === 1 &&
            <div className="sign-in-wrapper">
              <div className="sign-in-header">
              <h3 className="theme-pp">회원가입</h3>
              {/* <h3 className="theme-pp">회원가입을 시작합니다</h3> */}
              {/* <span>계정을 만들고 EZ2ARCHIVE의 <br/>개인화 서비스를 사용해보세요.</span> */}
              </div>
              <form>
                <fieldset>
                  <div className="sign-input-wrapper">
                    {/* <div className="warning-test">
                      <small className="input-description">아이디</small>
                      <small className="">아이디는 숫자, 영문을 사용해 5~12자 사이어야 합니다.</small>
                    </div> */}
                    <small className="input-description">아이디</small>
                    <input type="text" placeholder="숫자, 영문 대/소문자 포함 5~12자 사이" value={signId} onChange={idHandler} onBlur={idValid ? idChecker : null}></input>
                    {/* 조건에 일단 부합하는지 먼저 체크 → 그 다음 중복인지 아닌지 체크 */}
                    { !idValid && signId.length > 0 && (<small className="input-warning">아이디는 숫자, 영문을 포함하여 5~12자 사이여야 합니다.</small>)}
                    { idValid && signId.length > 0 && !idOnly && (<small className="input-warning">사용할 수 없는 아이디입니다.</small>)}
                  </div>
                  <div className="sign-input-wrapper">
                    <small className="input-description">비밀번호
                    { isCapsLockOn ? 
                    <small className="input-warning-badge">CapsLock ON</small>
                    : null }
                    </small>
                    <input type="password" placeholder="5자 이상" value={signPassword} onChange={passwordHandler} onBlur={passwordSameChecker} onKeyDown={capslockChecker}></input>
                    { !passwordValid && signPassword.length > 0 && signPassword.length < 500 && <small className="input-warning">비밀번호는 5자 이상이어야 합니다.</small> }
                    { !passwordValid && signPassword.length > 500 && <small className="input-warning">비밀번호는 500자 이하 이여야 합니다.</small>}
                  </div>
                  <div className="sign-input-wrapper">
                    <small className="input-description">비밀번호 확인
                    { isCapsLockOn ? 
                    <small className="input-warning-badge">CapsLock ON</small>
                    : null }
                    </small>
                    <input type="password" placeholder="5자 이상" value={signPasswordCheck} onChange={passwordCheckHandler} onBlur={passwordSameChecker} onKeyDown={capslockChecker}></input>
                    { signPassword.length > 0 && signPassword.length < 500 && signPasswordCheck !== "" && !passwordSame && <small className="input-warning">비밀번호가 다릅니다.</small> }
                  </div>
                  <div className="sign-input-wrapper">
                    <small className="input-description">닉네임</small>
                    <input type="text" placeholder="공백과 특수문자를 제외한 문자" value={signNickname} onChange={nicknameHandler}></input>
                    { !nicknameValid && signNickname.length > 0 && <small className="input-warning">닉네임에는 공백과 특수문자가 들어갈 수 없습니다.</small> }
                  </div>
                  <div className="sign-input-wrapper">
                    <small className="input-description">이메일</small>
                    <input type="text" placeholder="ez2archive@gmail.com" value={signEmail} onChange={emailHandler} onBlur={emailValid ? emailChecker : null}></input>
                    { !emailValid && signEmail.length > 0 && <small className="input-warning">올바른 이메일을 입력해주세요.</small> }
                    { emailValid && signEmail.length > 0 && !emailOnly && (<small className="input-warning">사용할 수 없는 이메일입니다.</small>) }
                  </div>
                  <div className="sign-check">
                    <input id="signcheck" type="checkbox" onClick={()=>{setAgree(!agree)}}></input>
                    <label htmlFor="signcheck"></label>
                    <label htmlFor="signcheck" className="sign-text"><strong>[필수] <a href="https://charmed-saguaro-710.notion.site/346c59def42049faa6a1744ccfe73cfe" target="b
                    ">개인정보 수집 및 이용</a> 동의</strong></label>
                  </div>
                  <div className="sign-button">
                    <button disabled={notAllow} className="theme-pp-button" onClick={()=>{
                      axios.post('https://api.ez2archive.kr/signUp', {
                        "email": signEmail,
                        "name": signNickname,
                        "password": signPassword,
                        "userId": signId
                      })
                      dispatch(setModalStep(2))
                      }}>제출하기</button>
                  </div>
                </fieldset>
              </form>
              </div>
          }
          { state.memberModal.modalStep === 2 && 
              <div className="sign-complete">
                <h3 className="theme-pp">이메일을 확인해주세요.</h3>
                <span><strong>{signEmail}</strong><br/>위의 주소로 인증 요청 메일을 보냈습니다.<br/>혹시 이메일이 오지 않았다면 스팸함을 확인해보세요.</span>
                {/* <div className="sign-button"> */}
                  <button onClick={closeAndInputClean}>닫기</button>
                {/* </div> */}
              </div>
          }
        </div>
        <div className="login-bg" onClick={
          state.memberModal.modalStep === 0 || state.memberModal.modalStep === 2 
          ? closeAndInputClean
          : null}></div>
      </div>
    )
  }
 
export default Login