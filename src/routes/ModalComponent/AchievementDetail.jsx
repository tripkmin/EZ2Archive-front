/*eslint-disable*/

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../services/temp";
import { setModalDefault } from "../../store";
import { MyResponsiveLine } from "./chart";

const AchievementDetail = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {songName, songId, songDifficulty, imgFindName} = state.achievementSongInfo
  const [achievementSongHistory, setAchievementSongHistory] = useState([])

  
  const testdata = [
    {
      "addTime": "2023-03-12T05:31:33.104Z",
      "allCool": true,
      "grade": "SPPP",
      "id": 964,
      "noMiss": true,
      "percentage": 99.87699890136719,
      "score": 1100000
    },
    {
      "addTime": "2023-03-10T05:31:33.104Z",
      "allCool": false,
      "grade": "SPP",
      "id": 925,
      "noMiss": true,
      "percentage": 97.97100067138672,
      "score": 1080000
    },
    {
      "addTime": "2023-03-02T05:31:33.104Z",
      "allCool": false,
      "grade": "SP",
      "id": 910,
      "noMiss": false,
      "percentage": 94.41300201416016,
      "score": 1040000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
    {
      "addTime": "테스트용",
      "allCool": false,
      "grade": "F",
      "id": 123,
      "noMiss": false,
      "percentage": 52.34567890123456,
      "score": 500000
    },
  ] 

  // 서버 안정화 전까지는 봉인해두자.
  // useEffect(()=>{
  //   const {musicInfoId} = state.achievementSongInfo
  //   axios
  //     .get(`${API_URL}/achievement/${musicInfoId}/history`)
  //     .then((res)=>{
  //       const {data} = res.data
  //       setAchievementSongDetail((prevState)=>{
  //         [...data]
  //       })
  //     })
  // }, [])
  const [차이, set차이] = useState([])

  const 차이계산 = () => {
    const new차이 = []
    for(let i = 0; i < achievementSongHistory.length; i++){
      if(i < achievementSongHistory.length - 1){
        new차이.push(achievementSongHistory[i].score - achievementSongHistory[i + 1].score);
      } else {
        new차이.push("시작")
      }
    }
    set차이(new차이)
  }

  // const 차이계산 = () => {
  //   if(achievementSongHistory.length > 1){
  //     const new차이 = []
  //     for(let i = 0; i < achievementSongHistory.length - 1; i++){
  //       new차이.push(achievementSongHistory[i].score - achievementSongHistory[i + 1].score);
  //     }
  //     set차이(new차이)
  //   }
  // }

  useEffect(()=>{
    setAchievementSongHistory(testdata)
  }, [])

  useEffect(()=>{
    차이계산()
  }, [achievementSongHistory])

  return (
    <div className="achievement-detail-wrapper">
      <div className="achievement-detail-info">
        <img  
          src={process.env.PUBLIC_URL + '/musicdisk/'+ imgFindName + '.webp'} 
          alt="beyond"
          // onLoad={()=>{console.log("로드완료")}}
          // onError={handleImgError}
          // className={`${returnClass(filteredElement)} ${matchFilter(filteredElement)}`}
          // onClick={achievementModalOpen}
        // style={{border: "2px solid yellow", backgroundColor:"yellow" , borderRadius: "50%"}}
        ></img>
        <h3>{songName}, {songId}, {songDifficulty}</h3>
      </div>
      <MyResponsiveLine />

      <table>
        <thead>
          <tr>
            <td>날짜</td>
            <td>랭크</td>
            <td>점수</td>
            <td>상승폭</td>
            <td>다음 랭크까지 얼마나?</td>
          </tr>
        </thead>
        <tbody>
          {
            achievementSongHistory.map((el, i)=>{
              return (
                <tr key={i}>
                  <td>{el.addTime}</td>
                  <td>{el.grade}</td>
                  <td>{el.score}</td>
                  <td>{차이[i]}</td>
                  <td>아직 미구현</td>
                </tr>
              )
            })
          }
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