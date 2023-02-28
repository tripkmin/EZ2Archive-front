/*eslint-disable*/

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTitleView, setKeyAndDifficulty, setCleanKeyAndDifficulty, setDescending, setClass, cleanClass } from "./../store.js"

const RankOrderSelector = () => {

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /** RankOrderSelector에서 특정 레벨(ex: lv.17)을 선택할 때 실행됨 */
  const goToPage = (key, difficulty) => {
    navigate(`/rank/${key}/${difficulty}`)
    dispatch(setKeyAndDifficulty({key: key, difficulty: difficulty}))
  }

 useEffect(()=>{
    // 유저가 선택한 난이도와 키 값을 받아 거기에 볼드 클래스를 부착해줌. 
    const step = state.selectIndex.find(el => el.key === state.rankUserSelected.selectedKey)
    const getKeyIndex = state.selectIndex.findIndex(el => el.key === state.rankUserSelected.selectedKey)
    const getDifficultyIndex = step?.difficulty.findIndex(el => el === state.rankUserSelected.selectedDifficulty)
    if(getKeyIndex !== undefined & getDifficultyIndex !== undefined){
      dispatch(setClass({step1 : getKeyIndex, step2 : getDifficultyIndex}))
    }
    // 아래 코드는 index에 0이 들어올 경우 false로 간주되어 클래스 부착이 안되는 문제가 있음. 그래서 위처럼 조건문으로 작성.
    // getKeyIndex && getDifficultyIndex && dispatch(setClass({step1 : getKeyIndex, step2 : getDifficultyIndex}))
  return () => {
    // 컴포넌트가 언마운트/업데이트 될 때 현재 선택된 키와 난이도 clean up함
    dispatch(cleanClass())
    dispatch(setCleanKeyAndDifficulty())
  }
 }, [state.rankUserSelected.selectedKey, state.rankUserSelected.selectedDifficulty])

  return (
    <div className="rank-order-selector-wrapper">
      <div className="rank-order-selector">
        {
          state.selectIndex.map((KeyAndDifficultyData, index)=>{
            return (
              <div className="single-key-level-selector" key={index}>
                <h1 className="theme-pp">{KeyAndDifficultyData.key.toUpperCase()}</h1>
                  {
                    KeyAndDifficultyData.difficulty.map((singleDifficulty, index)=>{
                    return <div key={index}><span className={`link ${KeyAndDifficultyData.class[index]}`} onClick={()=>{
                      goToPage(KeyAndDifficultyData.key, singleDifficulty)
                    }}>Lv. {singleDifficulty}</span></div>
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
            dispatch(setTitleView(e.target.checked))
          }} defaultChecked></input>
          <span className="slider round"></span>
        </label>
        <span className="bold">곡 제목 표시</span>
        <label className="switch switch-margin">
          <input type="checkbox" onClick={(e)=>{
            dispatch(setDescending(e.target.checked))
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