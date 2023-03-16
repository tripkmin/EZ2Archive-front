/*eslint-disable*/

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../services/temp";
import { setModalDefault } from "../../store";
import { gradeConvert, keyCapsToNumKey, rankFilter, getPlayStatusClass, isPlayed } from "../../utills/utill";
import { MyResponsiveLine } from "./chart";

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
    recordId,
    musicInfoId,
    grade,
    isAllCool,
    isNoMiss,
    score,
    percentage,
  } = state.achievementSongInfo.songInfo
  const [achievementSongHistory, setAchievementSongHistory] = useState([])
  const [차이, set차이] = useState([])
  const [다음등급, set다음등급] = useState([])
  const [임시차트용데이터, set임시차트용데이터] = useState([])
  const [수정된addtime, set수정된addtime] = useState([])
  useEffect(()=>{
    if(musicInfoId){
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
  }, [])
  
  useEffect(()=>{
    차이계산()
    다음등급계산()
  }, [achievementSongHistory])

  const 차이계산 = () => {
    const new차이 = []
    for(let i = 0; i < achievementSongHistory.length; i++){
      if(i < achievementSongHistory.length - 1){
        new차이.push(achievementSongHistory[i].score - achievementSongHistory[i + 1].score);
      } else {
        new차이.push("-")
      }
    }
    set차이(new차이)
  }

  const 다음등급계산 = () => {
    const new다음등급 = []
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
      new다음등급.push(remainNextGradeScore(achievementSongHistory[i].grade, achievementSongHistory[i].score))
    }
    set다음등급(new다음등급)
  }

  const 업적반환 = (songInfo) => {
    const {isAllCool, isNoMiss, recordId, grade, score, percentage} = songInfo
    if(isAllCool){return "All Cool"}
    else if(isNoMiss){return "All Combo"}
    else if(recordId && grade && score && percentage){return "Played"}
    else {return "Not Played"}
  }

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



  
  return (
    <div className="achievement-modal-wrapper">
      <div className="achievement-modal-info">
        <div className="achievement-modal-diskimg">
          <img  
            src={process.env.PUBLIC_URL + '/musicdisk/'+ imgFindName + '.webp'} 
            alt={name}
            className={` ${getPlayStatusClass(songInfo)} big-border`}
            // onError={handleImgError}
            // className={`${returnClass(filteredElement)} ${matchFilter(filteredElement)}`}
          //   onClick={achievementModalOpen}
          // style={{border: "2px solid yellow", backgroundColor:"yellow" , borderRadius: "50%"}}
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
                <h3>{level}</h3>
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
                      <td>{업적반환(songInfo)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                {/* <h5>Grade</h5> */}
                { grade 
                ? <img src={process.env.PUBLIC_URL + '/rankImg/'+ grade + '.png'} className="achievement-modal-song-grade"></img>
                : null
                }
              </div>
            </div>
          </div>
            {/* <div>{keyCapsToNumKey(keyType)}</div>
            <div>{level}</div>
            <div>{rankFilter(rank)}</div> */}
          {/* <h2>{name}</h2>
          <h5>{artist}</h5> */}
        </div>
      </div>
      <div className="linetest">
          { 임시차트용데이터.length === 0 
          ? null
          : <MyResponsiveLine data={임시차트용데이터}/>
          }
        </div>
      <table className="achievement-history-table">
        <thead>
          <tr>
            <td>기록 날짜</td>
            <td>점수</td>
            <td>상승폭</td>
            <td>등급</td>
            <td>다음 등급까지</td>
          </tr>
        </thead>
        <tbody>
          {achievementSongHistory.length === 0 ? (
            <tr>
              <td colSpan={5}>아직 기록된 정보가 없습니다.</td>
            </tr>
          ) : (
            achievementSongHistory.map((el, i) => {
              return (
                <tr key={i}>
                  <td>{수정된addtime[i]}</td>
                  <td>{el.score}</td>
                  <td>{차이[i]}</td>
                  <td>{gradeConvert(el.grade)}</td>
                  <td>{다음등급[i]}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* <form> */}
        <textarea></textarea>
        <button>전송</button>
      {/* </form> */}
    </div>
  )
}

export default AchievementDetail