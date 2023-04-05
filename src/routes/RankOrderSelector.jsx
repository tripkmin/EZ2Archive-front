/*eslint-disable*/

import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setRankTitleView,
  setRankClean,
  setRankDescending,
  setRankKey,
  setRankLevel,
} from '../store';
const RankOrderSelector = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedKey, selectedLevel, songTitleView, isDescending } =
    state.rankUserSelected;
  const keyList = ['4k', '5k', '6k', '8k'];
  const levelList = [14, 15, 16, 17, 18, 19, 20];
  const titleViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ];
  const descViewList = [
    { convertName: 'ON', value: true },
    { convertName: 'OFF', value: false },
  ];
  const [keyIndex, setKeyIndex] = useState(null);
  const [levelIndex, setLevelIndex] = useState(null);
  const [titleIndex, setTitleIndex] = useState(null);
  const [descIndex, setDescIndex] = useState(null);
  const [lastRankSelectedKey, lastRankSelectedLevel] = [
    localStorage.getItem('lastRankSelectedKey'),
    localStorage.getItem('lastRankSelectedLevel'),
  ];

  useEffect(() => {
    if (lastRankSelectedKey && lastRankSelectedLevel) {
      navigate(`/rank/${lastRankSelectedKey}/${lastRankSelectedLevel}`);
    }
  }, []);

  useEffect(() => {
    const isValidKey = ['4k', '5k', '6k', '8k'].includes(selectedKey);
    const isValidLevel = parseInt(selectedLevel) >= 14 && parseInt(selectedLevel) <= 20;

    if (isValidKey && isValidLevel) {
      localStorage.setItem('lastRankSelectedKey', selectedKey);
      localStorage.setItem('lastRankSelectedLevel', selectedLevel);
      navigate(`/rank/${selectedKey}/${selectedLevel}`);
    }
  }, [selectedKey, selectedLevel]);

  useEffect(() => {
    return () => {
      dispatch(setRankClean());
    };
  }, []);

  useEffect(() => {
    setKeyIndex(keyList.indexOf(selectedKey));
    setLevelIndex(levelList.indexOf(parseInt(selectedLevel)));
    setTitleIndex(songTitleView ? 0 : 1);
    setDescIndex(isDescending ? 0 : 1);
  }, [selectedKey, selectedLevel, songTitleView, isDescending]);

  return (
    <>
      <div className="rank-filter-wrapper no-drag">
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
                  dispatch(setRankKey(el));
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
                  dispatch(setRankLevel(el));
                }}
              >
                {el}
              </li>
            );
          })}
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
                  dispatch(setRankTitleView(el.value));
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
                  dispatch(setRankDescending(el.value));
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

export default RankOrderSelector;
