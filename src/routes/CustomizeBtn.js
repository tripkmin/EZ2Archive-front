/*eslint-disable*/

import { useEffect, useRef, useState } from "react"

function CustomizeBtn(){

  let [isOpen, setIsOpen] = useState(false)
  let [customClass, setCustomClass] = useState("customize-close")
  let [currentTheme, setCurrentTheme] = useState(["",""])
  let [themeList] = useState(["pp", "tt"])
  // 리덕스로 themeList 빼서 Theme-pp 관련 하드코딩 되어있는 곳 다 수정해야 함.

  let clickRef = useRef()

  function clickOutside(e){
    if (isOpen && !clickRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(()=>{
    if (isOpen){setCustomClass("customize-show")} else { setCustomClass("customize-close") }
  }, [isOpen])

  useEffect(()=>{
    if (isOpen) document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  })

  // useEffect(()=>{
  //   setCurrentTheme(["pp",""])
  // })

  return (
    <div ref={clickRef} className="customize-wrapper">
      <div className={`customize-list ${customClass}`}>
        {
          themeList.map((themeElement, index)=>
            <button className={`${currentTheme[index]}`} onClick={()=>{
              let themeIndex = themeList.findIndex( el => el === themeElement )
              let newArray = ["",""]
              newArray[themeIndex] = `theme-${themeElement} bold`
              setCurrentTheme(newArray)
            }} key={index}>{themeElement.toUpperCase()}</button>
          )
        }
      </div>
      <button className="customize-btn theme-pp-button" onClick={()=>{
          setIsOpen(!isOpen)
      }}>테마 선택</button>
    </div>
  )
}

export default CustomizeBtn