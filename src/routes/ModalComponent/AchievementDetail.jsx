/*eslint-disable*/

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../services/temp";
import { gradeConvert, keyCapsToNumKey, rankFilter, getPlayStatusClass, returnGrade, getPlayStatusText } from "../../utills/utill";
import { MyResponsiveLine } from "./chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faStarHalf, faStar, faPencil, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons"

const AchievementDetail = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const AT = localStorage.getItem("accessToken")
  const {songInfo} = state.achievementSongInfo
  const {imgFindName} = state.achievementSongInfo
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
    userRecordData = {}
  } = state.achievementSongInfo.songInfo
  const {
    recordId,
    musicInfoId,
    grade,
    isAllCool,
    isNoMiss,
    score,
    percentage
  } = userRecordData
  const [achievementSongHistory, setAchievementSongHistory] = useState([])
  const [scoreDifference, setScoreDifference] = useState([])
  const [scoreToNextGrade, setScoreToNextGrade] = useState([])
  const [임시차트용데이터, set임시차트용데이터] = useState([])
  const [수정된addtime, set수정된addtime] = useState([])
  const [memo, setMemo] = useState("")
  const [memoPlaceholder, setMemoPlaceholder] = useState("")
  const [tempMemo, setTempMemo] = useState("")
  const [isHistoryWrite, setIsHistoryWrite] = useState(false)
  const [isWriteAllCombo, setIsWriteAllCombo] = useState(false)
  const [isWriteAllCool, setIsWriteAllCool] = useState(false)
  const [scoreInputValue, setScoreInputValue] = useState(-1)
  const [memoSendComplete, setMemoSendComplete] = useState(false)
  const [memoDeleteComplete, setMemoDeleteComplete] = useState(false)
  // 처음 컴포넌트가 로드된 후, 
  useEffect(()=>{
    if(userRecordData){
      getHistory()
    }
  }, [])
  
  useEffect(()=>{
    getMemo()
  }, [])

  useEffect(()=>{
    calculateScoreDifference()
    calculateNextGrade()
  }, [achievementSongHistory])

  // 리스트 간편 수기 입력창에서 All Cool이 켜지면 All Combo가 자동으로 켜지게 함
  useEffect(()=>{
    if(isWriteAllCool){setIsWriteAllCombo(true)}
  }, [isWriteAllCool])

  // 리스트 간편 수기 입력창에서 All Combo가 꺼지면 All Cool이 자동으로 꺼지게 함
  useEffect(()=>{
    if(!isWriteAllCombo){setIsWriteAllCool(false)}
  }, [isWriteAllCombo])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMemoSendComplete(false);
      setMemoDeleteComplete(false);
    }, 500);

    timeoutId
    return () => {
      clearTimeout(timeoutId);
    };
  }, [memoSendComplete, memoDeleteComplete]);

  const calculateScoreDifference = () => {
    const newDifference = []
    for(let i = 0; i < achievementSongHistory.length; i++){
      if(i < achievementSongHistory.length - 1){
        newDifference.push(achievementSongHistory[i].score - achievementSongHistory[i + 1].score);
      } else {
        newDifference.push("-")
      }
    }
    setScoreDifference(newDifference)
  }

  const calculateNextGrade = () => {
    const newNextGrade = []
    const remainNextGradeScore = (grade, currentScore) => {
      switch(grade){
        case "SPPP":
          return "-"
        case "SPP":
          return 1090000 - currentScore;
        case "SP":
          return 1050000 - currentScore;
        case "S":
          return 1025000 - currentScore;
        case "AP":
          return 1000000 - currentScore;
        case "A":
          return 950000 - currentScore;
        case "B":
          return 900000 - currentScore;
        case "C":
          return 850000 - currentScore;
        case "D":
          return 750000 - currentScore;
        case "E":
          return 650000 - currentScore;
        case "F":
          return 550000 - currentScore;
        default: 
          // nothing
      }
    } 
    for(let i = 0; i < achievementSongHistory.length; i++){
      newNextGrade.push(remainNextGradeScore(achievementSongHistory[i].grade, achievementSongHistory[i].score))
    }
    setScoreToNextGrade(newNextGrade)
  }

  // const returnStatus = (songInfo) => {
  //   const {isAllCool, isNoMiss, recordId, grade, score, percentage} = songInfo
  //   if(isAllCool){return "All Cool"}
  //   else if(isNoMiss){return "All Combo"}
  //   else if(recordId && grade && score && percentage){return "Played"}
  //   else {return "Not Played"}
  // }

  // 컴포넌트 로드때부터 바로 실행되도록 useMemo나 다른 기술 사용할 것.
  // 배열의 가장 마지막부터 x는 addTime으로, y는 percentage로
  useEffect(()=>{
    const 임시배열 = []
    const addTime가공 = []

    for (let i = 0; i < achievementSongHistory.length; i++){
      var dateObj = new Date(achievementSongHistory[i].addTime)
      var year = dateObj.getFullYear().toString().substr(-2); // 년도의 마지막 2자리 추출
      var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // 월 (0부터 시작하므로 +1을 해줌)의 두 자리로 표시
      var day = ('0' + dateObj.getDate()).slice(-2); // 일의 두 자리로 표시
      var hour = ('0' + dateObj.getHours()).slice(-2); // 시의 두 자리로 표시
      var minute = ('0' + dateObj.getMinutes()).slice(-2); // 분의 두 자리로 표시
      var second = ('0' + dateObj.getSeconds()).slice(-2); // 초의 두 자리로 표시
      
      // 문자열 조합
      var str = year + '. ' + month + '. ' + day + ' ' + hour + ':' + minute + ':' + second;
      addTime가공.push(str)
    }
  
    for(let i = achievementSongHistory.length - 1; i >= 0; i--){
      임시배열.push({ x : addTime가공[i], y : achievementSongHistory[i].percentage })
    }

    const test = [
      {
      "id": "기록",
      "color": "hsl(253, 100%, 93%)",
      "data": 임시배열
      }  
    ]
    set임시차트용데이터(test)
    set수정된addtime(addTime가공)
  }, [achievementSongHistory])
  
  // 선택한 곡에 기록한 히스토리를 모두 요청 후 state에 저장
  const getHistory = () => {
    axios
      .get(`${API_URL}/musicInfo/${musicInfoId}/history`, {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })
      .then((res)=>{
        const {data} = res.data
        setAchievementSongHistory(data)
      })
  }
  
  // 선택한 곡에 기록한 메모를 요청 후 state에 저장
  const getMemo = async () => {
    try {
      let memo = await axios.get(`${API_URL}/musicInfo/${id}/memo`, {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })

      memo = memo.data.data.content
      setMemo(memo)
    }
    catch (err) {
      if (err.response && err.response.status === 404) {
        setMemoPlaceholder("아직 작성된 메모가 없습니다.");
      }
    }
  }

  const write = () => {
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
          setIsHistoryWrite(false)
          getHistory()
        }
      })
      .catch(error => console.log(error))                   
  }

  const memoBorder = () => {
    if (memoSendComplete){return "testborder"}
    else if (memoDeleteComplete){return "testborder2"}
    else { return ""}
  }

  return (
    <div className="achievement-modal-wrapper">
      <div className="achievement-modal-info">
        <div className="achievement-modal-diskimg">
          <img  
            src={process.env.PUBLIC_URL + '/musicdisk/'+ imgFindName + '.webp'} 
            alt={name}
            className={` ${getPlayStatusClass(songInfo)} big-border`}
            // onError={handleImgError}
          ></img>
          <span 
            className={`level-badge-lg ${difficulty}`} 
          >{difficulty}</span>
        </div>
        <div className="achievement-modal">
          <div className="achievement-modal-song-info">
            <div className="achievement-modal-song-header">
              <div className="achievement-modal-song-header-left">
                <h3 className="theme-pp">{name}</h3>
                <h5>{artist}</h5>
              </div>
              <div className="achievement-modal-song-header-right">
                <div><h3 className="theme-pp">{keyCapsToNumKey(keyType)}</h3><h3>{level}</h3></div>
                <h5>{rankFilter(rank)}</h5>
              </div>
            </div>
            <div className="achievement-modal-user-info">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td className="theme-pp">TOTAL NOTES</td>
                      <td>{totalNote}</td>
                    </tr>
                    <tr>
                      <td className="theme-pp">BEST RATE</td>
                      <td>{percentage ? `${percentage.toFixed(2)}%` : "-"}</td>
                    </tr>
                    <tr>
                      <td className="theme-pp">BEST SCORE</td>
                      <td>{score ? score : "-"}</td>
                    </tr>
                    <tr>
                      <td className="theme-pp">STATUS</td>
                      <td>{getPlayStatusText(songInfo)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <img src={process.env.PUBLIC_URL + '/gradeImg/'+ returnGrade(grade) + '.png'} className={`achievement-modal-song-grade ${returnGrade(grade)}`}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <textarea 
        className={`${memoBorder()}`}
        maxLength={255} 
        defaultValue={memo}
        placeholder={memoPlaceholder}
        onChange={(e)=>{setTempMemo(e.target.value);}}
      ></textarea>
      <div className="user-memo-btn-group">
        <button onClick={()=>{
          axios
          .post(`${API_URL}/musicInfo/${musicInfoId}/memo/save`, {
            content: tempMemo
          }, {
            headers: {
              Authorization: `Bearer ${AT}`
            },
            })
            .then(res => res.status >= 200 && res.status < 300 && 
              setMemoDeleteComplete(true),
              setTempMemo("")
              )
              .catch(err => console.log(err))
          }}><FontAwesomeIcon icon={faTrash} /></button>
        <button onClick={()=>{
          axios
            .post(`${API_URL}/musicInfo/${musicInfoId}/memo/save`, {
              content: tempMemo
            }, {
              headers: {
                Authorization: `Bearer ${AT}`
              },
            })
            .then(res => res.status >= 200 && res.status < 300 && 
              setMemoSendComplete(true),
              setMemo("")
            )
            // 여기 체크
            .catch(err => err.response.status === 404 ? console.log("없음") : null)
        }}><FontAwesomeIcon icon={faPaperPlane} /></button>
      </div>
      {/* 임시차트용데이터가 [{id, color, data: [], [], [] ...}] 형태로 되어있음. */}
      {/* 임시차트용데이터가 아예 없을 수 있음. */}
          { 임시차트용데이터[0]?.data.length <= 1 && 
            <div className="no-visible-data">
              <h4>차트는 두 개 이상의 기록이 있을 때부터 보여집니다.</h4>
            </div>
          }
          { 임시차트용데이터[0]?.data.length > 1 && 
            <div className="linetest">
              <MyResponsiveLine data={임시차트용데이터}/>
            </div>
          }
      <table className="achievement-history-table">
        <thead>
          <tr>
            <td>기록 날짜</td>
            {/* <td></td> */}
            <td>점수</td>
            <td>증감폭</td>
            <td>등급</td>
            <td>다음 등급까지</td>
            <td>삭제</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              isHistoryWrite && 
              <>
                <td colSpan={4} className="achievement-history-input-wrapper"> 
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
                ></input>  
                </td>
                <td colSpan={2} className="achievement-modal-history-write-btn">
                  <FontAwesomeIcon 
                    icon={faXmark} 
                    className="xmarkBtnCircle" 
                    onClick={()=>{setIsHistoryWrite(false)}}
                    ></FontAwesomeIcon>
                  <FontAwesomeIcon 
                    icon={faCheck} 
                    className="checkBtnCircle" 
                    onClick={()=>{write()}}
                    ></FontAwesomeIcon>
                  <FontAwesomeIcon 
                    icon={faStarHalf} 
                    className={`starHalfBtnCircle ${isWriteAllCombo ? null : "no-checked"}`} 
                    onClick={()=>{setIsWriteAllCombo(prev => !prev)}}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon 
                    icon={faStar} 
                    className={`starBtnCircle ${isWriteAllCool ? null : "no-checked"}`} 
                    onClick={()=>{setIsWriteAllCool(prev => !prev)}}
                  ></FontAwesomeIcon>
                </td>
              </>
            }
            {
              !isHistoryWrite &&
              <td className="achievement-modal-history-write" colSpan={6}><button onClick={()=>{setIsHistoryWrite(prev => !prev)}}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon> 기록하기</button></td>
            }
          </tr>
          {achievementSongHistory.length === 0 ? (
            <tr>
              <td colSpan={6}>아직 기록된 정보가 없습니다.</td>
            </tr>
          ) : (
            achievementSongHistory.map((el, i) => {
              return (
                <tr key={i}>
                  <td>{수정된addtime[i]}</td>
                  {/* <td></td> */}
                  <td>{el.score}</td>
                  <td>{scoreDifference[i]}</td>
                  <td>{gradeConvert(el.grade)}</td>
                  <td>{scoreToNextGrade[i]}</td>
                  <td><FontAwesomeIcon icon={faXmark} className="history-delete-btn" onClick={()=>{
                    axios
                      .delete(`${API_URL}/record/${el.recordHistoryId}/delete`, {
                        headers: {
                          Authorization: `Bearer ${AT}`
                        }
                      })
                      .then(res => getHistory())
                      .catch(err => console.log(err))
                  }}></FontAwesomeIcon></td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>  
    </div>
  )
}

export default AchievementDetail