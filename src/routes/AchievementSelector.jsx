/*eslint-disable*/

import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setAchievementKey, setAchievementDifficulty, setAchievementClean } from "../store"

const AchievementSelector = () => {

  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [totalSongs, setTotalSongs] = useState()
  const [overall, setOverall] = useState([
    { allCoolCnt: 0, name: "ALL COOL" },
    { noMissCnt: 0, name: "NO MISS"},
    { rateAvg: 0, name: "AVERAGE RATE"},
    { spCnt: 0, name: "S+"},
    { sppCnt: 0, name: "S++"},
    { spppCnt: 0, name: "S+++"},
    { totalCnt: 0, name: "TOTAL COUNT" },
  ])

  const [asdf, setasdf] = useState(["a", "b"])

  // 임시 영역
  const data1 = 25
  const data2 = 20
  const data3 = 36
  const data4 = 34
  const data5 = 38
  const data6 = 40 
  const barLength = 300

  const array1 = [
   { contents : data1, },
   { contents : data2,  },
   { contents : data3,  },
   { contents : data4, },
   { contents : data5, },
   { contents : data6, }] 
  const array2 = ["FOUR", "FIVE", "SIX", "EIGHT"]
  const array3 = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
  ]
  // 임시 영역 끝

  // let qwer = () => {
  //   let copy = [...asdf];
  //   copy[0] = "b"
  //   setasdf(copy)
  //   console.log(asdf)
  // }
  
  // qwer()

  // useEffect(()=>{
  //   const selectedKey = state.achievementUserSelected.selectedKey
  //   const selectedDifficulty = state.achievementUserSelected.selectedDifficulty
  //   const AT = localStorage.getItem("accessToken")
  //   if (selectedKey && selectedDifficulty) {
  //     axios
  //       .get(`${API_URL}/achievement/${selectedKey}/${selectedDifficulty}/overall`, {
  //       // .get(`${API_URL}/achievement/${selectedKey}/${selectedDifficulty}/list`, {
  //         headers: {
  //           Authorization: `Bearer ${AT}`
  //         }
  //       })
  //       .then((res) => {
  //         let copy = [...overall]
  //         res.data.data
  //         copy = { allCoolCnt, noMissCnt, rateAvg, spCnt, sppCnt, spppCnt, totalCnt }
  //         setOverall(
            
  //         )
  //       })
  //   }
  // }, [state.achievementUserSelected.selectedKey, state.achievementUserSelected.selectedDifficulty])

  useEffect(()=>{
    return () => {
      console.log("언마운트됨")
      // 언마운트시 STATE 초기화 함수를 여기다가 적을 것.
    };
  }, [])

  const test = () => {
    axios
      // .get(`${API_URL}/rank/list/${key}/${selectedDifficulty}`)
      .get(`${API_URL}/rank/list/FIVE/18`)
      .then((res) => {
        setTotalSongs(res.data.data.length)
        })
      .catch((err) => { console.log(err) })
  }

  test()

  const keySelect = (key) => {
    dispatch( setAchievementKey(key) )
  }

  const difficultySelect = (difficulty) => {
    dispatch( setAchievementDifficulty(difficulty) )
  }

  return (
    <div className="achievement-selector-wrapper">
      <div className="achievement-selector">
        <div className="achievement-userinfo">
          <div className="achievement-key-level">
            <h1 className="theme-pp">5K</h1>
            <h4>18</h4>
          </div>
          <h4>USER NAME</h4>
        </div>
        <div className="achievement-detail">
          <h3 className="theme-pp">OVERALL</h3>
            <table>
              <tbody>
              {
                  array1.map((el, i) => {
                    return (
                      <tr key={i}>
                        <td>{ (el.contents / totalSongs) * 100}%</td>
                        <td>{ el.contents + "/" + totalSongs }</td>
                        {/* <td>{ el.name }</td> */}
                        <td>
                          <div className="behind-bar theme-pp-shadow">
                            <div className="bar" style={{width: `${barLength * (el.contents / totalSongs)}px`}}></div>
                            <span>{el.name}</span>
                            {/* <span>{ (el.contents / totalSongs) * 100}%</span> */}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                } 
              </tbody>
            </table>
        </div>
        <div className="achievement-filter">
          <h3 className="theme-pp">FILTER</h3>
          <div className="achievement-filter-key-title">
            <h4 className="theme-pp">KEY</h4>
          </div>
          <div className="achievement-filter-key">
            <span>4K</span>
            <span>5K</span>
            <span>6K</span>
            <span>8K</span>
          </div>
          <div className="achievement-filter-level-title">
            <h4 className="theme-pp">LEVEL</h4>
          </div>
          <div className="achievement-filter-level">
            <span>1~10</span>
            <span>11</span>
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span>15</span>
          </div>
          <div className="achievement-filter-level">
            <span>16</span>
            <span>17</span>
            <span>18</span>
            <span>19</span>
            <span>20</span>
          </div>
        </div>
    </div>
    <div>
      {
        array2.map((el, i) => {
          return (
            <span key={i} onClick={()=>{dispatch(setAchievementKey(el))}} style={{marginRight : "10px"}}>{el}</span>
          )
        })
      }
      {
        array3.map((el, i) => {
          return (
            <span key={i} onClick={()=>{dispatch(setAchievementDifficulty(el))}} style={{marginRight : "10px"}}>{el}</span>
          )
        })
      }
      
    </div>
   </div>
  )
}

export default AchievementSelector