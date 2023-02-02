import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTitleView, setKeyAndDifficulty, setCleanKeyAndDifficulty, setDescending, setClass, cleanClass } from "./../store.js"

function RankOrderSelector(){

  let state = useSelector((state) => state)
  let dispatch = useDispatch()
  let navigate = useNavigate()

  /** RankOrderSelector에서 특정 레벨(ex: lv.17)을 선택할 때 실행됨 */
  function goToPage(key, difficulty){
    navigate(`/rank/${key}/${difficulty}`)
    dispatch(setKeyAndDifficulty({key: key, difficulty: difficulty}))
  }

 useEffect(()=>{
    // 유저가 선택한 난이도와 키 값을 받아 거기에 볼드 클래스를 부착해줌. 
    let step = state.selectIndex.find(el => el.key === state.rankUserSelected.selectedKey)
    let step1 = state.selectIndex.findIndex(el => el.key === state.rankUserSelected.selectedKey)
    let step2 = step?.difficulty.findIndex(el => el === state.rankUserSelected.selectedDifficulty)
    if (step1 !== undefined & step2 !== undefined){
      dispatch(setClass({step1 : step1, step2 : step2}))
    }
  return () => {
    // 컴포넌트가 언마운트/업데이트 될 때 현재 선택된 키와 난이도 clean up함
    dispatch(cleanClass())
    dispatch(setCleanKeyAndDifficulty())
  }
 }, [state.rankUserSelected.selectedKey, state.rankUserSelected.selectedDifficulty])
 
  return (
    <div className="rank-order-selector-wrapper">
      <div className="rank-order-selector">
        {/* 4~8키의 서열 난이도 표시하는 부분. */}
        {
          state.selectIndex.map((SinglekeyAndDifficulty, index)=>{
            return (
              <div className="single-key-level-selector" key={index}>
                <h1 className="theme-pp">{SinglekeyAndDifficulty.key.toUpperCase()}</h1>
                  {
                  SinglekeyAndDifficulty.difficulty.map((singleDifficulty, index)=>{
                  return <span key={index} className={`link ${SinglekeyAndDifficulty.class[index]}`} onClick={()=>{
                    goToPage(SinglekeyAndDifficulty.key, singleDifficulty)
                  }}>Lv. {singleDifficulty}</span>
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