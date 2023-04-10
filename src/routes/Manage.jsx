/*eslint-disable*/

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime,
  setDefault,
  setManageMode,
} from '../store';
import { API_URL, AT } from '../services/temp';
import { getMyInfo, reIssue } from '../utills/axios';
import { useNavigate } from 'react-router-dom';

// state에 따라 nav, footer 드러나는 페이지도 단계에 맞게 수정해놓을 것.
// Manage 컴포넌트에 들어오자마자 무조건 신원확인 요청
// 실패시 바로 홈 화면으로 리다이렉트 요청할 것.
// Admin이 아닐 시에도 똑같이 홈 화면 리다이렉트
// 성공하고 Admin일 경우 관리자 페이지로 전환
// 관리자 페이지로 전환 된 뒤에는 푸터 (+@네비바)가 사라지기.

const Manage = () => {
  // const API_URL = "https://api.ez2archive.kr"
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const { userAuth } = state.userinfo;

  useEffect(() => {
    const isAdmin = async () => {
      const verifyProcess = () => {
        if (userAuth === 'ADMIN') {
          dispatch(setManageMode(true));
        } else {
          navigate('/');
        }
      };

      setVerifying(false);
      if (AT) {
        try {
          await getMyInfo();
          verifyProcess();
        } catch (error) {
          try {
            await reIssue();
            await getMyInfo();
            verifyProcess();
          } catch (error) {
            navigate('/');
          }
        }
      } else {
        navigate('/');
      }
      setTimeout(() => {
        setVerifying(true);
      }, 1000);
    };

    isAdmin();

    return () => {
      dispatch(setManageMode(false));
    };
  }, []);

  return (
    <div className="">
      {verifying ? (
        <div>
          <h1>관리자 페이지</h1>
          <ul>공지사항 등록, 수정, 삭제</ul>
          <li>공지사항 등록</li>
          <li>공지사항 수정</li>
          <li>공지사항 삭제</li>
          <ul>음원 정보 관리</ul>
          <li>검색/수정/삭제 기능</li>
          <ul>회원 정보 관리</ul>
        </div>
      ) : (
        <div className="verifying">
          <img
            src={process.env.PUBLIC_URL + '/source/AreYouAdmin.png'}
            alt="AreYouAdmin"
            className="open-the-door"
          ></img>
          <h3>인증 중</h3>
        </div>
      )}
    </div>
  );
};

export default Manage;
