/*eslint-disable*/

import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { setKeyAndDifficulty } from './../store.js'
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import defaultProfile from './../imagenone.webp'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

// 컴포넌트 로드 시 선택된 키, 난이도에 해당하는 자료들을 서버에서 가져와 list 변수에 할당.
function RankOrderList(props){
  let {selectedDifficulty} = useParams()
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()
  let [list, setList] = useState([])
  let levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0]]
 
  /** RankOrderSelector에서 내림차순 On/Off시 참조할 Index를 변경함. */
  if (state.rankUserSelected.isDescending){
    levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0]];
  } else {
    levelIndex = [[1,0],[3,2],[5,4],[7,6],[9,8]];
  }

  // 컴포넌트가 처음 마운트되거나, store.js의 rankUserSelected(키, 난이도)가 업데이트 될 때 실행
  useEffect(()=>{
    /** Array 내용 중 선택한 difficulty 값에 해당하는 것만 반환 */
    const levelFilter = (arr, difficulty) => {
      return arr.filter(el => el.level === difficulty)
    }
    /** 유저가 선택한 키 모드에 따라 AJAX 요청을 하기 위해 사용 */
    const getUrl = (key) => {
      return `http://ec2-15-165-162-69.ap-northeast-2.compute.amazonaws.com:54856/rank/list/${key}`
    }

    const getAndSetData = (data) => {
      let SelectedKeyFullSongList = data.data.data
      let filtered = levelFilter(SelectedKeyFullSongList, parseInt(selectedDifficulty)).sort(el => el.rank)
      setList(filtered)
    }

    switch(props.selectedKey) { 
      case '4k':
        axios.get(getUrl('FOUR'))
        .then((data) => {getAndSetData(data)})
        // .catch(console.log("데이터 불러오기 실패"))
        break;
      case '5k':
        axios.get(getUrl('FIVE'))
        .then((data) => {getAndSetData(data)})
        // .catch(console.log("데이터 불러오기 실패"))
        break;
      case '6k':
        axios.get(getUrl('SIX'))
        .then((data) => {getAndSetData(data)})
        // .catch(console.log("데이터 불러오기 실패"))
        break;
      case '8k':
        axios.get(getUrl('EIGHT'))
        .then((data) => {getAndSetData(data)})
        // .catch(console.log("데이터 불러오기 실패"))
        break; 
      default: 
      // nothing
    }

    /** 
     * 유저가 RankOrderSelector 컴포넌트를 통해 접근하는 게 아니라 URL로 직접 접근하는 경우를 대비해 만듬. 
     * 현재 키는 App.js에서 전송된 props, 난이도는 useParams로 받아 조회할 수 있도록 함. */
    dispatch(setKeyAndDifficulty({key: props.selectedKey, difficulty: parseInt(selectedDifficulty)}))
  }, [state.rankUserSelected.selectedDifficulty, state.rankUserSelected.selectedKey])

  /** 서열 난이도의 단계를 받아 하 ~ 최상으로 반환해주는 함수 */
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

/** 이미지 소스를 불러올 수 없을 경우 기본 설정 이미지 출력 */
const handleImgError = (e) => {
	e.target.src = defaultProfile;
}

  return (
    <>
    {/* 임시 영역 */}
      <div className="pleaseWait">
        <p><strong>5, 6, 8키</strong>의 <strong>레벨 16</strong>곡들은 서열 투표를 진행할 예정입니다.</p>
      </div>
    {/* 임시 영역 끝 */}

      <div className="rank-orderlist-wrapper">
        <div className="header">
          <h1 className="theme-pp">{props.selectedKey.toUpperCase()} </h1>
          <h1>{selectedDifficulty}</h1>
        </div>
        {/* Songs 클래스 네임 변경할것 */}
        <div className="flex-grow-1">
        {/* 서열 9부터 0까지 내림차순으로 반환함 */}
        {
          levelIndex.map((detailDifficulty, index) => { 
            let copylist = [...list]
            // 서열값이 있는지 확인하고 있으면 JSX 출력, 없으면 null 뱉기
            return list.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).length !== 0
            ? <div className="order-box" key={index}>
                <span className="order-grade">{detailDifficultyFilter(detailDifficulty[0])}</span>
                <div className='order-list'>
                {/* 특정 서열(ex:19.최상 → 19.9과 19.8)에 해당하는 곡명과 이미지들 전부 출력 */}
                {/* 오름차순이 켜져있으면 난이도(EZ,NM,HD,SHD) > 이름 순으로 정렬해서 표시하도록 할 것. 내림차순이면 (SHD,HD,NM,EZ)*/}
                {
                  copylist.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).sort((a,b)=>{
                    let x = a.difficulty;
                    let y = b.difficulty;
                    // RankOrderSelector에서 내림차순 옵션이면 난이도 정렬 역시 내림차순으로 (SHD → EZ), 오름차순이면 (EZ → SHD)순으로 정렬함.
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
                    let renamed = filteredElement.name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                    return (
                      <div className="song-wrapper" key={index}>
                        <div className="song-infobox">
                          <div className="imgbox no-drag">
                            <img src={process.env.PUBLIC_URL + '/musicdisk/'+ renamed + '.webp'} alt={filteredElement.name} onError={handleImgError}></img>
                            <div className="shadowbox"></div>
                            {/* <span className="rating-badge HD"><FontAwesomeIcon icon={faExclamation}/></span> */}
                            <span className={`level-badge ${filteredElement.difficulty}`}>{filteredElement.difficulty}</span>
                          </div>
                          <div className="testing no-drag">
                            <div className="testing-contents">
                            {
                              filteredElement.name.length > 13
                              ? 
                                <div className="testing-title" style={{width:`${filteredElement.name.length*30}px`}}>
                                  <h5 className="width-50">{filteredElement.name}</h5>
                                  <h5 className="width-50">{filteredElement.name}</h5>
                                </div>
                              : 
                                <div className="testing-title">
                                  <h5 className="animation-paused">{filteredElement.name}</h5>
                                </div>
                            }
                            {
                              filteredElement.artist.length > 24
                              ? <div className="testing-artist" style={{width:`${filteredElement.artist.length*20}px`}}>
                                  <span className="width-50">{filteredElement.artist}</span>
                                  <span className="width-50">{filteredElement.artist}</span>
                                </div>
                              : <div className="testing-artist">
                                  <span className="animation-paused">{filteredElement.artist}</span>
                                </div>
                            }
                            {/* <span>{filteredElement.artist}</span> */}
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

      {/* 테스트 영역 */}

    </>
  )
}

export default RankOrderList