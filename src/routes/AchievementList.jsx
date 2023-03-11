/*eslint-disable*/
import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { API_URL } from "../services/temp";
import { setAchievementKey, setAchievementDifficulty, setAchievementClean } from "../store"
import defaultProfile from './../imagenone.webp'

const AchievementList = () => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {urlKey, urlDifficulty} = useParams()
  const {selectedKey, selectedKeyCaps, selectedDifficulty, selectedRank, selectedRankView} = state.achievementUserSelected
  const [list, setList] = useState([])
  const AT = localStorage.getItem("accessToken")
  
  let levelIndex 
  if (state.achievementUserSelected.isDescending){levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0]];}
  else {levelIndex = [[1,0],[3,2],[5,4],[7,6],[9,8]];}

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(()=>{
    dispatch(setAchievementKey(urlKey))
    dispatch(setAchievementDifficulty(urlDifficulty))  
  }, [])

  // AchievementSelector에서 선택 완료 시
  useEffect(()=>{
    if (selectedKey && selectedDifficulty) {
      axios
        .get(`${API_URL}/achievement/${selectedKeyCaps}/${selectedDifficulty}/list`,
        {
          headers: {
            Authorization: `Bearer ${AT}`
          }
        })
      .then((res) => setList(res.data.data))
      // .then(console.log(list))
      .catch((err) => { console.log(err) })
    }
  }, [selectedKey, selectedDifficulty])

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
      default: 
        // nothing
    }
  }

  const returnClass = (songinfo) => {
    const { allCool, noMiss } = songinfo
    if (allCool) { return "all-cool" }
    else if (noMiss) { return "all-combo" }
    else if (isPlayed(songinfo)) { return "clear" }
    else { return "no-play" }
  }

  const matchFilter = (songinfo) => {
    const {grade} = songinfo
    const dbRank = ["SPPP","SPP","SP","S","AP","A","B","C","D","E","F"]
    const gradeIndex = dbRank.indexOf(grade);
    const selectedRankIndex = dbRank.indexOf(selectedRank);

    if (selectedRankView === "동일" && selectedRank !== grade){return "disabled"} 
    if (selectedRankView === "초과" && selectedRankIndex <= gradeIndex){return "disabled"}
    if (selectedRankView === "이상" && selectedRankIndex < gradeIndex){return "disabled"}
    if (selectedRankView === "이하" && selectedRankIndex > gradeIndex){return "disabled"}
    if (selectedRankView === "미만" && selectedRankIndex >= gradeIndex){return "disabled"}
    if (selectedRankView === "해제"){return ""}
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
                      if(state.rankUserSelected.isDescending === true){
                        // SHD 정렬 먼저
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
                      const renamed = filteredElement.name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                      return (
                        <div className="song-wrapper" key={index}>
                          <div className="song-infobox">
                            <div className="imgbox no-drag">
                              <img  
                                src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed + '.webp'} 
                                // 아래는 에러 테스트용.
                                // src={process.env.PUBLIC_URL + '/musicdiskResize/'+ renamed + '.web'} 
                                alt={filteredElement.name}
                                onLoad={()=>{console.log("로드완료")}}
                                onError={handleImgError}
                                className={`${returnClass(filteredElement)} ${matchFilter(filteredElement)}`}
                              // style={{border: "2px solid yellow", backgroundColor:"yellow" , borderRadius: "50%"}}
                              ></img>
                              <div className="shadowbox"></div>
                              <span className={`level-badge ${filteredElement.difficulty}`}>{filteredElement.difficulty}</span>
                              {/* <img src={process.env.PUBLIC_URL + '/rankImg/'+ filteredElement.grade + '.png'} className="testing"></img> */}
                              <div 
                                className={`test2 ${isPlayed(filteredElement) ? "" : "hidden"}`}
                              >
                                <img src={process.env.PUBLIC_URL + '/rankImg/'+ filteredElement.grade + '.png'} className="test3"></img>
                                {/* <div className="test3"></div> */}
                                <p className="test4">{Math.round(filteredElement.percentage * 10) / 10}%</p>
                              </div>
                            </div>
                            <div className="hoverbox no-drag">
                              <div className="hoverbox-contents">
                              {
                                filteredElement.name.length > 13
                                ? 
                                  <div className="hoverbox-title" style={{width:`${filteredElement.name.length*30}px`}}>
                                    <h5 className="width-50">{filteredElement.name}</h5>
                                    <h5 className="width-50">{filteredElement.name}</h5>
                                  </div>
                                : 
                                  <div className="hoverbox-title">
                                    <h5 className="animation-paused">{filteredElement.name}</h5>
                                  </div>
                              }
                              {
                                // filteredElement.artist.length > 24
                                // ? <div className="hoverbox-subtitle" style={{width:`${filteredElement.artist.length*20}px`}}>
                                //     <span className="width-50">{filteredElement.artist}</span>
                                //     <span className="width-50">{filteredElement.artist}</span>
                                //   </div>
                                // : <div className="hoverbox-subtitle">
                                //     <span className="animation-paused">{filteredElement.artist}</span>
                                //   </div>
                              }
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>SCORE</td>
                                      <td>{filteredElement.score}</td>
                                    </tr>
                                    {/* <tr>
                                      <td>RATE</td>
                                      <td>{Math.round(filteredElement.percentage * 10) / 10}</td>
                                    </tr> */}
                                    <tr>
                                      <td>곡 코드</td>
                                      <td>{filteredElement.musicInfoId}</td>
                                    </tr>
                                    <tr>
                                      <td>곡 랭크</td>
                                      <td>{filteredElement.grade} </td>
                                    </tr>
                                    <tr>
                                      <td>ALL</td>
                                      <td>{filteredElement.allCool ? "Y" : "N"}/{filteredElement.noMiss ? "Y" : "N"}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            {
                              state.achievementUserSelected.songTitleView === true
                              ? <p className="song-title">{filteredElement.name} </p> 
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