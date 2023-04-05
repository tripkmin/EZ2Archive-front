/*eslint-disable*/

import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../services/temp';
import {
  setModalStep,
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime,
  setModalDefault,
} from '../../store';
import { getMyInfo, login } from '../../utills/axios';

const Login = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(id, password);
      await getMyInfo();
      dispatch(setModalDefault());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        setErrorMsg(error.response.data.message);
      } else if (error.response.status >= 500) {
        setErrorMsg('서버 오류입니다. 관리자에게 문의하십시오.');
      }
    }
  };

  return (
    <div className="login-body">
      <div className="login-body-header">
        <h3 className="theme-pp">로그인</h3>
        {<small className="login-error">{errorMsg}</small>}
      </div>
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="login-input-warning"></div>
          <div className="login-input-wrapper">
            <input
              id="id"
              type="text"
              name="user_id"
              required
              placeholder="아이디"
              onChange={e => {
                setId(e.target.value);
              }}
            ></input>
          </div>
          <div className="login-input-wrapper">
            <input
              id="password"
              type="password"
              name="user_password"
              required
              placeholder="비밀번호"
              onChange={e => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <button type="submit" className="theme-pp-button">
            로그인
          </button>
        </fieldset>
      </form>
      <div className="login-body-sub">
        <p
          onClick={() => {
            dispatch(setModalStep(2));
          }}
        >
          회원가입
        </p>
        <p>ID/PW 찾기</p>
      </div>
    </div>
  );
};

export default Login;
