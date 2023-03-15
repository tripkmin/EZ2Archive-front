/*eslint-disable*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useSelector, useDispatch } from "react-redux";
import { switchModalOpen, setModalStep, setModalDefault } from "../store";
import { useCallback, useEffect, useRef, useState } from "react";

import EmailSent from "./ModalComponent/EmailSent"
import Login from "./ModalComponent/Login"
import SignUp from "./ModalComponent/SignUp"
import AchievementDetail from "./ModalComponent/AchievementDetail";

  /* step 설명
    0 : 모달 사라질 때 변경될 default 창
    1 : 로그인 창
    2 : 회원가입 창
    3 : 이메일 인증 창
    4 : 성과표 창
  */
 
const Modal = () => {
  const dispatch = useDispatch()
  const state = useSelector( (state) => state )
  const clickRef = useRef()

  const [modalOpenClass, setModalOpenClass] = useState("")
  const [modalStepClass, setModalStepClass] = useState(0)
  const {isModalOpen, modalStep} = state.modal

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalOpenClass && modalStep !== 2 && e.keyCode === 27 ) {
        dispatch(setModalDefault());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpenClass, modalStep]);


  const clickOutside = (e) => {
    if (isModalOpen && modalStep !== 2 && !clickRef.current.contains(e.target)){
      dispatch(setModalDefault())
    }
  }

  useEffect(()=>{
    if(isModalOpen){setModalOpenClass("member-modal-open")}
    else {setModalOpenClass("")}
  }, [isModalOpen]) 

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

  useEffect(()=>{
    if (isModalOpen) document.addEventListener('mousedown', clickOutside)
    return () => {document.removeEventListener('mousedown', clickOutside)}
  })
    
    return (
      <div className={`member-modal ${modalOpenClass}`}>
        <div className={`${modalStepClass}`} ref={clickRef}>
          <div className="member-header">
            <FontAwesomeIcon icon={faXmark} onClick={()=>{dispatch(setModalDefault())}} style={{cursor:'pointer' }}></FontAwesomeIcon>
            { 
              // 스텝 테스트용, 평소에는 비활성화 해야함!
              // <FontAwesomeIcon icon={faArrowRight} onClick={()=>{dispatch(setModalStep(modalStep + 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
            }
            { modalStep === 2
            ? <FontAwesomeIcon icon={faArrowLeft} onClick={()=>{dispatch(setModalStep(modalStep - 1))}} style={{cursor:'pointer'}}></FontAwesomeIcon>
            : null
            }
          </div>
          { modalStep === 0 && 
            null 
          }
          { modalStep === 1 && 
            <Login />
          }
          { modalStep === 2 &&
            <SignUp />
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
        <div className="login-bg"></div>
      </div>
    )
  }
 
export default Modal