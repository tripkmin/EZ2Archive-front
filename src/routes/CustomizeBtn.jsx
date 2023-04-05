/*eslint-disable*/

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CustomizeBtn = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [showClass, setShowClass] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [customClass, setCustomClass] = useState('customize-close');
  const [currentTheme, setCurrentTheme] = useState(['', '']);
  const [themeList] = useState(['pp', 'tt']);
  const clickRef = useRef();
  const { manageMode } = state.userinfo;

  const clickOutside = e => {
    if (isOpen && !clickRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCustomClass('customize-show');
    } else {
      setCustomClass('customize-close');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  });

  return !manageMode ? (
    <div ref={clickRef} className={`customize-wrapper ${showClass}`}>
      <div className={`customize-list ${customClass}`}>
        {themeList.map((themeElement, index) => (
          <button
            className={`${currentTheme[index]}`}
            onClick={() => {
              const themeIndex = themeList.findIndex(el => el === themeElement);
              const newArray = ['', ''];
              newArray[themeIndex] = `theme-${themeElement} bold`;
              setCurrentTheme(newArray);
            }}
            key={index}
          >
            {themeElement.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        className="customize-btn theme-pp-button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        테마 선택
      </button>
    </div>
  ) : null;
};

export default CustomizeBtn;
