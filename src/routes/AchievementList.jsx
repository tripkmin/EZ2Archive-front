/*eslint-disable*/

import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../services/temp';
import {
  setAchievementKey,
  setAchievementLevel,
  switchModalOpen,
  setModalStep,
  setSongInfo,
  setSongList,
  setFilteredElementIdx,
  setUserDefault,
} from '../store';
import defaultProfile from './../imagenone.webp';
import { getPlayStatusClass, returnGrade, rankFilter, renamed } from '../utills/utill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faStarHalf, faStar } from '@fortawesome/free-solid-svg-icons';
import {
  getUserAchievementData,
  postScore,
  reIssue,
  refreshTokenExpired,
} from '../utills/axios';
import { flushSync } from 'react-dom';

const AchievementList = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { urlKey, urlLevel } = useParams();
  const {
    selectedKey,
    selectedKeyCaps,
    selectedLevel,
    selectedGrade,
    songTitleView,
    isDescending,
  } = state.achievementUserSelected;
  const { songList, filteredElementIdx } = state.achievementSongInfo;
  const { isLoginTried, userName, userId, userAuth, userAddTime } = state.userinfo;
  const [isLogined, setIsLogined] = useState(true);
  const [selectedScoreInput, setSelectedScoreInput] = useState([-1, -1]);
  const [isWriteAllCool, setIsWriteAllCool] = useState(false);
  const [isWriteAllCombo, setIsWriteAllCombo] = useState(false);
  const [scoreInputValue, setScoreInputValue] = useState(-1);
  const [isAllSelected, setIsAllSelected] = useState(false);
  // const [filteredElementIdx, setFilteredElementIdx] = useState(-1)
  const [msg, setMsg] = useState('');
  const [isMsgBoxVisible, setIsMsgBoxVisible] = useState(false);
  const [isScorePostSuccess, setIsScorePostSuccess] = useState(false);
  const [alertboxAnimation, setAlertboxAnimation] = useState('');
  const AT = localStorage.getItem('accessToken');

  let rankIndex;
  if (isDescending) {
    rankIndex = [[9, 8], [7, 6], [5, 4], [3, 2], [1, 0], [-99]];
  } else {
    rankIndex = [[1, 0], [3, 2], [5, 4], [7, 6], [9, 8], [-99]];
  }

  ////////// 초기 설정 //////////

  // URL 직접 접근 시 해당 키/난이도를 바로 조회하도록 설정
  useEffect(() => {
    dispatch(setAchievementKey(urlKey));
    dispatch(setAchievementLevel(urlLevel));
  }, []);

  // 빠른 수기 입력 선택 index를 초기화 함.
  useEffect(() => {
    setSelectedScoreInput([-1, -1]);
  }, [urlKey, urlLevel]);

  // store의 userInfo를 참조하여 값이 있으면 login 했다고 판단
  useEffect(() => {
    if (userName && userId && userAuth && userAddTime) {
      setIsLogined(true);
    } else {
      setIsLogined(false);
    }
  }, [userName, userId, userAuth, userAddTime]);

  ////////// 초기 설정이 완료되면 //////////

  // 키와 난이도가 전부 선택되었을 때 데이터 요청 실시에 참고하는 변수를 조작
  useEffect(() => {
    if (selectedKey && selectedLevel) {
      setTimeout(() => {
        setIsAllSelected(true);
      }, 0);
    }
    return () => {
      setIsAllSelected(false);
    };
  }, [selectedKey, selectedLevel]);

  // 키와 난이도가 모두 선택되었다면 axios 요청을 전송함.
  useEffect(() => {
    if (isAllSelected) {
      getUserAchievementDataProcess();
    }
  }, [isAllSelected, isLogined]);

  const getUserAchievementDataProcess = async () => {
    try {
      const response = await getUserAchievementData(selectedKeyCaps, selectedLevel);
      dispatch(setSongList(response));
    } catch (error) {
      try {
        await reIssue();
        const responseAfterReIssue = await getUserAchievementData(
          selectedKeyCaps,
          selectedLevel
        );
        dispatch(setSongList(responseAfterReIssue));
      } catch (error) {
        refreshTokenExpired();
        navigate('/');
        dispatch(setUserDefault());
      }
    }
  };

  // 빠른 수기 입력이나 모달창 내부에서 곡의 정보가 변할 경우 모달창 내부로 전송되는 songInfo도 변화
  useEffect(() => {
    dispatch(setSongInfo(songList[filteredElementIdx]));
  }, [songList]);

  ////////// 우측 하단 팝업창 관련 //////////

  // 애니메이션 관련
  useEffect(() => {
    let animationTimer;
    if (isMsgBoxVisible) {
      animationTimer = setTimeout(() => {
        setAlertboxAnimation('alert-box-show');
      }, 1);
    }
    return () => {
      clearTimeout(animationTimer);
      setAlertboxAnimation('');
    };
  }, [isMsgBoxVisible]);

  // 하단 팝업창이 보일 경우 3초간의 showTime
  useEffect(() => {
    let alertOpen;

    if (isMsgBoxVisible) {
      alertOpen = setTimeout(() => {
        setIsMsgBoxVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(alertOpen);
    };
  }, [isMsgBoxVisible]);

  ////////// 간편 수기 입력 관련 //////////

  // 리스트 간편 수기 입력창에서 All Cool이 켜지면 All Combo가 자동으로 켜지게 함
  useEffect(() => {
    if (isWriteAllCool) {
      setIsWriteAllCombo(true);
    }
  }, [isWriteAllCool]);

  // 리스트 간편 수기 입력창에서 All Combo가 꺼지면 All Cool이 자동으로 꺼지게 함
  useEffect(() => {
    if (!isWriteAllCombo) {
      setIsWriteAllCool(false);
    }
  }, [isWriteAllCombo]);

  // AchievementSelector에서 선택된 Grade를 제외한 나머지는 반투명하게 함.
  const matchFilter = songinfo => {
    if (songinfo.userRecordData) {
      const { grade } = songinfo.userRecordData;
      const matchGrade = selectedGrade.find(selectedGrade => selectedGrade === grade);
      if (!matchGrade && selectedGrade.length !== 0) {
        return 'disabled';
      }
    }
  };

  // 수기 입력 전송 프로세스
  const postScoreProcess = async id => {
    const postScoreAndRefresh = async () => {
      await postScore(id, isWriteAllCool, isWriteAllCombo, scoreInputValue);
      await getUserAchievementDataProcess();
      setSelectedScoreInput([-1, -1]);
      getUserAchievementDataProcess();
    };
    try {
      await postScoreAndRefresh();
      flushSync(() => {
        setIsMsgBoxVisible(false);
        setIsScorePostSuccess(false);
      });
      flushSync(() => {
        setIsMsgBoxVisible(true);
        setIsScorePostSuccess(true);
      });
      setMsg('저장이 완료되었습니다');
    } catch (error) {
      if (error.response.status === 400) {
        flushSync(() => {
          setIsMsgBoxVisible(false);
          setIsScorePostSuccess(false);
        });
        flushSync(() => {
          setIsMsgBoxVisible(true);
          setIsScorePostSuccess(false);
        });
        setMsg(error.response.data.message);
      } else {
        try {
          await reIssue();
          await postScoreAndRefresh();
        } catch (error) {
          refreshTokenExpired();
          navigate('/');
          dispatch(setUserDefault());
        }
      }
    }
  };

  // 이미지가 없을 경우 기본 이미지로 나오도록 함
  const handleImgError = e => {
    e.target.src = defaultProfile;
  };

  // 디스크를 클릭할 경우 모달을 열고 모달창 내부에 리스트 정보를 전송함.
  const achievementModalOpen = filteredElement => {
    dispatch(switchModalOpen());
    dispatch(setModalStep(4));
    dispatch(setSongInfo(filteredElement));
    dispatch(
      setFilteredElementIdx(songList.findIndex(el => el.id === filteredElement.id))
    );
  };

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

  return isLoginTried && userName && userId && userAuth && userAddTime ? (
    <div className="orderlist-wrapper">
      <div className="header">
        <h1 className="theme-pp">{selectedKey.toUpperCase()} </h1>
        <h1>{selectedLevel}</h1>
      </div>
      {/* Songs 클래스 네임 변경할것 */}
      <div className="flex-grow-1">
        {rankIndex.map((targetRank, rowIdx) => {
          return songList.filter(
            songlist => songlist.rank === targetRank[0] || songlist.rank === targetRank[1]
          ).length !== 0 ? (
            <div className="order-box" key={rowIdx}>
              <span className="order-grade">{rankFilter(targetRank[0])}</span>
              <div className="order-list">
                {/* {sortByDifficulty(filterByDifficultyIndex(userAchievementData, targetRank)) */}
                {sortByDifficulty(filterByDifficultyIndex(songList, targetRank)).map(
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
                    const { recordId, grade, isAllCool, isNoMiss, score, percentage } =
                      userRecordData;
                    return (
                      <div className="song-wrapper" key={columnIdx}>
                        <div className="song-infobox">
                          <div className="imgbox no-drag pointer">
                            {selectedScoreInput[0] === rowIdx &&
                              selectedScoreInput[1] === columnIdx && (
                                <div className="score-input-option-wrapper">
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    className="xmarkBtnCircle"
                                    onClick={() => {
                                      setSelectedScoreInput([-1, -1]);
                                    }}
                                  ></FontAwesomeIcon>
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="checkBtnCircle"
                                    onClick={() => {
                                      postScoreProcess(id);
                                    }}
                                  ></FontAwesomeIcon>
                                  <FontAwesomeIcon
                                    icon={faStarHalf}
                                    className={`starHalfBtnCircle ${
                                      isWriteAllCombo ? null : 'no-checked'
                                    }`}
                                    onClick={() => {
                                      setIsWriteAllCombo(prev => !prev);
                                    }}
                                  ></FontAwesomeIcon>
                                  <FontAwesomeIcon
                                    icon={faStar}
                                    className={`starBtnCircle ${
                                      isWriteAllCool ? null : 'no-checked'
                                    }`}
                                    onClick={() => {
                                      setIsWriteAllCool(prev => !prev);
                                    }}
                                  ></FontAwesomeIcon>
                                </div>
                              )}
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/musicdiskResize/' +
                                renamed(name) +
                                '.webp'
                              }
                              alt={name}
                              onError={handleImgError}
                              className={`${getPlayStatusClass(
                                filteredElement
                              )} ${matchFilter(
                                filteredElement
                              )} small-border theme-pp-shadow`}
                              onClick={() => {
                                achievementModalOpen(filteredElement);
                              }}
                            ></img>
                            <div
                              className={`shadowbox ${matchFilter(filteredElement)}`}
                              onClick={() => {
                                achievementModalOpen(filteredElement);
                              }}
                            ></div>
                            <span
                              className={`level-badge ${difficulty}`}
                              onClick={() => {
                                achievementModalOpen(filteredElement);
                              }}
                            >
                              {difficulty}
                            </span>
                            <div className="user-score-container">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  '/gradeImg/' +
                                  returnGrade(grade) +
                                  '.png'
                                }
                                onClick={() => {
                                  achievementModalOpen(filteredElement);
                                }}
                              ></img>
                              <p
                                onClick={() => {
                                  setSelectedScoreInput([rowIdx, columnIdx]);
                                }}
                                // A+ 이미지 간격이 안 맞아서 우측 마진 조금 더 줌.
                                style={grade === 'AP' ? { marginRight: '5px' } : null}
                              >
                                {score ? (Math.floor(score / 100) / 100).toFixed(2) : '-'}
                              </p>
                              {selectedScoreInput[0] === rowIdx &&
                                selectedScoreInput[1] === columnIdx && (
                                  <input
                                    type="number"
                                    name="score"
                                    step="1000"
                                    onInput={e => {
                                      if (e.target.value.length > e.target.maxLength)
                                        e.target.value = e.target.value.slice(
                                          0,
                                          e.target.maxLength
                                        );
                                      setScoreInputValue(e.target.value);
                                    }}
                                    max={`${bestScore}`}
                                    min="0"
                                    maxLength={7}
                                    defaultValue={`${score}`}
                                  ></input>
                                )}
                            </div>
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
      {isMsgBoxVisible && (
        <div className={`alert-box ${alertboxAnimation}`}>
          {isScorePostSuccess ? (
            <svg
              width="35px"
              height="35px"
              viewBox="0 0 133 133"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                className="check-group"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <circle
                  className="filled-circle"
                  fill="#5cb85c"
                  cx="66.5"
                  cy="66.5"
                  r="54.5"
                />
                <circle
                  className="white-circle"
                  fill="#FFFFFF"
                  cx="66.5"
                  cy="66.5"
                  r="55.5"
                />
                <circle
                  className="outline"
                  stroke="#5cb85c"
                  strokeWidth="4"
                  cx="66.5"
                  cy="66.5"
                  r="54.5"
                />
                <polyline
                  className="check"
                  stroke="#FFFFFF"
                  strokeWidth="5.5"
                  points="41 70 56 85 92 49"
                />
              </g>
            </svg>
          ) : (
            <svg
              width="35px"
              height="35px"
              viewBox="0 0 133 133"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                className="xmark-group"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <circle
                  className="filled-circle"
                  fill="#e53935"
                  cx="66.5"
                  cy="66.5"
                  r="54.5"
                />
                <circle
                  className="white-circle"
                  fill="#FFFFFF"
                  cx="66.5"
                  cy="66.5"
                  r="55.5"
                />
                <circle
                  className="outline"
                  stroke="#e53935"
                  strokeWidth="4"
                  cx="66.5"
                  cy="66.5"
                  r="54.5"
                />
                <polyline
                  className="check"
                  stroke="#FFFFFF"
                  strokeWidth="5.5"
                  points="41 68 92 68"
                />
              </g>
            </svg>
          )}
          <span className="alert-box-contents">{msg}</span>
        </div>
      )}
    </div>
  ) : (
    <div className="pleaseSelectBox">
      <img
        src={process.env.PUBLIC_URL + '/source/pleaseLogin.png'}
        alt="PleaseSelectAchievement"
      ></img>
      <h3>로그인이 필요합니다!</h3>
      <h5>좋은 말할 때 로그인하십쇼</h5>
    </div>
  );
};

export default AchievementList;
