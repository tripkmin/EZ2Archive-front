/*eslint-disable*/

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setRankKey, setRankLevel } from '../store.js';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import defaultProfile from './../imagenone.webp';
import { rankFilter, renamed } from '../utills/utill.js';
import { getRankList } from '../utills/axios.js';

// 컴포넌트 로드 시 선택된 키, 난이도에 해당하는 자료들을 서버에서 가져와 list 변수에 할당.
const RankOrderList = props => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { urlKey, urlLevel } = useParams();
  const [list, setList] = useState([]);
  const { selectedKey, selectedKeyCaps, selectedLevel, songTitleView, isDescending } =
    state.rankUserSelected;
  const [isAllSelected, setIsAllSelected] = useState(false);

  let rankIndex;

  /** RankOrderSelector에서 내림차순 On/Off시 참조할 Index를 변경함. */
  if (isDescending) {
    rankIndex = [[9, 8], [7, 6], [5, 4], [3, 2], [1, 0], [-99]];
  } else {
    rankIndex = [[1, 0], [3, 2], [5, 4], [7, 6], [9, 8], [-99]];
  }

  ////////// 초기 설정 //////////

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(() => {
    if (
      !['4k', '5k', '6k', '8k'].includes(urlKey) ||
      !(parseInt(urlLevel) >= 14 && parseInt(urlLevel) <= 20)
    ) {
      navigate('/404');
    }
  }, [urlKey, urlLevel]);

  useEffect(() => {
    dispatch(setRankKey(urlKey));
    dispatch(setRankLevel(urlLevel));
  }, []);

  ////////// 초기 설정이 완료되면 //////////

  // 키와 난이도가 전부 선택되었을 때 데이터 요청 실시에 참고하는 변수를 조작
  const checkLevel14 = () => {
    if (selectedKey !== '4k' && selectedLevel === 14) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkLevel14();

    if (selectedKey && selectedLevel) {
      setTimeout(() => {
        setIsAllSelected(true);
      }, 0);
    }
    return () => {
      setIsAllSelected(false);
    };
  }, [selectedKey, selectedLevel]);

  /* 
  만약 4키가 선택되면 dispatch
  
  */

  // 키와 난이도가 모두 선택되었다면 axios 요청을 전송함.
  useEffect(() => {
    const getSongList = async () => {
      if (isAllSelected) {
        const response = await getRankList(selectedKeyCaps, selectedLevel);
        setList(response);
      }
    };

    getSongList();
  }, [isAllSelected]);

  // 곡 리스트와 rankIndex 단일 요소를 넣으면 그 기준에 맞는 곡만 반환
  const filterByDifficultyIndex = (data, array) => {
    return data.filter(
      songlist => songlist.rank === array[0] || songlist.rank === array[1]
    );
  };

  // 곡 리스트들을 난이도를 기준으로 정렬함. 내림차순, 오름차순 옵션이 반영됨.
  const sortByDifficulty = data => {
    /** 난이도를 숫자화시켜 정렬할 수 있게 만들어줌 */
    const getDifficultyScore = difficulty => {
      switch (difficulty) {
        case 'EZ':
          return 1;
        case 'NM':
          return 2;
        case 'HD':
          return 3;
        case 'SHD':
          return 4;
        default:
          return 0;
      }
    };
    const sorted = data.sort((a, b) => {
      const x = getDifficultyScore(a.difficulty);
      const y = getDifficultyScore(b.difficulty);
      return isDescending ? y - x : x - y;
    });
    return sorted;
  };

  const handleImgError = e => {
    e.target.src = defaultProfile;
  };

  return (
    <>
      <div
        className={`pleaseWait ${checkLevel14() ? 'pleaseWait-alert-background' : ''}`}
      >
        {checkLevel14() ? (
          <p>
            <strong>{selectedKey.toUpperCase()}</strong>의
            <strong> 레벨 {selectedLevel}</strong>는 아직 지원하지 않고 있습니다.
          </p>
        ) : (
          <p>
            본 서열표는 <strong>S⁺ 달성</strong>을 기준으로 매겨진 서열입니다.
          </p>
        )}
      </div>
      <div className="orderlist-wrapper">
        <div className="header">
          <h1 className="theme-pp">{selectedKey.toUpperCase()} </h1>
          <h1>{selectedLevel}</h1>
        </div>
        <div className="flex-grow-1">
          {rankIndex.map((targetRank, rowIdx) => {
            return list.filter(
              songlist =>
                songlist.rank === targetRank[0] || songlist.rank === targetRank[1]
            ).length !== 0 ? (
              <div className="order-box" key={rowIdx}>
                <span className="order-grade">{rankFilter(targetRank[0])}</span>
                <div className="order-list">
                  {/* {sortByDifficulty(filterByDifficultyIndex(userAchievementData, targetRank)) */}
                  {sortByDifficulty(filterByDifficultyIndex(list, targetRank)).map(
                    (filteredElement, columnIdx) => {
                      const {
                        artist,
                        bestScore,
                        bpm,
                        category,
                        description,
                        difficulty,
                        id,
                        keyType,
                        level,
                        name,
                        rank,
                        totalNote,
                        userRecordData,
                        // userRecordData가 없을 경우에는 기본값으로 빈 객체를 줌
                      } = filteredElement;
                      return (
                        <div className="song-wrapper" key={columnIdx}>
                          <div className="song-infobox">
                            <div className="imgbox no-drag">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  '/musicdiskResize/' +
                                  renamed(name) +
                                  '.webp'
                                }
                                alt={name}
                                onError={handleImgError}
                              ></img>
                              <div className="shadowbox"></div>
                              <span className={`level-badge ${difficulty}`}>
                                {difficulty}
                              </span>
                            </div>
                            <div className="hoverbox no-drag">
                              <div className="hoverbox-contents">
                                {name.length > 13 ? (
                                  <div
                                    className="hoverbox-title"
                                    style={{ width: `${name.length * 30}px` }}
                                  >
                                    <h5 className="width-50">{name}</h5>
                                    <h5 className="width-50">{name}</h5>
                                  </div>
                                ) : (
                                  <div className="hoverbox-title">
                                    <h5 className="animation-paused">{name}</h5>
                                  </div>
                                )}
                                {artist.length > 24 ? (
                                  <div
                                    className="hoverbox-subtitle"
                                    style={{
                                      width: `${artist.length * 20}px`,
                                    }}
                                  >
                                    <span className="width-50">{artist}</span>
                                    <span className="width-50">{artist}</span>
                                  </div>
                                ) : (
                                  <div className="hoverbox-subtitle">
                                    <span className="animation-paused">{artist}</span>
                                  </div>
                                )}
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>NOTES</td>
                                      <td>{totalNote}</td>
                                    </tr>
                                    <tr>
                                      <td>BPM</td>
                                      <td>{bpm}</td>
                                    </tr>
                                    <tr>
                                      <td>CATEGORY</td>
                                      <td>{category} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            {songTitleView && <p className="song-title">{name}</p>}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default RankOrderList;
