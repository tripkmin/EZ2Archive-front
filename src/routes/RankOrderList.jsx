/*eslint-disable*/

import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { setRankKeyAndLevel } from '../store.js'
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import defaultProfile from './../imagenone.webp'
import { API_URL } from "../services/temp";

// 컴포넌트 로드 시 선택된 키, 난이도에 해당하는 자료들을 서버에서 가져와 list 변수에 할당.
const RankOrderList = (props) => {
  const state = useSelector( (state) => state )
  const dispatch = useDispatch()
  const {urlLevel} = useParams()
  const [list, setList] = useState([])
  let rankIndex 

  /** RankOrderSelector에서 내림차순 On/Off시 참조할 Index를 변경함. */
  if (state.rankUserSelected.isDescending){rankIndex = [[9,8],[7,6],[5,4],[3,2],[1,0],[-99]];}
  else {rankIndex = [[1,0],[3,2],[5,4],[7,6],[9,8],[-99]];}

  /** 유저가 URL로 직접 접근시 대응 */
  useEffect(()=>{
    const getAndSetSongs = (key) => {
      axios
        // .get(`${API_URL}/rank/list/${key}/${urlLevel}`)
        .get(`${API_URL}/musicInfo/${key}/${urlLevel}/list`)
        .then((res) => { return setList(res.data.data) })
        .catch((err) => { console.log(err) })
    }
    switch(props.selectedKey) { 
      case '4k': getAndSetSongs("FOUR"); break;
      case '5k': getAndSetSongs("FIVE"); break;
      case '6k': getAndSetSongs("SIX"); break;
      case '8k': getAndSetSongs("EIGHT"); break;
      default: // nothing
    }
    dispatch(setRankKeyAndLevel({key: props.selectedKey, level: parseInt(urlLevel)}))
  }, [state.rankUserSelected.selectedLevel, state.rankUserSelected.selectedKey])

  // 은근 재사용 많이 하는 함수라 utills로 뺐음. 나중에 지장없으면 삭제할 것.
  const rankFilter = (rank) => {
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

  const handleImgError = (e) => {
    e.target.src = defaultProfile;
  }

  return (
    <>
      <div className="pleaseWait">
        <p>본 서열표는 <strong>S⁺ 달성</strong>을 기준으로 매겨진 서열입니다.</p>
      </div>
      <div className="orderlist-wrapper">
        <div className="header">
          <h1 className="theme-pp">{props.selectedKey.toUpperCase()} </h1>
          <h1>{urlLevel}</h1>
        </div>
        {/* Songs 클래스 네임 변경할것 */}
        <div className="flex-grow-1">
        {/* 서열 9부터 0까지 내림차순으로 반환함 */}
        {
          rankIndex.map((targetRank, index) => { 
            const copylist = [...list]
            // 서열값이 있는지 확인하고 있으면 JSX 출력, 없으면 null 뱉기
            return list.filter(songlist => songlist.rank === targetRank[0] || songlist.rank === targetRank[1]).length !== 0
            ? <div className="order-box" key={index}>
                <span className="order-grade">{rankFilter(targetRank[0])}</span>
                <div className='order-list'>
                {/* 특정 서열(ex:19.최상 → 19.9과 19.8)에 해당하는 곡명과 이미지들 전부 출력 */}
                {/* 오름차순이 켜져있으면 난이도(EZ,NM,HD,SHD) > 이름 순으로 정렬해서 표시하도록 할 것. 내림차순이면 (SHD,HD,NM,EZ)*/}
                {
                  copylist.filter(songlist => songlist.rank === targetRank[0] || songlist.rank === targetRank[1]).sort((a,b)=>{
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
                              alt={filteredElement.name} 
                              onError={handleImgError}></img>
                            <div className="shadowbox"></div>
                            <span className={`level-badge ${filteredElement.difficulty}`}>{filteredElement.difficulty}</span>
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
                              filteredElement.artist.length > 24
                              ? <div className="hoverbox-subtitle" style={{width:`${filteredElement.artist.length*20}px`}}>
                                  <span className="width-50">{filteredElement.artist}</span>
                                  <span className="width-50">{filteredElement.artist}</span>
                                </div>
                              : <div className="hoverbox-subtitle">
                                  <span className="animation-paused">{filteredElement.artist}</span>
                                </div>
                            }
                              <table>
                                <tbody>
                                  <tr>
                                    <td>NOTES</td>
                                    <td>{filteredElement.totalNote}</td>
                                  </tr>
                                  <tr>
                                    <td>BPM</td>
                                    <td>{filteredElement.bpm}</td>
                                  </tr>
                                  <tr>
                                    <td>CATEGORY</td>
                                    <td>{filteredElement.category}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {
                            state.rankUserSelected.songTitleView === true
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

export default RankOrderList