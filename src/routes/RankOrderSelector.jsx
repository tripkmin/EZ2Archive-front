/*eslint-disable*/

import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setRankTitleView,
  setRankKeyAndLevel,
  setRankClean,
  setRankDescending,
  setClass,
  cleanClass,
  setRankKey,
  setRankLevel,
} from '../store'
const RankOrderSelector = () => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedKey, selectedLevel, songTitleView, isDescending } =
    state.rankUserSelected
  const keyList = ['4k', '5k', '6k', '8k']
  const levelList = [14, 15, 16, 17, 18, 19, 20]
  const titleViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ]
  const descViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ]
  const [keyIndex, setKeyIndex] = useState(null)
  const [levelIndex, setLevelIndex] = useState(null)
  const [titleIndex, setTitleIndex] = useState(null)
  const [descIndex, setDescIndex] = useState(null)

  /** RankOrderSelector에서 특정 레벨(ex: lv.17)을 선택할 때 실행됨 */
  const goToPage = (key, level) => {
    // 원본
    navigate(`/rank/${key}/${level}`)
    dispatch(setRankKeyAndLevel({ key: key, level: level }))
  }

  useEffect(() => {
    if (selectedKey && selectedLevel) {
      navigate(`/rank/${selectedKey}/${selectedLevel}`)
    }
  }, [selectedKey, selectedLevel])

  useEffect(() => {
    return () => {
      dispatch(setRankClean())
    }
  }, [])

  useEffect(() => {
    setKeyIndex(keyList.indexOf(selectedKey))
    setLevelIndex(levelList.indexOf(parseInt(selectedLevel)))
    setTitleIndex(songTitleView ? 0 : 1)
    setDescIndex(isDescending ? 0 : 1)
  }, [selectedKey, selectedLevel, songTitleView, isDescending])

  return (
    <>
      <div className="rank-filter-wrapper no-drag">
        <div>
          <h4 className="theme-pp">KEY</h4>
          {keyList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === keyIndex ? 'achievement-filter-element-active' : ''
                }`}
                key={i}
                onClick={() => {
                  console.log(el)
                  dispatch(setRankKey(el))
                }}
              >
                {el.toUpperCase()}
              </li>
            )
          })}
        </div>
        <div>
          <h4 className="theme-pp">LEVEL</h4>
          {levelList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === levelIndex ? 'achievement-filter-element-active' : ''
                }`}
                key={i}
                onClick={() => {
                  console.log(el)
                  dispatch(setRankLevel(el))
                }}
              >
                {el}
              </li>
            )
          })}
        </div>
        <div>
          <h4 className="theme-pp">TITLE</h4>
          {titleViewList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === titleIndex ? 'achievement-filter-element-active' : ''
                }`}
                onClick={() => {
                  dispatch(setRankTitleView(el.value))
                }}
                key={i}
              >
                {el.convertName}
              </li>
            )
          })}
        </div>
        <div>
          <h4 className="theme-pp">내림차순</h4>
          {descViewList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === descIndex ? 'achievement-filter-element-active' : ''
                }`}
                onClick={() => {
                  dispatch(setRankDescending(el.value))
                }}
                key={i}
              >
                {el.convertName}
              </li>
            )
          })}
        </div>
      </div>
      {/* <div className="rank-order-selector-wrapper">
        <div className="rank-order-selector">
          {state.selectIndex.map((KeyLevelData, index) => {
            return (
              <div className="single-key-level-selector" key={index}>
                <h1 className="theme-pp">{KeyLevelData.key.toUpperCase()}</h1>
                {KeyLevelData.level.map((singleLevel, index) => {
                  return (
                    <div key={index}>
                      <span
                        className={`link ${KeyLevelData.class[index]}`}
                        onClick={() => {
                          goToPage(KeyLevelData.key, singleLevel)
                        }}
                      >
                        {singleLevel}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="option-box">
          <label className="switch">
            <input
              type="checkbox"
              onClick={e => {
                dispatch(setRankTitleView(e.target.checked))
              }}
              defaultChecked
            ></input>
            <span className="slider round"></span>
          </label>
          <span className="bold">곡 제목 표시</span>
          <label className="switch switch-margin">
            <input
              type="checkbox"
              onClick={e => {
                dispatch(setRankDescending(e.target.checked))
              }}
              defaultChecked
            ></input>
            <span className="slider round"></span>
          </label>
          <span className="bold">내림차순</span>
        </div>
      </div> */}
    </>
  )
}

export default RankOrderSelector
