/*eslint-disable*/

import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  switchModalOpen,
  setModalStep,
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime,
  setUserDefault,
  setIsLoginTried,
} from '../store';
import { API_URL, AT } from '../services/temp';
import { getMyInfo, logout, reIssue, refreshTokenExpired } from '../utills/axios';

function Navbar() {
  const navigate = useNavigate();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { isLoggedIn, userName, userId, userAuth, userAddTime } = state.userinfo;

  useEffect(() => {
    const myInfoProcess = async () => {
      try {
        await getMyInfo();
      } catch (error) {
        try {
          await reIssue();
          await getMyInfo();
        } catch (error) {
          refreshTokenExpired();
          navigate('/');
          setUserDefault();
        }
      }
    };

    const loginCheck = async () => {
      if (AT) {
        await myInfoProcess();
      } else {
        dispatch(setUserDefault());
      }
      dispatch(setIsLoginTried(true));
    };

    loginCheck();
  }, [AT]);

  const logoutProcess = async () => {
    try {
      logout();
      localStorage.removeItem('accessToken');
      dispatch(setUserDefault());
      // window.location.href = '/'
      navigate('/');
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        console.log(error.response.data.message);
      } else if (error.response.status === 500) {
        console.log('서버 오류입니다. 관리자에게 문의하십시오.');
      }
      console.log(error);
    }
  };

  const 유저맞는지1차확인 = link => {
    if (userName && userId && userAuth && userAddTime) {
      navigate(link);
    } else {
      dispatch(switchModalOpen());
      dispatch(setModalStep(1));
    }
  };

  return (
    <header>
      <nav className="nav-wrapper theme-pp-shadow">
        <div className="container">
          <div className="nav">
            <img
              className="logo"
              src={process.env.PUBLIC_URL + '/navbar/ez2archive_logo.svg'}
              alt="logo"
              onClick={() => {
                navigate('/');
              }}
            ></img>
            <div className="category-box">
              <span
                className="category-link"
                onClick={() => {
                  유저맞는지1차확인('/achievement');
                }}
              >
                성과표
              </span>
              <span
                className="category-link"
                onClick={() => {
                  navigate('/rank');
                }}
              >
                서열표
              </span>
              <span
                className="category-link"
                onClick={() => {
                  navigate('/tier');
                }}
              >
                티어표
              </span>
              <span
                className="category-link"
                onClick={() => {
                  alert('^^');
                }}
              >
                NEW 서열표
              </span>
              <span
                className="category-link"
                onClick={() => {
                  alert('ㅜㅜ');
                }}
              >
                안내
              </span>
            </div>
            <img
              className="pp-navbar-pattern"
              src={process.env.PUBLIC_URL + '/navbar/Asset 1.svg'}
              alt="logo"
              onClick={() => {
                navigate('/');
              }}
            ></img>
            <div>
              {state.userinfo.userName !== '' ? (
                <span className="category-link">{state.userinfo.userName}님</span>
              ) : (
                <span
                  className="category-link"
                  onClick={() => {
                    dispatch(switchModalOpen());
                    dispatch(setModalStep(1));
                  }}
                >
                  로그인
                </span>
              )}
              {state.userinfo.userName !== '' ? (
                <span className="category-link" onClick={logoutProcess}>
                  로그아웃
                </span>
              ) : (
                <span
                  className="category-link"
                  onClick={() => {
                    dispatch(switchModalOpen());
                    dispatch(setModalStep(2));
                  }}
                >
                  회원가입
                </span>
              )}
              {state.userinfo.userAuth == 'ADMIN' ? (
                <span
                  className="category-link"
                  onClick={() => {
                    navigate('/manage');
                  }}
                >
                  관리
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
      <div className="nav-blocker"></div>
    </header>
  );
}

export default Navbar;
