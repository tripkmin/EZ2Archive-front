/*eslint-disable*/

import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setAchievementKey, setAchievementDifficulty, switchModalOpen, setModalStep, setImgFindName, setSongInfo  } from "../store"
import defaultProfile from './../imagenone.webp'

const AchievementList = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {urlKey, urlDifficulty} = useParams()
  const {selectedKey, selectedKeyCaps, selectedDifficulty, selectedRank, selectedRankView, songTitleView, isDescending} = state.achievementUserSelected
  const [list, setList] = useState([])
  const AT = localStorage.getItem("accessToken")
  
  let levelIndex 
  if (isDescending){levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0],[-99]];}
  else {levelIndex = [[1,0],[3,2],[5,4],[7,6],[9,8],[-99]];}

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(()=>{
    dispatch(setAchievementKey(urlKey))
    dispatch(setAchievementDifficulty(urlDifficulty))  
  }, [])

  useEffect(()=>{
    const fetchData = async () => {
      try {
        let 그냥곡리스트 = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedDifficulty}/list`)
        let 성과리스트 = await axios.get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedDifficulty}/record`, {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        })
        let 최종적으로넣을거 = []
  
        그냥곡리스트 = 그냥곡리스트.data.data;
        성과리스트 = 성과리스트.data.data
        // 이런 테크닉도 있었구나...
        그냥곡리스트.forEach((곡) => {
          let 성과곡매치되는거 = 성과리스트.find(성과곡 => 성과곡.musicInfoId === 곡.id)
          if(성과곡매치되는거){
            let 리스트에넣을거 = {...곡, ...성과곡매치되는거}
            최종적으로넣을거.push(리스트에넣을거)
          } else {
            let mergeList = {...곡}
            최종적으로넣을거.push(mergeList)
          }
        })
        setList(최종적으로넣을거); 
      } catch (err) {
        console.log(err)
      }
    }
  
    if (selectedKey && selectedDifficulty) {
      fetchData();
    }
  }, [selectedKey, selectedDifficulty])


  // AchievementSelector에서 선택 완료 시
  // useEffect(()=>{
  //   if (selectedKey && selectedDifficulty) {
  //     let 그냥곡리스트
  //     axios
  //       .get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedDifficulty}/list`)
  //       .then((res) => {
  //         그냥곡리스트 = res.data.data; 
  //       })
  //       .then(
  //       axios
  //         .get(`${API_URL}/musicInfo/${selectedKeyCaps}/${selectedDifficulty}/record`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${AT}`
  //         }
  //       })
  //       .then((res)=>{
  //         const {data} = res.data
  //         let 최종적으로넣을거 = []

  //         그냥곡리스트.forEach((단일곡) => {
  //           let 아이디동일한거 = data.find(성과곡 => 성과곡.musicInfoId === 단일곡.id)
  //           if(아이디동일한거){
  //             let 리스트에넣을거 = {...단일곡, ...아이디동일한거}
  //             최종적으로넣을거.push(리스트에넣을거)
  //           } else {
  //             let mergeList = {...단일곡}
  //             최종적으로넣을거.push(mergeList)
  //           }
  //         })
  //         setList(최종적으로넣을거); 
  //       })
  //     )
  //     .catch((err) => {console.log(err)})
  //   }
  // }, [selectedKey, selectedDifficulty])

  const detailDifficultyFilter = (detailDifficulty) => {
    switch(detailDifficulty){
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
        return '미분류';
      default: 
        // nothing
    }
  }

  const returnClass = (songinfo) => {
    const { isAllCool, isNoMiss } = songinfo
    if (isAllCool) { return "all-cool" }
    else if (isNoMiss) { return "all-combo" }
    else if (isPlayed(songinfo)) { return "clear" }
    else { return "no-play" }
  }

  const matchFilter = (songinfo) => {
    const {grade} = songinfo
    const dbRank = ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F"]
    const gradeIndex = dbRank.indexOf(grade);
    const selectedRankIndex = dbRank.indexOf(selectedRank);

    if (selectedRankView === "동일" && selectedRank !== grade){return "disabled"} 
    else if (selectedRankView === "초과" && selectedRankIndex <= gradeIndex){return "disabled"}
    else if (selectedRankView === "이상" && selectedRankIndex < gradeIndex){return "disabled"}
    else if (selectedRankView === "이하" && selectedRankIndex > gradeIndex){return "disabled"}
    else if (selectedRankView === "미만" && selectedRankIndex >= gradeIndex){return "disabled"}
    else {return ""}
  }

  const isPlayed = (songinfo) => {
    const { score, percentage, recordId, grade } = songinfo
    // 미클리어시 percentage, recordId, score는 -1, grade는 ""로 나옴 
    // point는 60만점으로 기록하니 0으로 떠서 지웠음.
    if (percentage > 0 && recordId > 0 && score > 0 && grade){ return true }
    else { return false }
  }
  
  const handleImgError = (e) => {
    e.target.src = defaultProfile;
  }

  // 여기서 이제 songinfo를 dispatch해라고 코드 짜야함.
  const achievementModalOpen = (filteredElement, renamed) => {
    dispatch(switchModalOpen())
    dispatch(setModalStep(4))
    dispatch(setSongInfo(filteredElement))
    dispatch(setImgFindName(renamed))
  }

    return (
      <>
        <div className="orderlist-wrapper">
          <div className="header">
            <h1 className="theme-pp">{selectedKey.toUpperCase()} </h1>
            <h1>{selectedDifficulty}</h1>
          </div>
          {/* Songs 클래스 네임 변경할것 */}
          <div className="flex-grow-1">
          {/* 서열 9부터 0까지 내림차순으로 반환함 */}
          {
            levelIndex.map((detailDifficulty, index) => { 
              const copylist = [...list]
              // 서열값이 있는지 확인하고 있으면 JSX 출력, 없으면 null 뱉기
              return list.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).length !== 0
              ? <div className="order-box" key={index}>
                  <span className="order-grade">{detailDifficultyFilter(detailDifficulty[0])}</span>
                  <div className='order-list'>
                  {/* 특정 서열(ex:19.최상 → 19.9과 19.8)에 해당하는 곡명과 이미지들 전부 출력 */}
                  {/* 오름차순이 켜져있으면 난이도(EZ,NM,HD,SHD) > 이름 순으로 정렬해서 표시하도록 할 것. 내림차순이면 (SHD,HD,NM,EZ)*/}
                  {
                    copylist.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).sort((a,b)=>{
                      const x = a.difficulty;
                      const y = b.difficulty;
                      //내림차순이면 난이도 정렬 역시 내림차순으로 (SHD → EZ), 오름차순이면 (EZ → SHD)순으로 정렬.
                      if(isDescending === true){
                        // HD 정렬 먼저
                        if (x.length < y.length) return 1;
                        if (x.length > y.length) return -1;
                        // 그다음 EZ, NM, HD의 뒷 글자(Z, M, D)를 가지고 정렬
                        if (x.slice(x.length-1, x.length) > y.slice(y.length-1, y.length)) return 1;
                        if (x.slice(x.length-1, x.length) < y.slice(y.length-1, y.length)) return -1;
                      } else {
                        // SHD 정렬 먼저
                        if (x.length > y.length) return 1;
                        if (x.length < y.length) return -1;
                        // 그다음 EZ, NM, HD의 뒷 글자(Z, M, D)를 가지고 정렬
                        if (x.slice(x.length-1, x.length) < y.slice(y.length-1, y.length)) return 1;
                        if (x.slice(x.length-1, x.length) > y.slice(y.length-1, y.length)) return -1;
                      }
                    }).map((filteredElement, index)=>{
                      const {id, name, artist, keyType, difficulty, category, level, rank, bestScore, totalNote, bpm, addTime, description, recordId, grade, isAllCool, isNoMiss, score, percentage
                        // grade, percentage, score, musicInfoId, allCool, noMiss
                      } = filteredElement
                      const renamed = name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                      return (
                        <div className="song-wrapper" key={index}>
                          <div className="song-infobox">
                            <div className="imgbox no-drag" 
                            onMouseDown={()=>{
                              achievementModalOpen(filteredElement, renamed)
                            }}
                            >
                              <img  
                                src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed + '.webp'} 
                                // 아래는 에러 테스트용.
                                // src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed + '.web'} 
                                alt={name}
                                // onLoad={()=>{console.log("로드완료")}}
                                onError={handleImgError}
                                className={`${returnClass(filteredElement)} ${matchFilter(filteredElement)}`}
                              ></img>
                              <div className="shadowbox"></div>
                              <span className={`level-badge ${difficulty}`}>{difficulty}</span>
                              <div 
                                className={`test2 ${isPlayed(filteredElement) ? "" : "hidden"}`}
                              >
                                <img src={process.env.PUBLIC_URL + '/rankImg/'+ grade + '.png'} className="test3"></img>
                                <p className="test4">{Math.round(percentage * 10) / 10}%</p>
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
                              {
                                // artist.length > 24
                                // ? <div className="hoverbox-subtitle" style={{width:`${artist.length*20}px`}}>
                                //     <span className="width-50">{artist}</span>
                                //     <span className="width-50">{artist}</span>
                                //   </div>
                                // : <div className="hoverbox-subtitle">
                                //     <span className="animation-paused">{artist}</span>
                                //   </div>
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
                                    <tr>
                                      <td>ALL</td>
                                      <td>{isAllCool ? "Y" : "N"}/{isNoMiss ? "Y" : "N"}</td>
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