/*eslint-disable*/

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  gradeConvert,
  keyCapsToNumKey,
  rankFilter,
  getPlayStatusClass,
  returnGrade,
  getPlayStatusText,
  renamed,
} from '../../utills/utill';
import { MyResponsiveLine } from './chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faXmark,
  faStarHalf,
  faStar,
  faPencil,
  faPaperPlane,
  faTrash,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { setSongInfo, setSongList, setUserDefault } from '../../store';
import {
  deleteHistory,
  deleteMemo,
  getUserAchievementData,
  getHistory,
  getMemo,
  postMemo,
  reIssue,
  postScore,
  refreshTokenExpired,
} from '../../utills/axios';

const AchievementDetail = () => {
  const navigate = useNavigate();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { selectedKeyCaps, selectedLevel } = state.achievementUserSelected;
  const { songList, songInfo, filteredElementIdx } = state.achievementSongInfo;
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
    userRecordData,
  } = state.achievementSongInfo.songInfo;
  const { recordId, musicInfoId, grade, isAllCool, isNoMiss, score, percentage } =
    userRecordData;
  const [msg, setMsg] = useState('');
  const [isMsgBoxVisible, setIsMsgBoxVisible] = useState(false);
  const [isScorePostSuccess, setIsScorePostSuccess] = useState(false);
  const [alertboxAnimation, setAlertboxAnimation] = useState('');
  const [achievementSongHistory, setAchievementSongHistory] = useState([]);
  const [scoreDifference, setScoreDifference] = useState([]);
  const [scoreToNextGrade, setScoreToNextGrade] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [addtimeHistory, setAddtimeHistory] = useState([]);
  const [tempMemo, setTempMemo] = useState('');
  const [isHistoryWrite, setIsHistoryWrite] = useState(false);
  const [isWriteAllCombo, setIsWriteAllCombo] = useState(false);
  const [isWriteAllCool, setIsWriteAllCool] = useState(false);
  const [scoreInputValue, setScoreInputValue] = useState(-1);
  const [memoSendComplete, setMemoSendComplete] = useState(false);
  const [memoDeleteComplete, setMemoDeleteComplete] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [confirmAnimation, setConfirmAnimation] = useState('');
  const clickRef = useRef();

  ////////// 초기 설정 관련 //////////
  // userRecordData가 없다 === 아직 플레이 하지 않았다 === history 정보를 가져오지 않는다.
  useEffect(() => {
    const setting = async () => {
      await getMemoProcess();
      if (userRecordData) {
        await setHistory();
      }
    };
    setting();
  }, []);

  // 성과 입력으로 인해 songList가 갱신될 때 현재 선택된 곡의 정보를 state에 저장.
  // 그 state 정보를 바탕으로 리스트에서 바로 정보를 가지고 옴.
  useEffect(() => {
    dispatch(setSongInfo(songList[filteredElementIdx]));
  }, [songList]);

  // 선택한 곡에 기록한 메모를 요청 후 state에 저장
  const getMemoProcess = async () => {
    try {
      const memoContents = await getMemo(id);
      setTempMemo(memoContents);
    } catch (error) {
      try {
        await reIssue();
        const memoContents = await getMemo(id);
        setTempMemo(memoContents);
      } catch {
        refreshTokenExpired();
        navigate('/');
        dispatch(setUserDefault());
      }
    }
  };

  ////////// 메모 기능 관련 //////////

  // 메모 저장시 일어나는 일련의 과정
  const postMemoProcess = async (id, tempMemo) => {
    const postMemoAndReset = async () => {
      await postMemo(id, tempMemo);
      setMemoSendComplete(true);
    };
    if (tempMemo) {
      try {
        console.log('포스트메모 실행함');
        await postMemoAndReset();
        flushSync(() => {
          setIsMsgBoxVisible(false);
          setIsScorePostSuccess(false);
        });
        flushSync(() => {
          setIsMsgBoxVisible(true);
          setIsScorePostSuccess(true);
        });
        setMsg('메모가 저장되었습니다.');
      } catch (error) {
        console.log('실패후 넘어옴');
        try {
          await reIssue();
          await postMemoAndReset();
          flushSync(() => {
            setIsMsgBoxVisible(false);
            setIsScorePostSuccess(false);
          });
          flushSync(() => {
            setIsMsgBoxVisible(true);
            setIsScorePostSuccess(true);
          });
          setMsg('메모가 저장되었습니다.');
        } catch (error) {
          refreshTokenExpired();
          navigate('/');
          dispatch(setUserDefault());
        }
      }
    } else {
      flushSync(() => {
        setIsMsgBoxVisible(false);
        setIsScorePostSuccess(false);
      });
      flushSync(() => {
        setIsMsgBoxVisible(true);
        setIsScorePostSuccess(false);
      });
      setMsg('빈 메모는 저장할 수 없습니다.');
    }
  };

  // 메모 삭제시 일어나는 일련의 과정
  const deleteMemoProcess = async id => {
    const deleteMemoAndReset = async () => {
      await deleteMemo(id);
      setMemoDeleteComplete(true);
      setTempMemo('');
    };
    try {
      await deleteMemoAndReset();
      flushSync(() => {
        setIsMsgBoxVisible(false);
        setIsScorePostSuccess(false);
      });
      flushSync(() => {
        setIsMsgBoxVisible(true);
        setIsScorePostSuccess(true);
      });
      setMsg('메모가 삭제되었습니다.');
    } catch (error) {
      try {
        if (error.response.status === 404) {
          flushSync(() => {
            setIsMsgBoxVisible(false);
            setIsScorePostSuccess(false);
          });
          flushSync(() => {
            setIsMsgBoxVisible(true);
            setIsScorePostSuccess(false);
          });
          setMsg('빈 메모는 삭제할 수 없습니다.');
        } else {
          await reIssue();
          await deleteMemoAndReset();
          flushSync(() => {
            setIsMsgBoxVisible(false);
            setIsScorePostSuccess(false);
          });
          flushSync(() => {
            setIsMsgBoxVisible(true);
            setIsScorePostSuccess(true);
          });
          setMsg('메모가 삭제되었습니다.');
        }
      } catch (error) {
        if (error.response.status === 404) {
          flushSync(() => {
            setIsMsgBoxVisible(false);
            setIsScorePostSuccess(false);
          });
          flushSync(() => {
            setIsMsgBoxVisible(true);
            setIsScorePostSuccess(false);
          });
          setMsg('빈 메모는 삭제할 수 없습니다.');
        } else {
          refreshTokenExpired();
          navigate('/');
          dispatch(setUserDefault());
        }
      }
    }
  };

  // 메모 삭제 확인 창 바깥을 클릭했을 때 확인 창을 닫게 함.
  const clickOutside = e => {
    if (isDeleteConfirm && !clickRef.current.contains(e.target)) {
      setIsDeleteConfirm(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  });

  // 메모 삭제 전 확인하는 창을 띄우는 기능 관련
  useEffect(() => {
    if (isDeleteConfirm) {
      setTimeout(() => {
        setConfirmAnimation('fade-in');
      }, 10);
    } else {
      setConfirmAnimation('');
    }
  }, [isDeleteConfirm]);

  // 메모가 저장될 경우
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMemoSendComplete(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [memoSendComplete]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMemoDeleteComplete(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [memoDeleteComplete]);

  ////////// 히스토리 관련 //////////

  // 서버에서 받은 시간을 가공해서 보여주고, 차트에 들어갈 정보를 가공함
  useEffect(() => {
    const newArray = [];
    const addTimeHistoryArray = [];

    for (let i = 0; i < achievementSongHistory.length; i++) {
      var dateObj = new Date(achievementSongHistory[i].addTime);
      var year = dateObj.getFullYear().toString().slice(-2); // 년도의 마지막 2자리 추출
      var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // 월 (0부터 시작하므로 +1을 해줌)의 두 자리로 표시
      var day = ('0' + dateObj.getDate()).slice(-2); // 일의 두 자리로 표시
      var hour = ('0' + dateObj.getHours()).slice(-2); // 시의 두 자리로 표시
      var minute = ('0' + dateObj.getMinutes()).slice(-2); // 분의 두 자리로 표시
      var second = ('0' + dateObj.getSeconds()).slice(-2); // 초의 두 자리로 표시

      // 문자열 조합
      var str =
        year + '. ' + month + '. ' + day + ' ' + hour + ':' + minute + ':' + second;
      addTimeHistoryArray.push(str);
    }

    for (let i = achievementSongHistory.length - 1; i >= 0; i--) {
      newArray.push({
        x: addTimeHistoryArray[i],
        y: achievementSongHistory[i].percentage,
      });
    }

    const newChartData = [
      {
        id: 'record',
        color: 'hsl(253, 100%, 93%)',
        data: newArray,
      },
    ];
    setChartData(newChartData);
    setAddtimeHistory(addTimeHistoryArray);
  }, [achievementSongHistory]);

  // 직전 점수와의 차이와 다음 등급까지의 점수를 구해서 히스토리 표에 뿌려줌
  useEffect(() => {
    calculateScoreDifference();
    calculateNextGrade();
  }, [achievementSongHistory]);

  const calculateScoreDifference = () => {
    const newDifference = [];
    for (let i = 0; i < achievementSongHistory.length; i++) {
      if (i < achievementSongHistory.length - 1) {
        newDifference.push(
          achievementSongHistory[i].score - achievementSongHistory[i + 1].score
        );
      } else {
        newDifference.push('-');
      }
    }
    setScoreDifference(newDifference);
  };

  const calculateNextGrade = () => {
    const newNextGrade = [];
    const remainNextGradeScore = (grade, currentScore) => {
      switch (grade) {
        case 'SPPP':
          return '-';
        case 'SPP':
          return 1090000 - currentScore;
        case 'SP':
          return 1050000 - currentScore;
        case 'S':
          return 1025000 - currentScore;
        case 'AP':
          return 1000000 - currentScore;
        case 'A':
          return 950000 - currentScore;
        case 'B':
          return 900000 - currentScore;
        case 'C':
          return 850000 - currentScore;
        case 'D':
          return 750000 - currentScore;
        case 'E':
          return 650000 - currentScore;
        case 'F':
          return 550000 - currentScore;
        default:
        // nothing
      }
    };
    for (let i = 0; i < achievementSongHistory.length; i++) {
      newNextGrade.push(
        remainNextGradeScore(
          achievementSongHistory[i].grade,
          achievementSongHistory[i].score
        )
      );
    }
    setScoreToNextGrade(newNextGrade);
  };

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

  const setHistory = async () => {
    const historyData = await getHistory(id);
    try {
      setAchievementSongHistory(historyData);
    } catch {
      try {
        await reIssue();
        setAchievementSongHistory(historyData);
      } catch {
        refreshTokenExpired();
        navigate('/');
        dispatch(setUserDefault());
      }
    }
  };

  const postScoreProcess = async id => {
    const postScoreAndRefresh = async () => {
      await postScore(id, isWriteAllCool, isWriteAllCombo, scoreInputValue);
      await getUserAchievementDataProcess();
      setIsHistoryWrite(false);
      setHistory();
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

  // Achievement List에 들어갈 정보를 가공함.
  const getUserAchievementDataProcess = async () => {
    const response = await getUserAchievementData(selectedKeyCaps, selectedLevel);
    try {
      dispatch(setSongList(response));
    } catch (error) {
      try {
        await reIssue();
        dispatch(setSongList(response));
      } catch (error) {
        refreshTokenExpired();
        navigate('/');
        dispatch(setUserDefault());
      }
    }
  };

  // 성과 삭제시 일어나는 일련의 과정들
  const deleteHistoryProcess = async recordHistoryId => {
    const deleteHistoryAndResetState = async () => {
      await deleteHistory(recordHistoryId);
      await getUserAchievementDataProcess();
      await setHistory();
    };
    try {
      await deleteHistoryAndResetState();
      flushSync(() => {
        setIsMsgBoxVisible(false);
        setIsScorePostSuccess(false);
      });
      flushSync(() => {
        setIsMsgBoxVisible(true);
        setIsScorePostSuccess(true);
      });
      setMsg('기록이 삭제되었습니다.');
    } catch (error) {
      try {
        await reIssue();
        await deleteHistoryAndResetState();
      } catch (error) {
        refreshTokenExpired();
        navigate('/');
        dispatch(setUserDefault());
      }
    }
  };

  ////////// 메시지 박스 관련 ///////////

  useEffect(() => {
    let animationTimer;

    if (isMsgBoxVisible) {
      animationTimer = setTimeout(() => {
        setAlertboxAnimation('modal-alert-box-show');
      }, 10);
    }

    return () => {
      clearTimeout(animationTimer);
      setAlertboxAnimation('');
    };
  }, [isMsgBoxVisible]);

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

  return (
    <>
      {isMsgBoxVisible && (
        <div className={`achievement-modal-alert-box ${alertboxAnimation}`}>
          {isScorePostSuccess ? (
            <svg
              width="30px"
              height="30px"
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
              width="30px"
              height="30px"
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
          <span className="modal-alert-box-contents">{msg}</span>
        </div>
      )}
      <div className="achievement-modal-wrapper">
        <div className="achievement-modal-info">
          <div className="achievement-modal-diskimg no-drag">
            <img
              src={process.env.PUBLIC_URL + '/musicdisk/' + renamed(name) + '.webp'}
              alt={name}
              className={` ${getPlayStatusClass(songInfo)} big-border`}
              // onError={handleImgError}
            ></img>
            <span className={`level-badge-lg ${difficulty}`}>{difficulty}</span>
          </div>
          <div className="achievement-modal">
            <div className="achievement-modal-song-info">
              <div className="achievement-modal-song-header">
                <div className="achievement-modal-song-header-left">
                  <h3 className="theme-pp">{name}</h3>
                  <h5>{artist}</h5>
                </div>
                <div className="achievement-modal-song-header-right">
                  <div>
                    <h3 className="theme-pp">{keyCapsToNumKey(keyType)}</h3>
                    <h3>{level}</h3>
                  </div>
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
                        <td>{percentage ? `${percentage.toFixed(2)}%` : '-'}</td>
                      </tr>
                      <tr>
                        <td className="theme-pp">BEST SCORE</td>
                        <td>{score ? score : '-'}</td>
                      </tr>
                      <tr>
                        <td className="theme-pp">STATUS</td>
                        <td>{getPlayStatusText(songInfo)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="no-drag">
                  <img
                    src={
                      process.env.PUBLIC_URL + '/gradeImg/' + returnGrade(grade) + '.png'
                    }
                    className={`achievement-modal-song-grade ${returnGrade(grade)}`}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
        <textarea
          maxLength={255}
          value={tempMemo ? tempMemo : ''}
          onChange={e => {
            setTempMemo(e.target.value);
          }}
          placeholder={tempMemo ? '' : '작성된 메모가 없습니다.'}
        ></textarea>
        <div className="user-memo-btn-group">
          {isDeleteConfirm && (
            <div
              ref={clickRef}
              className={`user-memo-delete-confirm ${
                isDeleteConfirm && confirmAnimation
              }`}
            >
              <p>정말 삭제하시겠습니까?</p>
              <div>
                <button
                  onClick={() => {
                    setIsDeleteConfirm(false);
                  }}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setIsDeleteConfirm(false);
                    deleteMemoProcess(id);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          )}
          <div className="user-memo-icon-group">
            <button
              className={memoDeleteComplete ? 'delete-complete' : ''}
              onClick={() => {
                setIsDeleteConfirm(true);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className={memoSendComplete ? 'send-complete' : ''}
              onClick={() => {
                postMemoProcess(id, tempMemo);
                // setFetchedMemo(tempMemo)
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
        {/* 임시차트용데이터가 [{id, color, data: [], [], [] ...}] 형태로 되어있음. */}
        {/* 임시차트용데이터가 아예 없을 수 있음. */}
        {chartData[0]?.data.length <= 1 && (
          <div className="no-visible-data">
            <h4>차트는 두 개 이상의 기록이 있을 때부터 보여집니다.</h4>
          </div>
        )}
        {chartData[0]?.data.length > 1 && (
          <div className="user-achievement-chart">
            <MyResponsiveLine data={chartData} />
          </div>
        )}
        <table className="achievement-history-table">
          <thead>
            <tr>
              <td>기록 날짜</td>
              {/* <td></td> */}
              <td>점수</td>
              <td>증감폭</td>
              <td>등급</td>
              <td>다음 등급까지</td>
              <td>삭제</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {isHistoryWrite && (
                <>
                  <td colSpan={3} className="achievement-history-input-wrapper">
                    <input
                      type="number"
                      name="score"
                      step="1000"
                      onInput={e => {
                        if (e.target.value.length > e.target.maxLength)
                          e.target.value = e.target.value.slice(0, e.target.maxLength);
                        setScoreInputValue(e.target.value);
                      }}
                      max={`${bestScore}`}
                      min="0"
                      maxLength={7}
                    ></input>
                  </td>
                  <td colSpan={3} className="achievement-modal-history-write-btn">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="xmarkBtnCircle"
                      onClick={() => {
                        setIsHistoryWrite(false);
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
                      className={`starBtnCircle ${isWriteAllCool ? null : 'no-checked'}`}
                      onClick={() => {
                        setIsWriteAllCool(prev => !prev);
                      }}
                    ></FontAwesomeIcon>
                  </td>
                </>
              )}
              {!isHistoryWrite && (
                <td className="achievement-modal-history-write" colSpan={6}>
                  <button
                    onClick={() => {
                      setIsHistoryWrite(prev => !prev);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon> 기록하기
                  </button>
                </td>
              )}
            </tr>
            {achievementSongHistory.length === 0 ? (
              <tr>
                <td colSpan={6}>아직 기록된 정보가 없습니다.</td>
              </tr>
            ) : (
              achievementSongHistory.map((el, i) => {
                return (
                  <tr key={i}>
                    <td>{addtimeHistory[i]}</td>
                    {/* <td></td> */}
                    <td>{el.score}</td>
                    <td>{scoreDifference[i]}</td>
                    <td>{gradeConvert(el.grade)}</td>
                    <td>{scoreToNextGrade[i]}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="history-delete-btn"
                        onClick={() => {
                          deleteHistoryProcess(el.recordHistoryId);
                        }}
                      ></FontAwesomeIcon>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AchievementDetail;
