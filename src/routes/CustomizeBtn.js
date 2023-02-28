/*eslint-disable*/

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const CustomizeBtn = () => {
  // 리덕스로 themeList 빼서 Theme-pp 관련 하드코딩 되어있는 곳 다 수정해야 함.
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const [show, setShow] = useState(true)
  const [showClass, setShowClass] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [customClass, setCustomClass] = useState("customize-close")
  const [currentTheme, setCurrentTheme] = useState(["",""])
  const [themeList] = useState(["pp", "tt"])
  const clickRef = useRef()

  const clickOutside = (e) => {if (isOpen && !clickRef.current.contains(e.target)) {setIsOpen(false)}}

  // useEffect(()=>{
  //   if (state.userinfo.manageMode){setShow(false);}
  //   else {setShow(true);}
  // }, [state.userinfo.manageMode])

  // useEffect(()=>{
  //   if (show){setShowClass("")} else {setShowClass("display-none")}
  // }, [show])

  useEffect(()=>{
    if (isOpen){setCustomClass("customize-show")} else { setCustomClass("customize-close") }
  }, [isOpen])

  useEffect(()=>{
    if (isOpen) document.addEventListener('mousedown', clickOutside)
    return () => {document.removeEventListener('mousedown', clickOutside)}
  })

  return (
    <div ref={clickRef} className={`customize-wrapper ${showClass}`}>
      <div className={`customize-list ${customClass}`}>
        {
          themeList.map((themeElement, index)=>
            <button className={`${currentTheme[index]}`} onClick={()=>{
              const themeIndex = themeList.findIndex( el => el === themeElement )
              const newArray = ["",""]
              newArray[themeIndex] = `theme-${themeElement} bold`
              setCurrentTheme(newArray)
            }} key={index}>{themeElement.toUpperCase()}</button>
          )
        }
      </div>
      <button className="customize-btn theme-pp-button" onClick={()=>{
        setIsOpen(!isOpen)
        }}>테마 선택
      </button>
    </div>
  )
}

export default CustomizeBtn