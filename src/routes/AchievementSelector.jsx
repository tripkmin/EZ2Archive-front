/*eslint-disable*/

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  setTitleView,
  setDescending,
  setAchievementKey,
  setAchievementLevel,
  setAchievementRank,
  setAchievementRankDefault,
  setAchievementClean,
  cleanSongList,
  switchModalOpen,
  setModalStep,
} from '../store';

const AchievementSelector = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedKey, selectedLevel, selectedGrade, songTitleView, isDescending } =
    state.achievementUserSelected;
  const { isLoginTried, userName, userId, userAuth, userAddTime } = state.userinfo;
  const { songList } = state.achievementSongInfo;
  const [overall, setOverall] = useState([
    { name: 'rateAvg', data: 0, convertName: 'AVERAGE RATE' },
    { name: 'allCoolCnt', data: 0, convertName: 'ALL COOL' },
    { name: 'noMissCnt', data: 0, convertName: 'NO MISS' },
    { name: 'spppCnt', data: 0, convertName: 'S⁺⁺⁺' },
    { name: 'sppCnt', data: 0, convertName: 'S⁺⁺' },
    { name: 'spCnt', data: 0, convertName: 'S⁺' },
  ]);
  const [songCount, setSongCount] = useState(0);

  const [keyIndex, setKeyIndex] = useState(null);
  const [levelIndex, setLevelIndex] = useState(null);
  const [gradeIndex, setGradeIndex] = useState([]);
  const [titleIndex, setTitleIndex] = useState(null);
  const [descIndex, setDescIndex] = useState(null);
  const [filterShow, setFilterShow] = useState(true);
  const [isLogined, setIsLogined] = useState(true);
  const [keySelectedAnimation, setKeySelectedAnimation] = useState(false);
  const [levelSelectedAnimation, setLevelSelectedAnimation] = useState(false);

  const barLength = 700;
  const keyList = ['4k', '5k', '6k', '8k'];
  const levelList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const gradeList = [
    { dbGrade: 'SPPP', convertName: 'S⁺⁺⁺' },
    { dbGrade: 'SPP', convertName: 'S⁺⁺' },
    { dbGrade: 'SP', convertName: 'S⁺' },
    { dbGrade: 'S', convertName: 'S' },
    { dbGrade: 'AP', convertName: 'A⁺' },
    { dbGrade: 'A', convertName: 'A' },
    { dbGrade: 'B', convertName: 'B' },
    { dbGrade: 'C', convertName: 'C' },
    { dbGrade: 'D', convertName: 'D' },
    { dbGrade: 'E', convertName: 'E' },
    { dbGrade: 'F', convertName: 'F' },
  ];
  const titleViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ];
  const descViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ];

  // 비로그인 시 보여줄 화면 세팅
  useEffect(() => {
    if (isLoginTried && !userName && !userId && !userAuth && !userAddTime) {
      setFilterShow(false);
      dispatch(switchModalOpen());
      dispatch(setModalStep(1));
    } else {
      setFilterShow(true);
    }
  }, [isLoginTried, userName, userId, userAuth, userAddTime]);

  useEffect(() => {
    const newGradeIndexArray = [];
    selectedGrade.map(grade => {
      const index = gradeList.findIndex(gradeList => gradeList.dbGrade === grade);
      newGradeIndexArray.push(index);
    });

    setKeyIndex(keyList.indexOf(selectedKey));
    setLevelIndex(levelList.indexOf(parseInt(selectedLevel)));
    setGradeIndex(newGradeIndexArray);
    setTitleIndex(songTitleView ? 0 : 1);
    setDescIndex(isDescending ? 0 : 1);
  }, [selectedKey, selectedLevel, selectedGrade, , songTitleView, isDescending]);

  useEffect(() => {
    const percentageArrayWithUndefined = songList.map(el => el.userRecordData.percentage);
    const gradeArray = songList.map(el => el.userRecordData.grade);
    const allCoolArray = songList.filter(el => el.userRecordData.isAllCool);
    const noMissArray = songList.filter(el => el.userRecordData.isNoMiss);

    const percentageArray = percentageArrayWithUndefined.filter(el => el !== undefined);
    const spppCount = gradeArray.filter(el => el === 'SPPP').length;
    const sppCount = spppCount + gradeArray.filter(el => el === 'SPP').length;
    const spCount = sppCount + gradeArray.filter(el => el === 'SP').length;

    const getAvg = (numsArray, toFixedNums) => {
      if (numsArray.length !== 0) {
        const sum = numsArray.reduce((a, b) => a + b, 0);
        const avgRate = parseFloat((sum / numsArray.length).toFixed(toFixedNums));
        return avgRate;
      } else {
        return 0;
      }
    };

    setOverall([
      {
        name: 'rateAvg',
        data: getAvg(percentageArray, 2),
        convertName: 'AVERAGE RATE',
      },
      {
        name: 'allCoolCnt',
        data: allCoolArray.length,
        convertName: 'ALL COOL',
      },
      { name: 'noMissCnt', data: noMissArray.length, convertName: 'NO MISS' },
      { name: 'spppCnt', data: spppCount, convertName: 'S⁺⁺⁺' },
      { name: 'sppCnt', data: sppCount, convertName: 'S⁺⁺' },
      { name: 'spCnt', data: spCount, convertName: 'S⁺' },
    ]);
    setSongCount(songList.length);
  }, [songList]);

  useEffect(() => {
    // myInfo 요청으로 store.js에 유저 정보가 기록되있는지 참조함.
    userName && userId && userAuth && userAddTime
      ? setIsLogined(true)
      : setIsLogined(false);
  }, [userName, userId, userAuth, userAddTime]);

  useEffect(() => {
    // 유효한 키와 레벨을 선택해야 로컬 스토리지에 마지막 선택 키/난이도 정보를 기록하도록 설정하고 페이지를 이동하게 함.
    const isValidKey = ['4k', '5k', '6k', '8k'].includes(selectedKey);
    const isValidLevel = parseInt(selectedLevel) >= 1 && parseInt(selectedLevel) <= 20;

    if (isValidKey && isValidLevel) {
      localStorage.setItem(
        'lastAchievementSelected',
        JSON.stringify({ key: selectedKey, level: selectedLevel })
      );
      navigate(`/achievement/${selectedKey}/${selectedLevel}`);
    }
  }, [selectedKey, selectedLevel]);

  useEffect(() => {
    // 로그인 하지 않은 상태에서 achievement에 접근하고 로그인에 성공했다면 마지막 키/난이도 정보를 조회할 수 있도록 함.
    const lastSelected = JSON.parse(localStorage.getItem('lastAchievementSelected'));
    const [lastAchievementSelectedKey, lastAchievementSelectedLevel] = [
      lastSelected?.key,
      lastSelected?.level,
    ];

    if (lastAchievementSelectedKey && lastAchievementSelectedLevel && isLogined) {
      navigate(
        `/achievement/${lastAchievementSelectedKey}/${lastAchievementSelectedLevel}`
      );
    }
  }, [isLogined]);

  useEffect(() => {
    // achievement를 벗어날 때 유저의 선택 정보를 지움.
    return () => {
      dispatch(setAchievementClean());
      dispatch(cleanSongList());
    };
  }, []);

  const convertPercentage = (obj, songCount) => {
    const { name, data } = obj;
    if (name === 'rateAvg') {
      return `${data}%`;
      // 0일 경우 NaN이 뜨는 걸 막기 위해 작성
    } else if (data === 0) {
      return `${data}%`;
    } else {
      return `${((data / songCount) * 100).toFixed(1)}%`;
    }
  };

  const verifyUser = () => {
    return userName && userId && userAuth && userAddTime ? true : false;
  };

  useEffect(() => {
    setKeySelectedAnimation(true);
    const timer = setTimeout(() => {
      setKeySelectedAnimation(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedKey]);

  useEffect(() => {
    setLevelSelectedAnimation(true);
    const timer = setTimeout(() => {
      setLevelSelectedAnimation(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedLevel]);

  return (
    <>
      <div className="achievement-selector-wrapper">
        <div className="achievement-selector">
          <div className="achievement-userinfo">
            <div className="achievement-key-level">
              <h1
                className={`theme-pp ${
                  keySelectedAnimation ? 'head-selected-feedback' : ''
                }`}
              >
                {selectedKey === '' ? '?K' : selectedKey.toUpperCase()}
              </h1>
              <h4 className={`${levelSelectedAnimation ? 'head-selected-feedback' : ''}`}>
                {selectedLevel === 0 ? '' : selectedLevel}
              </h4>
            </div>
            <h4>{userName}</h4>
          </div>
          <div className="achievement-detail">
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <h3 className="theme-pp">OVERALL</h3>
                  </td>
                </tr>
              </thead>
              {overall.map((overall, i) => {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{convertPercentage(overall, songCount)}</td>
                      <td>
                        {overall.name === 'rateAvg'
                          ? overall.data.toFixed(0) + '/' + 100
                          : overall.data + '/' + songCount}
                      </td>
                      <td>
                        <div className="behind-bar">
                          <div
                            className="bar"
                            style={{
                              transform:
                                overall.name === 'rateAvg'
                                  ? `translateX(${
                                      -barLength + (barLength * overall.data) / 100
                                    }px)`
                                  : `translateX(${
                                      -barLength + barLength * (overall.data / songCount)
                                    }px`,
                            }}
                          ></div>
                          <span>{overall.convertName}</span>
                          <div
                            className="bar-shadow"
                            style={{
                              width: `${(barLength * overall.data) / 100}`,
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
          <div
            className="achievement-option-box"
            onClick={() => {
              verifyUser() ? setFilterShow(!filterShow) : null;
            }}
          >
            <span className="bold">필터 {filterShow ? '숨기기' : '보기'}</span>
          </div>
        </div>
      </div>
      <div
        className={`achievement-filter-wrapper no-drag ${
          !filterShow && 'achievement-filter-deactivate'
        }`}
      >
        <div>
          <h4 className="theme-pp">KEY</h4>
          {keyList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === keyIndex ? 'achievement-filter-element-active' : ''
                }`}
                key={i}
                onClick={() => {
                  verifyUser() ? dispatch(setAchievementKey(el)) : null;
                  // dispatch(setAchievementKey(el))
                }}
              >
                {el.toUpperCase()}
              </li>
            );
          })}
        </div>
        <div>
          <h4 className="theme-pp">LEVEL</h4>
          {levelList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === levelIndex ? 'achievement-filter-element-active' : ''
                }`}
                key={i}
                onClick={() => {
                  verifyUser() ? dispatch(setAchievementLevel(el)) : null;
                  // dispatch(setAchievementLevel(el))
                }}
              >
                {el}
              </li>
            );
          })}
        </div>
        <div>
          <h4 className="theme-pp">RANK</h4>
          {gradeList.map((el, i) => {
            let findGradeList = gradeIndex.find(el => el === i);
            return (
              <li
                className={`achievement-filter-element
              ${findGradeList !== undefined ? 'achievement-filter-element-active' : ''}`}
                key={i}
                onClick={() => {
                  verifyUser() ? dispatch(setAchievementRank(el.dbGrade)) : null;
                }}
              >
                {el.convertName}
              </li>
            );
          })}
          <li
            className="achievement-filter-element"
            onClick={() => {
              verifyUser() ? dispatch(setAchievementRankDefault()) : null;
              // dispatch(setAchievementRankDefault())
            }}
          >
            해제
          </li>
        </div>
        <div>
          <h4 className="theme-pp">TITLE</h4>
          {titleViewList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === titleIndex ? 'achievement-filter-element-active' : ''
                }`}
                onClick={() => {
                  dispatch(setTitleView(el.value));
                }}
                key={i}
              >
                {el.convertName}
              </li>
            );
          })}
        </div>
        <div>
          <h4 className="theme-pp">내림차순</h4>
          {descViewList.map((el, i) => {
            return (
              <li
                className={`achievement-filter-element ${
                  i === descIndex ? 'achievement-filter-element-active' : ''
                }`}
                onClick={() => {
                  verifyUser() ? dispatch(setDescending(el.value)) : null;
                  // dispatch(setDescending(el.value))
                }}
                key={i}
              >
                {el.convertName}
              </li>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AchievementSelector;
