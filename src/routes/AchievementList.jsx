/*eslint-disable*/

import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setAchievementKey, setAchievementLevel, switchModalOpen, setModalStep, setSongInfo, set테스트, setFilteredElementIdx  } from "../store"
import defaultProfile from './../imagenone.webp'
import { getPlayStatusClass, returnGrade, rankFilter, renamed } from "../utills/utill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons"


const AchievementList = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {urlKey, urlLevel} = useParams()
  const {
    selectedKey, 
    selectedKeyCaps, 
    selectedLevel, 
    selectedRank, 
    songTitleView, 
    isDescending} = state.achievementUserSelected
  const {테스트, filteredElementIdx} = state.achievementSongInfo
  const [selectedScoreInput, setSelectedScoreInput] = useState([-1, -1])
  const [isWriteAllCool, setIsWriteAllCool] = useState(false)
  const [isWriteAllCombo, setIsWriteAllCombo] = useState(false)
  const [scoreInputValue, setScoreInputValue] = useState(-1)
  // const [filteredElementIdx, setFilteredElementIdx] = useState(-1)
  const [msg, setMsg] = useState("")
  const [isMsgBoxVisible, SetIsMsgBoxVisible] = useState(false)
  const AT = localStorage.getItem("accessToken")

  let rankIndex 
  if (isDescending){
    rankIndex = [[9,8],[7,6],[5,4],[3,2],[1,0],[-99]];
  } else {rankIndex = [[1,0],[3,2],[5,4],[7,6],[9,8],[-99]];}

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(()=>{
    dispatch(setAchievementKey(urlKey))
    dispatch(setAchievementLevel(urlLevel))  
  }, [])

  // 키와 난이도가 전부 선택되었을 때 데이터 요청을 실시 
  useEffect(()=>{
    if (selectedKey && selectedLevel) {
      fetchUserAchievementData();
    }
  }, [selectedKey, selectedLevel])

  useEffect(()=>{
    dispatch(setSongInfo(테스트[filteredElementIdx]))
  }, [테스트])  

  // 리스트 간편 수기 입력창에서 All Cool이 켜지면 All Combo가 자동으로 켜지게 함
  useEffect(()=>{
    if(isWriteAllCool){setIsWriteAllCombo(true)}
  }, [isWriteAllCool])

  // 리스트 간편 수기 입력창에서 All Combo가 꺼지면 All Cool이 자동으로 꺼지게 함
  useEffect(()=>{
    if(!isWriteAllCombo){setIsWriteAllCool(false)}
  }, [isWriteAllCombo])

  useEffect(()=>{
    const alertOpen = () => {
      SetIsMsgBoxVisible(true)
      setTimeout(()=>{
        SetIsMsgBoxVisible(false)
      }, 3000)
    }
    if(msg){alertOpen()}
    return ()=>{clearTimeout(alertOpen)}
  }, [msg])

  const fetchUserAchievementData = async () => {
    try {
      // 유저가 택한 곡의 단순 목록과 유저가 기록한 리스트를 가져옴.
      let songList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
      let recordList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/record`, {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })
      let songWithRecordData = []

      songList = songList.data.data;
      recordList = recordList.data.data
      // 유저가 플레이한 곡의 정보와 단순 곡 정보를 합치고, 
      // 유저가 플레이하지 않은 곡은 단순 곡 정보만 갖고 userAchievementData에 넣음
      songList.forEach((singleSong) => {
        let userRecordData = recordList.find(singleRecord => singleRecord.musicInfoId === singleSong.id)
        if(userRecordData){
          let combinedData = {...singleSong, userRecordData}
          songWithRecordData.push(combinedData)
        } else {
          let combinedData = {...singleSong, userRecordData: {}}
          songWithRecordData.push(combinedData)
        }
      })
      dispatch(set테스트(songWithRecordData))
    } catch (err) {
      console.log(err)
    }
  }

  const matchFilter = (songinfo) => {
    if(songinfo.userRecordData){
      const {grade} = songinfo.userRecordData
      const 찾기 = selectedRank.find(선택된등급 => 선택된등급 === grade)
      if (!찾기 && selectedRank.length !== 0){ return "disabled"}
    }
  }

  const handleImgError = (e) => {
    e.target.src = defaultProfile;
  }

  const achievementModalOpen = (filteredElement) => {
    dispatch(switchModalOpen())
    dispatch(setModalStep(4))
    dispatch(setSongInfo(filteredElement))
    dispatch(setFilteredElementIdx(테스트.findIndex(el => el.id === filteredElement.id)))
  }

  /** 곡 리스트와 rankIndex 단일 요소를 넣으면 그 기준에 맞는 곡만 반환 */ 
  const filterByDifficultyIndex = (data, array) => {
    return data.filter(songlist => 
      songlist.rank === array[0] 
      || songlist.rank === array[1]
    )
  }
  
  /** 곡 리스트들을 난이도를 기준으로 정렬함. 내림차순, 오름차순 옵션이 반영됨. */
  const sortByDifficulty = (data) => {
    /** 난이도를 숫자화시켜 정렬에 용이하도록 만들어줌 */
    const getDifficultyScore = (difficulty) => {
      switch (difficulty) {
        case "EZ":
          return 1;
        case "NM":
          return 2;
        case "HD":
          return 3;
        case "SHD":
          return 4;
        default:
          return 0;
      }
    }
    const sorted = data.sort((a, b) => {
      const x = getDifficultyScore(a.difficulty);
      const y = getDifficultyScore(b.difficulty);
      return isDescending ? y - x : x - y;
    })
    return sorted
  }

  const scorePostReq = (id) => {
    axios
    .post(`${API_URL}/record/save`,
      {
        "allCool": isWriteAllCool,
        "musicInfoId": id,
        "noMiss": isWriteAllCombo,
        "score": scoreInputValue
      },
      {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })
    .then(res => {
      if(res.status >= 200 && res.status < 300){
        setSelectedScoreInput([-1, -1])
        fetchUserAchievementData()
        setMsg("저장 완료")
      }
    })
    .catch(error => setMsg(error.response.data.message))

  }

    return (
      <>
        <div className="orderlist-wrapper">
          <div className="header">
            <h1 className="theme-pp">{selectedKey.toUpperCase()} </h1>
            <h1>{selectedLevel}</h1> 
          </div>
          {/* Songs 클래스 네임 변경할것 */}
          <div className="flex-grow-1">
          { // 서열을 중심으로 순회
            rankIndex.map((targetRank, rowIdx) => { 
              // return userAchievementData.filter(songlist => 
              return 테스트.filter(songlist => 
                songlist.rank === targetRank[0] 
                || songlist.rank === targetRank[1]
                ).length !== 0
              ? 
                <div className="order-box" key={rowIdx}>
                  <span className="order-grade">{rankFilter(targetRank[0])}</span>
                  <div className='order-list'>
                  {/* {sortByDifficulty(filterByDifficultyIndex(userAchievementData, targetRank)) */}
                  {sortByDifficulty(filterByDifficultyIndex(테스트, targetRank))
                    .map((filteredElement, columnIdx)=>{
                      const {
                        artist,
                        bestScore,
                        bpm,
                        category,
                        description,
                        difficulty,
                        id,
                        keyType,
                        level,
                        name,
                        rank,
                        totalNote,
                        userRecordData
                        // userRecordData가 없을 경우에는 기본값으로 빈 객체를 줌
                      } = filteredElement
                      const {
                        recordId,
                        grade,
                        isAllCool,
                        isNoMiss,
                        score,
                        percentage
                      } = userRecordData
                      return (
                        <div className="song-wrapper" key={columnIdx}>
                          <div className="song-infobox">
                            <div className="imgbox no-drag">
                              { selectedScoreInput[0] === rowIdx && 
                                selectedScoreInput[1] === columnIdx && 
                                <div className="score-input-option-wrapper">
                                  <FontAwesomeIcon icon={faXmark} className="xmarkBtnCircle" onClick={()=>{setSelectedScoreInput([-1, -1])}}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faCheck} className="checkBtnCircle" onClick={()=>{scorePostReq(id)}}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faStarHalf} className={`starHalfBtnCircle ${isWriteAllCombo ? null : "no-checked"}`} onClick={()=>{setIsWriteAllCombo(prev => !prev)}}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faStar} className={`starBtnCircle ${isWriteAllCool ? null : "no-checked"}`} onClick={()=>{setIsWriteAllCool(prev => !prev)}}></FontAwesomeIcon>
                                </div>
                                }
                            <img  
                                src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed(name) + '.webp'} 
                                alt={name}
                                onError={handleImgError}
                                // 문제발생
                                className={`${getPlayStatusClass(filteredElement)} ${matchFilter(filteredElement)} small-border theme-pp-shadow`}
                                // 문제발생 끝
                                onClick={()=>{achievementModalOpen(filteredElement)}}
                              ></img>
                              <div 
                                className={`shadowbox ${matchFilter(filteredElement)}`}
                                onClick={()=>{achievementModalOpen(filteredElement)}}></div>
                              <span 
                                className={`level-badge ${difficulty}`} 
                                onClick={()=>{achievementModalOpen(filteredElement)}}
                              >{difficulty}</span>
                              <div 
                                className="test2"
                              >
                                <img 
                                  src={process.env.PUBLIC_URL + '/gradeImg/'+ returnGrade(grade) + '.png'} 
                                  className="test3"
                                  onClick={()=>{achievementModalOpen(filteredElement)}}
                                ></img>
                                <p 
                                  className="test4"
                                  onClick={()=>{setSelectedScoreInput([rowIdx, columnIdx])}}
                                  style={grade === "AP" ? {marginRight : "5px"} : null }
                                >{score ? (Math.floor(score/100)/100).toFixed(2) : "-"}
                                </p>
                                {
                                selectedScoreInput[0] === rowIdx && 
                                selectedScoreInput[1] === columnIdx && 
                                <input 
                                  type="number" 
                                  name="score" 
                                  step="1000" 
                                  onInput={(e) => {
                                    if (e.target.value.length > e.target.maxLength)
                                      e.target.value = e.target.value.slice(0, e.target.maxLength);
                                    setScoreInputValue(e.target.value)
                                  }}
                                  max={`${bestScore}`}
                                  min="0" 
                                  maxLength={7}
                                  defaultValue={`${score}`}
                                ></input>}
                              </div>
                            </div>
                            <div className="hoverbox no-drag">
                              <div className="hoverbox-contents">
                              {
                                name.length > 13
                                ? 
                                  <div className="hoverbox-title" style={{width:`${name.length * 30}px`}}>
                                    <h5 className="width-50">{name}</h5>
                                    <h5 className="width-50">{name}</h5>
                                  </div>
                                : 
                                  <div className="hoverbox-title">
                                    <h5 className="animation-paused">{name}</h5>
                                  </div>
                              }
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>SCORE</td>
                                      <td>{score}</td>
                                    </tr>
                                    <tr>
                                      <td>곡 코드</td>
                                      <td>{id}</td>
                                    </tr>
                                    <tr>
                                      <td>노트 수</td>
                                      <td>{totalNote} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            { songTitleView && <p className="song-title">{name}</p> }
                          </div>
                        </div>
                        )
                    })
                  }
                  </div>
                </div>
              : null
            })
          }
          </div>
          {isMsgBoxVisible && 
          <div className="alert-box">
            <span className="alert-box-contents">{msg}</span>
          </div>
          }
        </div>
      </>
    )
  }

export default AchievementList