/*eslint-disable*/

import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setAchievementKey, setAchievementLevel, switchModalOpen, setModalStep, setImgFindName, setSongInfo  } from "../store"
import defaultProfile from './../imagenone.webp'
import { rankFilter, getPlayStatusClass, isPlayed, returnGrade, formatPercent } from "../utills/utill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons"

const AchievementList = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {urlKey, urlLevel} = useParams()
  const {selectedKey, selectedKeyCaps, selectedLevel, selectedRank, selectedRankView, songTitleView, isDescending} = state.achievementUserSelected
  const [data, setData] = useState([])
  const [스코어입력창선택한거, set스코어입력창선택한거] = useState([-1, -1])
  const [isAllCool, setIsAllCool] = useState(false)
  const [isAllCombo, setIsAllCombo] = useState(false)
  const [scoreInputValue, setScoreInputValue] = useState(-1)
  const [전송실패모달, set전송실패모달] = useState(false)
  const [전송완료모달, set전송완료모달] = useState(false)
  const AT = localStorage.getItem("accessToken")

  let rankIndex 
  if (isDescending){rankIndex = [[9,8],[7,6],[5,4],[3,2],[1,0],[-99]];}
  else {rankIndex = [[1,0],[3,2],[5,4],[7,6],[9,8],[-99]];}

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(()=>{
    dispatch(setAchievementKey(urlKey))
    dispatch(setAchievementLevel(urlLevel))  
  }, [])

  const fetchData = async () => {
    try {
      let songList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
      let recordList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/record`, {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })
      let songWithRecordData = []

      songList = songList.data.data;
      recordList = recordList.data.data
      songList.forEach((singleSong) => {
        let matchIdWithRecord = recordList.find(singleRecord => singleRecord.musicInfoId === singleSong.id)
        if(matchIdWithRecord){
          let combinedData = {...singleSong, ...matchIdWithRecord}
          songWithRecordData.push(combinedData)
        } else {
          let combinedData = {...singleSong}
          songWithRecordData.push(combinedData)
        }
      })
      setData(songWithRecordData); 
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    // const fetchData = async () => {
    //   try {
    //     let songList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/list`)
    //     let recordList = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedLevel}/record`, {
    //       headers: {
    //         Authorization: `Bearer ${AT}`
    //       }
    //     })
    //     let songWithRecordData = []

    //     songList = songList.data.data;
    //     recordList = recordList.data.data
    //     songList.forEach((singleSong) => {
    //       let matchIdWithRecord = recordList.find(singleRecord => singleRecord.musicInfoId === singleSong.id)
    //       if(matchIdWithRecord){
    //         let combinedData = {...singleSong, ...matchIdWithRecord}
    //         songWithRecordData.push(combinedData)
    //       } else {
    //         let combinedData = {...singleSong}
    //         songWithRecordData.push(combinedData)
    //       }
    //     })
    //     setData(songWithRecordData); 
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    if (selectedKey && selectedLevel) {
      fetchData();
    }
  }, [selectedKey, selectedLevel])

  useEffect(()=>{
    if(isAllCool){setIsAllCombo(true)}
  }, [isAllCool])

  const rankToDisplayRank = (rank) => {
    switch(rank){
      case 0:
      case 1:
        return '하';
      case 2:
      case 3:
        return '중하';
      case 4:
      case 5:
        return '중상';
      case 6:
      case 7:
        return '상';
      case 8:
      case 9:
        return '최상';
      case -99:
        return '-';
      default: 
        // nothing
    }
  }

  const matchFilter = (songinfo) => {
    const {grade} = songinfo
    const 찾기 = selectedRank.find(선택된등급 => 선택된등급 === grade)
    if (!찾기 && selectedRank.length !== 0){ return "disabled"}
  }

  const 보여지는퍼센트뒷쪽영빼기 = (퍼센트) => {
    const 스텝1 = parseFloat(퍼센트).toFixed(2)
    const 스텝1분리 = (num) => 스텝1.split(".")[num]
   
    if(!퍼센트){
      return "-"
    } else if(스텝1분리(1)?.charAt(스텝1분리(1).length - 1) === "0"){
      if(스텝1분리(1)?.charAt(스텝1분리(1).length - 2) === "0"){
        return 스텝1분리(0)
      } else {
        return 스텝1분리(0) + "." + 스텝1분리(1)[0]
      }
    } else {
      return 스텝1 
    }
  }

  const isPlayed = (songinfo) => {
    const { score, percentage, id, grade } = songinfo
    if (percentage > 0 && id > 0 && score > 0 && grade){ return true }
    else { return false }
  }
  
  const handleImgError = (e) => {
    e.target.src = defaultProfile;
  }

  const achievementModalOpen = (filteredElement, renamed) => {
    dispatch(switchModalOpen())
    dispatch(setModalStep(4))
    dispatch(setSongInfo(filteredElement))
    dispatch(setImgFindName(renamed))
  }

  /** 곡 리스트와 rankIndex 단일 요소를 넣으면 그 기준에 맞는 곡만 반환 */ 
  const filterByDifficultyIndex = (data, array) => {
    return data.filter(songlist => 
      songlist.rank === array[0] 
      || songlist.rank === array[1]
    )
  }
  
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
  
  /** 곡 리스트들을 난이도를 기준으로 정렬함. 내림차순, 오름차순 옵션이 반영됨. */
  const sortByDifficulty = (data) => {
    const sorted = data.sort((a, b) => {
      const x = getDifficultyScore(a.difficulty);
      const y = getDifficultyScore(b.difficulty);
      return isDescending ? y - x : x - y;
    })
    return sorted
  }
  
  const maxLengthCheck = (value) => {
    if(value.length > 7){
      value.slice(0, 7);
    }
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
            rankIndex.map((targetRank, index1) => { 
              return data.filter(songlist => 
                songlist.rank === targetRank[0] 
                || songlist.rank === targetRank[1]
                ).length !== 0
              ? 
                <div className="order-box" key={index1}>
                  <span className="order-grade">{rankToDisplayRank(targetRank[0])}</span>
                  <div className='order-list'>
                  {sortByDifficulty(filterByDifficultyIndex(data, targetRank))
                    .map((filteredElement, index2)=>{
                      const {
                        id,
                        name,
                        artist,
                        keyType,
                        difficulty,
                        category,
                        level,
                        rank,
                        bestScore,
                        totalNote,
                        bpm,
                        addTime,
                        description,
                        recordId,
                        grade,
                        isNoMiss,
                        score,
                        percentage
                      } = filteredElement
                      
                      const renamed = name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                      return (
                        <div className="song-wrapper" key={index2}>
                          <div className="song-infobox">
                            <div className="imgbox no-drag">
                              { 스코어입력창선택한거[0] === index1 && 
                                스코어입력창선택한거[1] === index2 && 
                                <div className="score-input-option-wrapper">
                                  <FontAwesomeIcon icon={faXmark} className="xmarkBtnCircle" onClick={()=>{set스코어입력창선택한거([-1, -1])}}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faCheck} className="checkBtnCircle" onClick={()=>{
                                    axios
                                      .post(`${API_URL}/record/save`,
                                        {
                                          "allCool": isAllCool,
                                          "musicInfoId": id,
                                          "noMiss": isAllCombo,
                                          "score": scoreInputValue
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${AT}`
                                          }
                                        },
                                      ).then(res => res.status >= 200 && res.status < 300 
                                        ? (set전송완료모달(true), set스코어입력창선택한거([-1, -1]), fetchData())
                                        // 소괄호와 콤마 연산자로 여러 줄 표시 가능
                                        : set전송실패모달(true) )
                                      .catch(error => console.log(error))
                                  }}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faStarHalf} className={`starHalfBtnCircle ${isAllCombo ? null : "no-checked"}`} onClick={()=>{setIsAllCombo(prev => !prev)}}></FontAwesomeIcon>
                                  <FontAwesomeIcon icon={faStar} className={`starBtnCircle ${isAllCool ? null : "no-checked"}`} onClick={()=>{setIsAllCool(prev => !prev)}}></FontAwesomeIcon>
                                </div>
                                }
                            <img  
                                src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed + '.webp'} 
                                alt={name}
                                onError={handleImgError}
                                className={`${getPlayStatusClass(filteredElement)} ${matchFilter(filteredElement)} small-border theme-pp-shadow`}
                                onClick={()=>{achievementModalOpen(filteredElement, renamed)}}
                              ></img>
                              <div 
                                className={`shadowbox ${matchFilter(filteredElement)}`}
                                onClick={()=>{achievementModalOpen(filteredElement, renamed)}}></div>
                              <span 
                                className={`level-badge ${difficulty}`} 
                                onClick={()=>{achievementModalOpen(filteredElement, renamed)}}
                              >{difficulty}</span>
                              <div 
                                className="test2"
                              >
                                <img 
                                  src={process.env.PUBLIC_URL + '/gradeImg/'+ returnGrade(grade) + '.png'} 
                                  className="test3"
                                ></img>
                                <p 
                                  className="test4"
                                  onClick={()=>{set스코어입력창선택한거([index1, index2])}}
                                  style={grade === "AP" ? {marginRight : "5px"} : null }
                                >{score ? (score / 10000).toFixed(2) : "-%"}
                                </p>
                                {
                                스코어입력창선택한거[0] === index1 && 
                                스코어입력창선택한거[1] === index2 && 
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
                                  <div className="hoverbox-title" style={{width:`${name.length*30}px`}}>
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
                            {
                              songTitleView === true
                              ? <p className="song-title">{name} </p> 
                              : null
                            }
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
        </div>
      </>
    )
  }

export default AchievementList