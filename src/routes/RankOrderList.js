import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { setKeyAndDifficulty } from './../store.js'
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

function RankOrderList(props){
  // 컴포넌트 로드 시 선택된 키, 난이도에 해당하는 자료들을 서버에서 가져와 list 변수에 할당.
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()
  let {selectedDifficulty} = useParams()
  let [list, setList] = useState([])
  let levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0]]
 
  /** RankOrderSelector에서 내림차순 On/Off시 참조할 Index를 변경함. */
  if (state.rankUserSelected.isDescending === true){
    levelIndex = [[9,8],[7,6],[5,4],[3,2],[1,0]];
  } else {
    levelIndex = [[1,0],[3,2],[5,4],[7,6],[9,8]];
  }

  // 컴포넌트가 처음 마운트되거나, store.js의 rankUserSelected(키, 난이도)가 업데이트 될 때 실행되는 함수.
  useEffect(()=>{
    /** Array 내용 중 선택한 difficulty 값에 해당하는 것만 반환해주는 함수 */
    function levelFilter(arr, difficulty){
      return arr.filter(el => el.level === difficulty)
    }
    /** 유저가 선택한 키 모드에 따라 AJAX 요청을 하기 위해 사용하는 함수 */
    function getUrl(key){
      return `http://ec2-15-165-162-69.ap-northeast-2.compute.amazonaws.com:54856/rank/list/${key}`
    }

    /** 유저가 RankOrderSelector에서 선택한 키 모드와 세부 난이도를 받아 서열 난이도 내림차순으로 걸러줌.*/
    switch(props.selectedKey) { 
      case '4k':
        axios.get(getUrl('FOUR'))
        .then((data)=>{
          let SelectedKeyFullSongList = data.data.data
          let filtered = levelFilter(SelectedKeyFullSongList, parseInt(selectedDifficulty)).sort(el => el.rank)
          setList(filtered)
        });
        break;
      case '5k':
        axios.get(getUrl('FIVE'))
        .then((data)=>{
          let SelectedKeyFullSongList = data.data.data
          let filtered = levelFilter(SelectedKeyFullSongList, parseInt(selectedDifficulty)).sort(el => el.rank)
          setList(filtered)
        })
        break;
      case '6k':
        axios.get(getUrl('SIX'))
        .then((data)=>{
          let SelectedKeyFullSongList = data.data.data
          let filtered = levelFilter(SelectedKeyFullSongList, parseInt(selectedDifficulty)).sort(el => el.rank)
          setList(filtered)
        })
        break;
      case '8k':
        axios.get(getUrl('EIGHT'))
        .then((data)=>{
          let SelectedKeyFullSongList = data.data.data
          let filtered = levelFilter(SelectedKeyFullSongList, parseInt(selectedDifficulty)).sort(el => el.rank)
          setList(filtered)
        })
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
  function detailDifficultyFilter(detailDifficulty){
    switch(detailDifficulty){
      case 0:
      case 1:
        return '하';
      case 2:
      case 3:
        return '중하';
      case 4:
      case 5:
        return '중';
      case 6:
      case 7:
        return '중상';
      case 8:
      case 9:
        return '최상';
      default: 
        // nothing
    }
  }

  return (
    <div className="rank-orderlist-wrapper">
      <div className="header">
        <h1 className="theme-pp">{props.selectedKey.toUpperCase()} </h1>
        <h1>{selectedDifficulty}</h1>
      </div>
      {/* Songs 클래스 네임 변경할것 */}
      <div>
      {/* 서열 9부터 0까지 내림차순으로 반환함 */}
      {
        levelIndex.map((detailDifficulty, index) => { 
          // 서열값이 있는지 확인하고 있으면 JSX 출력, 없으면 null 뱉기
          return list.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).length !== 0
          ?  
            <div className="order-box" key={index}>
              <span className="order-grade">{detailDifficultyFilter(detailDifficulty[0])}</span>
              <div className='order-list'>
              {/* 특정 서열(ex:19.최상 → 19.9과 19.8)에 해당하는 곡명과 이미지들 전부 출력 */}
              {
                list.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).map((el, index)=>{
                  let renamed = el.name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                  return (
                    <div className="song-wrapper" key={index}>
                      <div className="song-infobox">
                        <div className="imgbox">
                          <img src={process.env.PUBLIC_URL + '/musicdisk/'+ renamed + '.webp'} alt={el.name}></img>
                          {/* 스켈레톤 UI를 넣고 싶은데 어떻게 해야 할 지 모르겠음 <Skeleton width={"120px"} height={"120px"} circle={true} /> */}
                          <div className="shadowbox"></div>
                          <span className={`level-badge ${el.difficulty}`}>{el.difficulty}</span>
                        </div>
                        {
                          state.rankUserSelected.songTitleView === true
                          ? <p className="song-title">{el.name} </p> 
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
  )
}

export default RankOrderList