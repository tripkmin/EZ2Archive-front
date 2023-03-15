/*eslint-disable*/

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRankTitleView, setRankKeyAndLevel, setRankCleanKeyAndLevel, setRankDescending, setClass, cleanClass } from "../store"

const RankOrderSelector = () => {

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /** RankOrderSelector에서 특정 레벨(ex: lv.17)을 선택할 때 실행됨 */
  const goToPage = (key, level) => {
    // 원본
    navigate(`/rank/${key}/${level}`)
    dispatch(setRankKeyAndLevel({key: key, level: level}))
  }

 useEffect(()=>{
    // 유저가 선택한 난이도와 키 값을 받아 거기에 볼드 클래스를 부착해줌. 
    const step = state.selectIndex.find(el => el.key === state.rankUserSelected.selectedKey)
    const getKeyIndex = state.selectIndex.findIndex(el => el.key === state.rankUserSelected.selectedKey)
    const getLevelIndex = step?.level.findIndex(el => el === state.rankUserSelected.selectedLevel)
    if(getKeyIndex !== undefined & getLevelIndex !== undefined){
      dispatch(setClass({step1 : getKeyIndex, step2 : getLevelIndex}))
    }
    // 아래 코드는 index에 0이 들어올 경우 false로 간주되어 클래스 부착이 안되는 문제가 있음. 그래서 위처럼 조건문으로 작성.
    // getKeyIndex && getLevelIndex && dispatch(setClass({step1 : getKeyIndex, step2 : getLevelIndex}))
  return () => {
    dispatch(cleanClass())
    dispatch(setRankCleanKeyAndLevel())
  }
 }, [state.rankUserSelected.selectedKey, state.rankUserSelected.selectedLevel])

  return (
    <div className="rank-order-selector-wrapper">
      <div className="rank-order-selector">
        {
          state.selectIndex.map((KeyLevelData, index)=>{
            return (
              <div className="single-key-level-selector" key={index}>
                <h1 className="theme-pp">{KeyLevelData.key.toUpperCase()}</h1>
                  {
                    KeyLevelData.level.map((singleLevel, index)=>{
                    return <div key={index}><span className={`link ${KeyLevelData.class[index]}`} onClick={()=>{
                      goToPage(KeyLevelData.key, singleLevel)
                    }}>Lv. {singleLevel}</span></div>
                    })
                  }
              </div>
            )
          })
        }
      </div>
      <div className="option-box">
        <label className="switch">
          <input type="checkbox" onClick={(e)=>{
            dispatch(setRankTitleView(e.target.checked))
          }} defaultChecked></input>
          <span className="slider round"></span>
        </label>
        <span className="bold">곡 제목 표시</span>
        <label className="switch switch-margin">
          <input type="checkbox" onClick={(e)=>{
            dispatch(setRankDescending(e.target.checked))
          }} defaultChecked></input>
          <span className="slider round"></span>
        </label>
        <span className="bold">
          내림차순
        </span>
      </div>
    </div>
  )
}


export default RankOrderSelector