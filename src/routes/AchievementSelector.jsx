/*eslint-disable*/

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
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

  // 성능이 오히려 더 나빠짐. 왜 일까?
  // 세부 옵션을 선택하면 선택한 곳의 index를 알아내기 위해 설정함.
  // useEffect(() => {
  //   setKeyIndex(keyList.indexOf(selectedKey));
  // }, [selectedKey]);

  // useEffect(() => {
  //   setLevelIndex(levelList.indexOf(parseInt(selectedLevel)));
  // }, [selectedLevel]);

  // useEffect(() => {
  //   // 등급 필터로 선택한 등급을 배열에 넣어 표시함.
  //   const newGradeIndexArray = [];
  //   selectedGrade.map(grade => {
  //     const index = gradeList.findIndex(gradeList => gradeList.dbGrade === grade);
  //     newGradeIndexArray.push(index);
  //   });
  //   setGradeIndex(newGradeIndexArray);
  // }, [selectedGrade]);

  // useEffect(() => {
  //   setTitleIndex(songTitleView ? 0 : 1);
  // }, [songTitleView]);

  // useEffect(() => {
  //   setDescIndex(isDescending ? 0 : 1);
  // }, [isDescending]);

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
        // toFixed는 string 형식으로 반환하므로 parseFloat로 감싸줌.
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
    if (selectedKey && selectedLevel) {
      navigate(`${selectedKey}/${selectedLevel}`);
    }
  }, [selectedKey, selectedLevel]);

  useEffect(() => {
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

  const 유저정보검증 = () => {
    if (userName && userId && userAuth && userAddTime) {
      return true;
    } else {
      return false;
    }
  };

  /* 
  클릭 시 시나리오
  클릭한 곳에서는 무조건 현 상태와 반대가 되도록 한다. 
  클릭한 상태에서는 이 사람이 클릭했다는 변수가 true가 되도록 한다
  클릭한 곳의 위치 변수 역시 담는다. 
  그 상태로 다른 요소를 지나갈 시 toggle 된다.
  다른 요소를 지나가서 한 번 들어왔다면 스치는 중이라는 변수에 집어넣는다
  만약 그 요소를 클릭한 상태로 지나갔다면 이제 그 변수에서 뺀다.
  
  */

  return (
    <>
      <div className="achievement-selector-wrapper">
        <div className="achievement-selector">
          <div className="achievement-userinfo">
            <div className="achievement-key-level">
              <h1 className="theme-pp">
                {selectedKey === '' ? '?K' : selectedKey.toUpperCase()}
              </h1>
              <h4>{selectedLevel === 0 ? '' : selectedLevel}</h4>
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
              유저정보검증() ? setFilterShow(!filterShow) : null;
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
                  유저정보검증() ? dispatch(setAchievementKey(el)) : null;
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
                  유저정보검증() ? dispatch(setAchievementLevel(el)) : null;
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
                  유저정보검증() ? dispatch(setAchievementRank(el.dbGrade)) : null;
                }}
              >
                {el.convertName}
              </li>
            );
          })}
          <li
            className="achievement-filter-element"
            onClick={() => {
              유저정보검증() ? dispatch(setAchievementRankDefault()) : null;
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
                  유저정보검증() ? dispatch(setDescending(el.value)) : null;
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
