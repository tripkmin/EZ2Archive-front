/*eslint-disable*/

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../services/temp";
import { gradeConvert, keyCapsToNumKey, rankFilter, getPlayStatusClass, returnGrade, getPlayStatusText, renamed } from "../../utills/utill";
import { MyResponsiveLine } from "./chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faStarHalf, faStar, faPencil, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons"
import { setSongInfo, setSongList } from "../../store";
import { deleteHistory, deleteMemo, getUserAchievementData, getHistory, getMemo, postMemo, reIssue, postScore } from "../../utills/axios";


const AchievementDetail = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const AT = localStorage.getItem("accessToken")
  const {selectedKeyCaps, selectedLevel} = state.achievementUserSelected
  const {songList, songInfo, filteredElementIdx} = state.achievementSongInfo
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
    userRecordData
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
  const [chartData, setChartData] = useState([])
  const [addtimeHistory, setAddtimeHistory] = useState([])
  const [fetchedMemo, setFetchedMemo] = useState("")
  const [memoPlaceholder, setMemoPlaceholder] = useState("")
  const [tempMemo, setTempMemo] = useState("")
  const [isHistoryWrite, setIsHistoryWrite] = useState(false)
  const [isWriteAllCombo, setIsWriteAllCombo] = useState(false)
  const [isWriteAllCool, setIsWriteAllCool] = useState(false)
  const [scoreInputValue, setScoreInputValue] = useState(-1)
  const [memoSendComplete, setMemoSendComplete] = useState(false)
  const [memoDeleteComplete, setMemoDeleteComplete] = useState(false)
  const [버튼클릭수, set버튼클릭수] = useState(0)

  // userRecordData가 없다 === 아직 플레이 하지 않았다 === history 정보를 가져오지 않는다.
  useEffect(()=>{
    const setting = async () => {
      await getMemoProcess()
      if (userRecordData) {
        await setHistory()
      }
    }

    setting()
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

  useEffect(()=>{
    dispatch(setSongInfo(songList[filteredElementIdx]))
  }, [songList])

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

  useEffect(()=>{
    const newArray = []
    const addTimeHistoryArray = []

    for (let i = 0; i < achievementSongHistory.length; i++){
      var dateObj = new Date(achievementSongHistory[i].addTime)
      var year = dateObj.getFullYear().toString().slice(-2); // 년도의 마지막 2자리 추출
      var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // 월 (0부터 시작하므로 +1을 해줌)의 두 자리로 표시
      var day = ('0' + dateObj.getDate()).slice(-2); // 일의 두 자리로 표시
      var hour = ('0' + dateObj.getHours()).slice(-2); // 시의 두 자리로 표시
      var minute = ('0' + dateObj.getMinutes()).slice(-2); // 분의 두 자리로 표시
      var second = ('0' + dateObj.getSeconds()).slice(-2); // 초의 두 자리로 표시
      
      // 문자열 조합
      var str = year + '. ' + month + '. ' + day + ' ' + hour + ':' + minute + ':' + second;
      addTimeHistoryArray.push(str)
    }
  
    for(let i = achievementSongHistory.length - 1; i >= 0; i--){
      newArray.push({ x : addTimeHistoryArray[i], y : achievementSongHistory[i].percentage })
    }

    const newChartData = [
      {
      "id": "record",
      "color": "hsl(253, 100%, 93%)",
      "data": newArray
      }  
    ]
    setChartData(newChartData)
    setAddtimeHistory(addTimeHistoryArray)
  }, [achievementSongHistory])
  
  const setHistory = async () => {
    const historyData = await getHistory(id)
    try {
      setAchievementSongHistory(historyData)
    }
    catch {
      try {
        await reIssue()
        setAchievementSongHistory(historyData)
      } catch {
        // reIssue 에러 처리
      }
    }
  }

  // 선택한 곡에 기록한 메모를 요청 후 state에 저장
  const getMemoProcess = async () => {
    try {
      setFetchedMemo(await getMemo(id))
    }
    catch (error) {
      if (error.response.status === 404) {
        setMemoPlaceholder("아직 작성된 메모가 없습니다.");
      } else {
        try {
          await reIssue()
          setFetchedMemo(await getMemo(id))
        } catch {
        // reIssue 에러 처리
        }
      }
    }
  }

  const postScoreProcess = async () => {
    const postScoreAndReset = async () => {
      await postScore(id, isWriteAllCool, isWriteAllCombo, scoreInputValue)
      await getUserAchievementDataProcess()
      setIsHistoryWrite(false)
      setHistory()
    }
    try {
      postScoreAndReset()
    } catch {
      await reIssue()
      postScoreAndReset()
    }               
  }

  const memoBorder = () => {
    if (memoSendComplete){return "send-complete"}
    else if (memoDeleteComplete){return "delete-complete"}
    else { return ""}
  }

  const getUserAchievementDataProcess = async () => {
    const response = await getUserAchievementData(selectedKeyCaps, selectedLevel)
    try {
      dispatch(setSongList(response))
    } catch (error) {
      try {
        await reIssue()
        dispatch(setSongList(response))
      } catch (error) {
        // 에러처리 할 것
      }
    }
  }

  const deleteHistoryProcess = async (recordHistoryId) => {
    const deleteHistoryAndResetState = async () => {
      await deleteHistory(recordHistoryId)
      await getUserAchievementDataProcess()
      await setHistory()
    }

    try {
      deleteHistoryAndResetState()
    } catch (error) {
      try {
        await reIssue()
        deleteHistoryAndResetState()
      } catch (error) {
        // reIssue 에러 처리
      }
    }
  }

  const deleteMemoProcess = async (id) => {
    const deleteMemoAndReset = async () => {
      await deleteMemo(id);
      setMemoDeleteComplete(true);
      setTempMemo("");
    }
    
    try {
      await deleteMemoAndReset()
    } catch (error) {
      try {
        await reIssue()
        await deleteMemoAndReset()  
      } catch (error) {
        // reIssue 에러 처리
      }
    }
  }

  const postMemoProcess = async (id, tempMemo) => {
    const postMemoAndReset = async () => {
      await postMemo(id, tempMemo)
      setMemoSendComplete(true),
      setFetchedMemo("")
    }

    try {
      postMemoAndReset()
    } catch (error) {
      await reIssue()
      try {
        postMemoAndReset()
      } catch (error) {
        // reIssue 에러 처리
      }
    }
  }

  return (
    <div className="achievement-modal-wrapper">
      <div className="achievement-modal-info">
        <div className="achievement-modal-diskimg">
          <img  
            src={process.env.PUBLIC_URL + '/musicdisk/'+ renamed(name) + '.webp'} 
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
        defaultValue={fetchedMemo}
        placeholder={memoPlaceholder}
        onChange={(e)=>{setTempMemo(e.target.value);}}
      ></textarea>
      <div className="user-memo-btn-group">
        <button onClick={()=>{deleteMemoProcess(id)}}>{<FontAwesomeIcon icon={faTrash} />}</button>
        <button onClick={()=>{postMemoProcess(id, tempMemo)}}><FontAwesomeIcon icon={faPaperPlane} /></button>
      </div>
      {/* 임시차트용데이터가 [{id, color, data: [], [], [] ...}] 형태로 되어있음. */}
      {/* 임시차트용데이터가 아예 없을 수 있음. */}
          { chartData[0]?.data.length <= 1 && 
            <div className="no-visible-data">
              <h4>차트는 두 개 이상의 기록이 있을 때부터 보여집니다.</h4>
            </div>
          }
          { chartData[0]?.data.length > 1 && 
            <div className="linetest">
              <MyResponsiveLine data={chartData}/>
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
                    onClick={()=>{postScoreProcess()}}
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
                  <td>{addtimeHistory[i]}</td>
                  {/* <td></td> */}
                  <td>{el.score}</td>
                  <td>{scoreDifference[i]}</td>
                  <td>{gradeConvert(el.grade)}</td>
                  <td>{scoreToNextGrade[i]}</td>
                  <td>
                    <FontAwesomeIcon 
                      icon={faXmark} 
                      className="history-delete-btn" 
                      onClick={()=>{deleteHistoryProcess(el.recordHistoryId)}}
                    ></FontAwesomeIcon>
                  </td>
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