/*eslint-disable*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { switchModalOpen, setModalStep, setModalDefault } from '../store'
import { useCallback, useEffect, useRef, useState } from 'react'

import EmailSent from './ModalComponent/EmailSent'
import Login from './ModalComponent/Login'
import SignUp from './ModalComponent/SignUp'
import AchievementDetail from './ModalComponent/AchievementDetail'

/* step 설명
    0 : 모달 사라질 때 변경될 default 창
    1 : 로그인 창
    2 : 회원가입 창
    3 : 이메일 인증 창
    4 : 성과표 창
  */

const Modal = () => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const clickRef = useRef()

  const [modalAnimation, setModalAnimation] = useState('')
  const [modalStepClass, setModalStepClass] = useState(0)
  const { isModalOpen, modalStep } = state.modal

  // 모달창이 띄워진 상태에서 ESC를 누르면 닫히도록 설정됨
  useEffect(() => {
    const handleKeyDown = e => {
      // 회원가입 창에서는 ESC가 안 먹히도록 함.
      if (modalStep !== 2 && e.keyCode === 27) {
        dispatch(setModalDefault())
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalStep])

  // 모달창 바깥을 클릭하면 닫히도록 설정됨
  const clickOutside = e => {
    // 회원가입 창에서는 바깥쪽을 클릭해도 닫히지 않도록 설정.
    if (
      isModalOpen &&
      modalStep !== 2 &&
      !clickRef.current.contains(e.target)
    ) {
      dispatch(setModalDefault())
    }
  }

  useEffect(() => {
    switch (modalStep) {
      case 0:
      case 1:
        setModalStepClass(`modal-sm`)
        break
      case 2:
        setModalStepClass(`modal-md`)
        break
      case 3:
        setModalStepClass(`modal-sm`)
        break
      case 4:
        setModalStepClass(`modal-lg`)
        break
      case 5:
        setModalStepClass(`modal-xl`)
        break
      default: // nothing
    }
  }, [modalStep])

  useEffect(() => {
    if (isModalOpen) document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  })

  useEffect(() => {
    let animationTimer

    if (isModalOpen) {
      animationTimer = setTimeout(() => {
        setModalAnimation('member-modal-open')
      }, 10)
    }

    return () => {
      clearTimeout(animationTimer)
      setModalAnimation('')
    }
  }, [isModalOpen])

  return isModalOpen ? (
    <div className={`member-modal ${isModalOpen ? modalAnimation : ''}`}>
      <div className={`${modalStepClass}`} ref={clickRef}>
        <div className="member-header">
          <FontAwesomeIcon
            className="pointer"
            icon={faXmark}
            onClick={() => {
              dispatch(setModalDefault())
            }}
          ></FontAwesomeIcon>
          {
            // 스텝 테스트용, 평소에는 비활성화 해야함!
            // <FontAwesomeIcon
            //   className="pointer"
            //   icon={faArrowRight}
            //   onClick={() => {
            //     dispatch(setModalStep(modalStep + 1))
            //   }}
            // ></FontAwesomeIcon>
          }
          {modalStep === 2 ? (
            <FontAwesomeIcon
              className="pointer"
              icon={faArrowLeft}
              onClick={() => {
                dispatch(setModalStep(modalStep - 1))
              }}
            ></FontAwesomeIcon>
          ) : null}
        </div>
        {modalStep === 0 && null}
        {modalStep === 1 && <Login />}
        {modalStep === 2 && <SignUp />}
        {modalStep === 3 && <EmailSent />}
        {modalStep === 4 && <AchievementDetail />}
      </div>
      <div
        className={`login-bg ${modalStep === 2 ? 'click-forbidden' : ''}`}
      ></div>
    </div>
  ) : null
}

export default Modal
