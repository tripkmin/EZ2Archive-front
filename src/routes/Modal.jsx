/*eslint-disable*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useSelector, useDispatch } from "react-redux";
import { switchModalOpen, setModalStep, setModalDefault } from "../store";
import { useCallback, useEffect, useState } from "react";

import EmailSent from "./ModalComponent/EmailSent"
import Login from "./ModalComponent/Login"
import Signin from "./ModalComponent/Signin"
import AchievementDetail from "./ModalComponent/AchievementDetail";

const Modal = () => {
  const dispatch = useDispatch()
  const state = useSelector( (state) => state )

  const [modalOpenClass, setModalOpenClass] = useState("")
  const [modalStepClass, setModalStepClass] = useState(0)
  const {isModalOpen, modalStep} = state.modal

  // 개발중
  const escFunction = useCallback((e) => {
    if (modalOpenClass && e.key === "Escape"){
      console.log('esc 누름')
    }
  }, [])

  useEffect(()=>{
    if(isModalOpen){setModalOpenClass("member-modal-open")}
    else {setModalOpenClass("")}
  }, [isModalOpen]) 

  /* step 설명
    0 : 모달 사라질 때 변경될 default 창
    1 : 로그인 창
    2 : 회원가입 창
    3 : 이메일 인증 창
    4 : 성과표 창
  */
 
  useEffect(()=>{
    switch(modalStep){
      case 0: 
      case 1: 
        setModalStepClass(`modal-sm`); break
      case 2: setModalStepClass(`modal-md`); break
      case 3: setModalStepClass(`modal-sm`); break
      case 4: setModalStepClass(`modal-lg`); break
      case 5: setModalStepClass(`modal-xl`); break
      default: // nothing
    }
  }, [modalStep])

  // 개발 중
  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [modalOpenClass]);

    
    return (
      <div className={`member-modal ${modalOpenClass}`}>
        <div className={`${modalStepClass}`}>
          <div className="member-header">
            <FontAwesomeIcon icon={faXmark} onClick={()=>{dispatch(setModalDefault())}} style={{cursor:'pointer' }}></FontAwesomeIcon>
            { 
              // 스텝 테스트용, 평소에는 비활성화 해야함!
              // <FontAwesomeIcon icon={faArrowRight} onClick={()=>{dispatch(setModalStep(modalStep + 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
            }
            { modalStep === 1
            ? <FontAwesomeIcon icon={faArrowLeft} onClick={()=>{dispatch(setModalStep(modalStep - 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
            : null
            }
          </div>
          {/* modalStep === 1 : 로그인 창 / 2 : 회원가입 창 / 3 : 이메일 발송 창 */}
          { modalStep === 0 && null }
          { modalStep === 1 && 
            <Login />
          }
          { modalStep === 2 &&
            <Signin />
          }
          { modalStep === 3 && 
            <EmailSent />
          }
          { modalStep === 4 && 
            <AchievementDetail />
          }
          { modalStep === 5 && 
            <div className="sign-complete">
              <h3>서열표 모달</h3>
            </div>
          }
        </div>
        <div className="login-bg" onClick={
          // 로그인, 이메일 발송 모달창에서만 배경 클릭시 모달창이 닫히도록 설정함.
          // modalStep === 0 || modalStep === 2 
          modalStep !== 2 
          ? ()=>{dispatch(setModalDefault())}
          : null}></div>
      </div>
    )
  }
 
export default Modal