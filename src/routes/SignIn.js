/*eslint-disable*/

import axios from "axios"
import { useEffect, useState } from "react"

function SignIn(){

  const [signId, setSignId] = useState("")
  const [signPassword, setSignPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")

  const [idOnly, setIdOnly] = useState(false)
  const [idValid, setIdValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [agree, setAgree] = useState(false)

  const [notAllow, setNotAllow] = useState(true)
  const [step, setStep] = useState(1)

  const idHandler = (e) => {
    setSignId(e.target.value)
    setIdOnly(true)
  }
  const passwordHandler = (e) => {
    setSignPassword(e.target.value)
  }
  const nicknameHandler = (e) => {
    setNickname(e.target.value)
  }
  const emailHandler = (e) => {
    setEmail(e.target.value)
  }
  const idChecker = (e) => {
    axios.get(`https://api.ez2archive.kr/idCheck?userId=${e.target.value}`)
    .then((res)=>{
      // 아이디 중복이 있으면 true로 반환됨. → idOnly는 false로.
      if (res.data.data){setIdOnly(!res.data.data)} 
      else {setIdOnly(!res.data.data)}      
    })
  }

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
    if (nicknameRegex.test(nickname) ) {setNicknameValid(true)}
    else {setNicknameValid(false)}
  }, [nickname])

  useEffect(()=>{
    const emailRegex = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/
    if (emailRegex.test(email) ) {setEmailValid(true)}
    else {setEmailValid(false)}
  }, [email])

  useEffect(()=>{
    if (idValid && idOnly && passwordValid && nicknameValid && emailValid && agree){
      setNotAllow(false)
      return;
    } 
    setNotAllow(true)
  }, [signId, signPassword, nickname, email, agree, idOnly])

  if (step === 1) { return (
    <div className="sign-in-wrapper">
      <div className="sign-test">
        <div className="sign-in-title">
          <h3 className="theme-pp">회원가입을 시작합니다</h3>
          <h6>계정을 만들고 EZ2ARCHIVE의 개인화 서비스를 시작해보세요.</h6>
        </div>
        <div className="sign-input-wrapper">
          <small className="input-description">아이디</small>
          <input type="text" placeholder="숫자, 영문 대/소문자 포함 5~12자 사이" value={signId} onChange={idHandler} onBlur={idChecker}></input>
          {/* 조건에 일단 부합하는지 먼저 체크 → 그 다음 중복인지 아닌지 체크 */}
          { !idValid && signId.length > 0 && (<small className="input-warning">아이디는 숫자, 영문을 사용해 5~12자 사이어야 합니다.</small>)}
          { idValid && signId.length > 0 && !idOnly && (<small className="input-warning">사용할 수 없는 아이디 입니다.</small>)}
        </div>
        <div className="sign-input-wrapper">
          <small className="input-description">비밀번호</small>
          <input type="password" placeholder="5자 이상" value={signPassword} onChange={passwordHandler}></input>
          { !passwordValid && signPassword.length > 0 && signPassword.length < 500 && <small className="input-warning">비밀번호는 5자 이상이어야 합니다.</small> }
          { !passwordValid && signPassword.length > 500 && <small className="input-warning">비밀번호는 500자 이하이여야 합니다.</small> }
        </div>
        <div className="sign-input-wrapper">
          <small className="input-description">닉네임</small>
          <input type="text" placeholder="공백과 특수문자를 제외한 문자" value={nickname} onChange={nicknameHandler}></input>
          {
            !nicknameValid && nickname.length > 0 && <small className="input-warning">닉네임에는 공백과 특수문자가 들어갈 수 없습니다.</small>
          }
        </div>
        <div className="sign-input-wrapper">
          <small className="input-description">이메일</small>
          <input type="text" placeholder="ez2archive@gmail.com" value={email} onChange={emailHandler}></input>
          {
            !emailValid && email.length > 0 && <small className="input-warning">올바른 이메일을 입력해주세요.</small>
          }
        </div>
        <div className="sign-check">
          <input id="signcheck" type="checkbox" onClick={()=>{setAgree(!agree)}}></input>
          <label for="signcheck"></label>
          <label for="signcheck" className="sign-text"><strong>[필수] <a href="https://charmed-saguaro-710.notion.site/346c59def42049faa6a1744ccfe73cfe" target="b
          ">개인정보 수집 및 이용</a> 동의</strong></label>
          {/* <label for="signcheck"><small><strong>[필수]</strong><a href="https://charmed-saguaro-710.notion.site/346c59def42049faa6a1744ccfe73cfe"> 개인정보 수집 및 이용</a> 동의</small></label> */}
        </div>
        <div className="sign-submit-button">
          <button disabled={notAllow} className="theme-pp-button" onClick={()=>{setStep(2)}}>제출하기</button>
        </div>
      </div>
    </div>
  )} else {
    return (
      <div className="sign-in-wrapper">
        <div className="sign-complete">
          <h3 className="theme-pp">이메일을 확인해주세요.</h3>
          <h6>인증 요청 메일을 <strong>{email}</strong>로 보냈습니다.<br/>혹시 이메일이 오지 않았나요? 스팸함을 확인해보세요.</h6>
          <button onClick={()=>{setStep(1)}}>다시 작성하기</button>
        </div>
      </div>
    )
  }
}

export default SignIn