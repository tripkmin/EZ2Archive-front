/*eslint-disable*/

import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setTitleView, setDescending, setAchievementKey, setAchievementLevel, setAchievementRank, setAchievementRankDefault, setSelectedRankView, setAchievementClean } from "../store"

const AchievementSelector = () => {

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {songTitleView, isDescending, selectedKey, selectedKeyCaps, selectedLevel, selectedRank, selectedRankView} = state.achievementUserSelected
  const [overall, setOverall] = useState([
    { name : "rateAvg", data : 0, convertName : "AVERAGE RATE"},
    { name : "allCoolCnt", data : 0, convertName : "ALL COOL" },
    { name : "noMissCnt", data : 0, convertName : "NO MISS"},
    { name : "spppCnt", data : 0, convertName : "S⁺⁺⁺"},
    { name : "sppCnt", data : 0, convertName : "S⁺⁺"},
    { name : "spCnt", data : 0, convertName : "S⁺"},
  ])
  const [songCount, setSongCount] = useState(0)
  const [keyIndex, setKeyIndex] = useState(null)
  const [levelIndex, setLevelIndex] = useState(null)
  const [rankIndex, setRankIndex] = useState([])
  const [titleIndex, setTitleIndex] = useState(null)
  const [descIndex, setDescIndex] = useState(null)
  const [rankFilterIndex, setRankFilterIndex] = useState(null)
  const [filterShow, setFilterShow] = useState(true)
  const [filterClass, setFilterClass] = useState("")
  const {userName} = state.userinfo
  const barLength = 700

  // 임시 영역
  const 키목록 = ['4k', '5k', '6k', '8k']
  const 레벨목록 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  const 등급목록 = [
    {dbRank : "SPPP", convertName : "S⁺⁺⁺"},
    {dbRank : "SPP", convertName : "S⁺⁺"},
    {dbRank : "SP", convertName : "S⁺"},
    {dbRank : "S", convertName : "S"},
    {dbRank : "AP", convertName : "A⁺"},
    {dbRank : "A", convertName : "A"},
    {dbRank : "B", convertName : "B"},
    {dbRank : "C", convertName : "C"},
    {dbRank : "D", convertName : "D"},
    {dbRank : "E", convertName : "E"},
    {dbRank : "F", convertName : "F"},
  ]
  const 등급필터목록 = ["초과", "이상", "동일", "이하", "미만", "해제"]
  const 타이틀목록 = [
    {convertName : "ON", value: true}, 
    {convertName :  "OFF", value: false}
  ]
  const 내림차순목록 = [
    {convertName : "ON", value: true}, 
    {convertName :  "OFF", value: false}
  ]

  // 세부 옵션을 선택하면 선택한 곳의 index를 알아내기 위해 설정함.
  useEffect(()=>{
    setKeyIndex(키목록.indexOf(selectedKey))
    setLevelIndex(레벨목록.indexOf(parseInt(selectedLevel)))
    
    const 인덱스넣을배열 = []
    selectedRank.map(등급 => {
      const index = 등급목록.findIndex(등급목록 => 등급목록.dbRank === 등급)
      인덱스넣을배열.push(index)
    })
    console.log(인덱스넣을배열)
    setRankIndex(인덱스넣을배열)
    // setRankIndex(등급목록.findIndex(el => el.dbRank === selectedRank))
    setRankFilterIndex(등급필터목록.indexOf(selectedRankView))
    setTitleIndex(songTitleView ? 0 : 1)
    setDescIndex(isDescending ? 0 : 1)
  }, [selectedKey, selectedLevel, selectedRank, selectedRankView, songTitleView, isDescending])

  /* 
  ["SP", "S", "AP"]
  이 요소를 기준으로 순회
  등급목록.dbRank의 몇 번째에 있는가
  [3,4,5] → RankIndex로 설정됨
  className 순회할 때 RankIndex에 있는지 확인. i가 그 안에 있는가...로 알면 될듯.
  */

  //
  
  // const 인덱스넣을배열 = []
  // selectedRank.map(등급 => {
  //   const index = 등급목록.findIndex(등급목록 => 등급목록.dbRank === 등급)
  //   인덱스넣을배열.push(index)
  // })
  // console.log(인덱스넣을배열)

  //

  useEffect(()=>{
    if (filterShow) {setFilterClass("")}
    else {setFilterClass("achievement-filter-deactivate")}
  }, [filterShow])
  // 
  useEffect(()=>{
    const AT = localStorage.getItem("accessToken")
    if (selectedKey && selectedLevel) {
      axios
        .get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/record`, {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        })
        .then((res) => {
          // 가공해야 할 정보
            // 평균 rate
            // all cool 갯수
            // all combo 갯수
            // s+++ ~ s+ 갯수      
          const {data} = res.data
          const percentages = data.map(data => data.percentage)
          // const percentagesSum = percentages.reduce((a, b) => a + b, 0)
          // const avgRate = parseFloat((percentagesSum / percentages.length).toFixed(2))
          const allCoolData = data.filter(data => data.isAllCool)
          const noMissData = data.filter(data => data.isNoMiss)
          const grades = data.map(data => data.grade)
          const spppCount = grades.filter(data => data === "SPPP").length
          const sppCount = spppCount + grades.filter(data => data === "SPP").length
          const spCount = spppCount + sppCount + grades.filter(data => data === "SP").length
          const getAvg = (numsArray, toFixedNums) => {
            if (numsArray.length !== 0){
              const sum = numsArray.reduce((a, b) => a + b, 0)
              const avgRate = parseFloat((sum / numsArray.length).toFixed(toFixedNums))
              // toFixed는 string 형식으로 반환하므로..
              return avgRate
            } else { return 0 }
          }
          setOverall([
            { name : "rateAvg", data : getAvg(percentages, 2), convertName : "AVERAGE RATE"},
            { name : "allCoolCnt", data : allCoolData.length, convertName : "ALL COOL" },
            { name : "noMissCnt", data : noMissData.length, convertName : "NO MISS"},
            { name : "spppCnt", data : spppCount, convertName : "S⁺⁺⁺"},
            { name : "sppCnt", data : sppCount, convertName : "S⁺⁺"},
            { name : "spCnt", data : spCount, convertName : "S⁺"},
          ]);
          return axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
        // const { allCoolCnt, noMissCnt, rateAvg, spCnt, sppCnt, spppCnt, totalCnt } = res.data.data
        // let copyOverall = [...overall]
        // let push = [rateAvg, allCoolCnt, noMissCnt, spppCnt, sppCnt, spCnt]
        // copyOverall.forEach((el, i) => {
        //   if(el.name === "rateAvg"){
        //     el.data = Math.round(push[i] * 10)/10
        //   } else el.data = push[i]
        // })
        // setOverall(copyOverall)
        // setSongCount(totalCnt)
      })
      .then((res)=>{
        const {data} = res.data
        setSongCount(data.length)
        navigate(`${selectedKey}/${selectedLevel}`)
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, [selectedKey, selectedLevel])

  useEffect(()=>{
    return () => {
      dispatch(setAchievementClean())
    };
  }, [])

  // const sumReturn = (overallInfo) => {
  //   const { name, data } = overallInfo
  //   if (name === "spCnt"){}
  // }

  return (
    <>
    <div className="achievement-selector-wrapper">
      <div className="achievement-selector">
        <div className="achievement-userinfo">
          <div className="achievement-key-level">
            <h1 className="theme-pp">{
            selectedKey === ""
            ? "?K"
            : selectedKey.toUpperCase()
            }</h1>
            <h4>{
            selectedLevel === 0
            ? ""
            : selectedLevel
            }</h4>
          </div>
          <h4>{userName}</h4>
        </div>
        <div className="achievement-detail">
          {/* <h3 className="theme-pp">OVERALL</h3> */}
          <table>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td>
                  <h3 className="theme-pp">OVERALL</h3>
                </td>
              </tr>
              {
                overall.map((overall, i) => {
                  return (
                    <tr key={i}>
                      {/* <td>{Math.round(((overall.data)) * 10) / 10}%</td> */}
                      <td>{`${overall.data}%`}</td>
                      {/* 임시, Average Rate 표기 방식이 달라질 경우 아래 부분 수정 */}
                      <td>{ overall.name === "rateAvg" 
                      ? overall.data.toFixed(0) + "/" + 100 
                      : overall.data + "/" + songCount }</td>
                      {/* 임시 끝 */}
                      <td>
                        <div className="behind-bar">
                          <div 
                          className="bar"                                
                          style={{transform: 
                            overall.name === "rateAvg" 
                            ? `translateX(${ -barLength + (barLength * overall.data / 100)}px)` 
                            : `translateX(${ -barLength + (barLength * (overall.data / songCount))}px`
                          }}
                          ></div>
                          <span>{overall.convertName}</span>
                          <div className="bar-shadow" style={{width: `${barLength *  overall.data / 100}`}}></div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className="achievement-option-box" onClick={()=>{setFilterShow(!filterShow)}}>
          <span className="bold">필터 {filterShow ? "숨기기" : "보기"}</span>
        </div>
      </div>
    </div>
    <div className={`achievement-filter-wrapper no-drag ${filterClass}`}>
      <div>
        <h4 className="theme-pp">KEY</h4>
        {
          키목록.map((el, i) => {
            return (
              <li 
                className={`achievement-filter-element ${i === keyIndex ? "achievement-filter-element-active" : ""}`} 
                key={i} 
                onClick={()=>{dispatch(setAchievementKey(el))}}
              >{el.toUpperCase()}</li>
            )
          })
        }
       </div>
      <div>
        <h4 className="theme-pp">LEVEL</h4>
        {
          레벨목록.map((el, i) => {
            return (
              <li 
              className={`achievement-filter-element ${i === levelIndex ? "achievement-filter-element-active" : ""}`} 
              key={i} 
              onClick={()=>{dispatch(setAchievementLevel(el))}}
              >{el}</li>
            )
          })
        }
      </div>
      <div>
      <h4 className="theme-pp">RANK</h4>
      {
        등급목록.map((el, i) => {
          let 등급인덱스안에있는지 = rankIndex.find(el => el === i)
          return (
            // rankIndex에서 i가 있는지 확인. true면 클래스부착, 아니면 떼기
            // rankIndex.find(el => el === i)
            <li 
            // className={`achievement-filter-element ${i === rankIndex ? "achievement-filter-element-active" : ""}`} 
            className={`achievement-filter-element ${등급인덱스안에있는지 !== undefined ? "achievement-filter-element-active" : ""}`} 
            key={i} 
            onClick={()=>{dispatch(setAchievementRank(el.dbRank))}}
            >{el.convertName}</li>
          )
        })
      }
      <li 
      className="achievement-filter-element"
      onClick={()=>{dispatch(setAchievementRankDefault())}}>해제</li>
      </div>
      {/* <div>
        <h4 className="theme-pp">FILTER</h4>
        {
          등급필터목록.map((el, i) => {
            return (
              <li 
                className={`achievement-filter-element ${i === rankFilterIndex ? "achievement-filter-element-active" : ""}`} 
                onClick={()=>{dispatch(setSelectedRankView(el))}}
                key={i}
              >{el}</li>
            )  
          })
        }
      </div> */}
      <div>
        <h4 className="theme-pp">TITLE</h4>
        {
          타이틀목록.map((el, i) => {
            return (
              <li 
                className={`achievement-filter-element ${i === titleIndex ? "achievement-filter-element-active" : ""}`} 
                onClick={()=>{dispatch(setTitleView(el.value))}}
                key={i}
              >{el.convertName}</li>
            )  
          })
        }
      </div>
      <div>
        <h4 className="theme-pp">내림차순</h4>
        {
          내림차순목록.map((el, i) => {
            return (
              <li 
                className={`achievement-filter-element ${i === descIndex ? "achievement-filter-element-active" : "" }`} 
                onClick={()=>{dispatch(setDescending(el.value))}}
                key={i}
              >{el.convertName}</li>
            )  
          })
        }
      </div>
    </div>
  </>
  )
}

export default AchievementSelector