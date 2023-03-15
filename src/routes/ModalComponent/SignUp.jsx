/*eslint-disable*/

import { useSelector, useDispatch } from "react-redux";
import { switchModalOpen, setModalStep } from "../../store";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../services/temp";

const SignUp = (props) => {
  const dispatch = useDispatch()
  const state = useSelector( (state) => state )
  
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)

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
  
  const idHandler = useCallback((e) => {
    setSignId(e.target.value)
    setIdOnly(true)
    setIsIdChecked(false)
  })
  const passwordHandler = useCallback((e) => {
    setSignPassword(e.target.value)
    setPasswordSame(false)
  })
  const passwordCheckHandler = useCallback((e) => {
    setSignPasswordCheck(e.target.value)
    setPasswordSame(false)
  })
  const nicknameHandler = useCallback((e) => {
    setSignNickname(e.target.value)
  })
  const emailHandler = useCallback((e) => {
    setSignEmail(e.target.value)
    setEmailOnly(true)
    setIsEmailChecked(false)
  })
  const idChecker = useCallback((e) => {
    axios.get(`${API_URL}/idCheck?userId=${e.target.value}`)
    .then((res) => {
      if (res.data.data){setIdOnly(!res.data.data);} 
      else {setIdOnly(!res.data.data); setIsIdChecked(true);}      
    })
  })
  const emailChecker = useCallback((e) => {
    axios.get(`${API_URL}/emailCheck?email=${e.target.value}`)
    .then((res) => {
      // 이메일 중복이 있으면 true로 반환됨. → emailOnly는 false로.
      if (res.data.data){setEmailOnly(!res.data.data)}
      else {setEmailOnly(!res.data.data); setIsEmailChecked(true)}
    })
  })
  const passwordSameChecker = useCallback(() => {
    if (signPassword === signPasswordCheck) {setPasswordSame(true)}
    else {setPasswordSame(false)}
  })
  const capslockChecker = useCallback((e) => {
    if (e.getModifierState("CapsLock")){setIsCapsLockOn(true)} 
    else {setIsCapsLockOn(false)}
  })

  /** 모달창 닫으면 인풋 내용 초기화 되도록 함 */
  const closeAndInputClean = useCallback(() => {
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
    dispatch(setModalStep(0))
  })

  // 유효한 인풋 검증
  useEffect(()=>{
    const idRegex = /^[a-zA-Z0-9]*$/; 
    if (idRegex.test(signId) && signId.length > 4 && signId.length < 13) {setIdValid(true)}
    else {setIdValid(false)}
  }, [signId])

  useEffect(()=>{
    if (signPassword.length > 7 && signPassword.length < 500 ) {setPasswordValid(true)}
    else {setPasswordValid(false)}
  }, [signPassword])

  useEffect(()=>{
    const nicknameRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/; 
    if (nicknameRegex.test(signNickname) && signNickname.length > 0 && signNickname.length < 16) {setNicknameValid(true)}
    else {setNicknameValid(false)}
  }, [signNickname])

  useEffect(()=>{
    const emailRegex = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/
    if (emailRegex.test(signEmail) ) {setEmailValid(true)}
    else {setEmailValid(false)}
  }, [signEmail])

  // 버튼 비활성화 관련
  useEffect(()=>{
    if (idValid 
      && idOnly 
      && passwordValid 
      && passwordSame 
      && nicknameValid 
      && emailValid 
      && emailOnly 
      && agree 
      && signId !== "" 
      && signEmail !== "" 
      && isIdChecked 
      && isEmailChecked){
      setNotAllow(false)
      return;
    } 
    setNotAllow(true)
  }, [idValid, 
    idOnly, 
    passwordValid, 
    passwordSame, 
    nicknameValid, 
    emailValid, 
    emailOnly, 
    agree, 
    signId, 
    signEmail, 
    isIdChecked, 
    isEmailChecked, 
    signPassword, 
    signNickname])

    return (
      <div className="sign-in-wrapper">
        <div className="sign-in-header">
        <h3 className="theme-pp">회원가입</h3>
        </div>
        <form>
          <fieldset>
            <div className="sign-input-wrapper">
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
              <input type="password" placeholder="8자 이상" value={signPassword} onChange={passwordHandler} onBlur={passwordSameChecker} onKeyDown={capslockChecker}></input>
              { !passwordValid && signPassword.length > 0 && signPassword.length < 500 && <small className="input-warning">비밀번호는 8자 이상이어야 합니다.</small> }
              { !passwordValid && signPassword.length > 500 && <small className="input-warning">비밀번호는 500자 이하 이여야 합니다.</small>}
            </div>
            <div className="sign-input-wrapper">
              <small className="input-description">비밀번호 확인
              { isCapsLockOn ? 
              <small className="input-warning-badge">CapsLock ON</small>
              : null }
              </small>
              <input type="password" placeholder="8자 이상" value={signPasswordCheck} onChange={passwordCheckHandler} onBlur={passwordSameChecker} onKeyDown={capslockChecker}></input>
              { signPassword.length > 0 && signPassword.length < 500 && signPasswordCheck !== "" && !passwordSame && <small className="input-warning">비밀번호가 다릅니다.</small> }
            </div>
            <div className="sign-input-wrapper">
              <small className="input-description">닉네임</small>
              <input type="text" placeholder="한글, 영문, 숫자를 사용하여 15자 이하" value={signNickname} onChange={nicknameHandler}></input>
              { !nicknameValid && signNickname.length > 0 && <small className="input-warning">닉네임에는 한글, 영문, 숫자만 사용할 수 있습니다.</small> }
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
              <label htmlFor="signcheck" className="sign-text"><strong>[필수] <a href="https://ez2archive.notion.site/346c59def42049faa6a1744ccfe73cfe" target="b
              ">개인정보 수집 및 이용</a> 동의</strong></label>
            </div>
            <div className="sign-button">
              <button disabled={notAllow} className="theme-pp-button" onClick={()=>{
                axios.post(`${API_URL}/signUp`, {
                  "email": signEmail,
                  "name": signNickname,
                  "password": signPassword,
                  "userId": signId
                })
                dispatch(setModalStep(3))
                }}>제출하기</button>
            </div>
          </fieldset>
        </form>
        </div>
    )
  }
 
export default SignUp