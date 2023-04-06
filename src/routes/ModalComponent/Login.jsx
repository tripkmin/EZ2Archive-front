/*eslint-disable*/

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../../services/temp';
import {
  setModalStep,
  setUserName,
  setUserId,
  setUserAuth,
  setUserAddTime,
  setModalDefault,
  setLoginTryCount,
} from '../../store';
import { getMyInfo, login } from '../../utills/axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [아이디유효하냐, set아이디유효하냐] = useState(false);
  const [비밀번호유효하냐, set비밀번호유효하냐] = useState(false);
  const [캡챠통과했냐, set캡챠통과했냐] = useState(true);
  const [로그인허용안함, set로그인허용안함] = useState(true);
  const { loginTryCount } = state.modal;

  useEffect(() => {
    id.length > 4 ? set아이디유효하냐(true) : set아이디유효하냐(false);
  }, [id]);

  useEffect(() => {
    password.length > 3 ? set비밀번호유효하냐(true) : set비밀번호유효하냐(false);
  }, [password]);

  useEffect(() => {
    아이디유효하냐 && 비밀번호유효하냐 && 캡챠통과했냐
      ? set로그인허용안함(false)
      : set로그인허용안함(true);
  }, [아이디유효하냐, 비밀번호유효하냐, 캡챠통과했냐]);

  useEffect(() => {
    loginTryCount > 2 ? set캡챠통과했냐(false) : set캡챠통과했냐(true);
  }, [loginTryCount]);

  const onChange = () => {
    set캡챠통과했냐(true);
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(id, password);
      await getMyInfo();
      dispatch(setModalDefault());
      dispatch(setLoginTryCount(0));
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        setErrorMsg(error.response.data.message);
        dispatch(setLoginTryCount(loginTryCount + 1));
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
          {loginTryCount > 2 ? (
            <ReCAPTCHA
              className="sign-recaptcha"
              sitekey="6Lf61GIlAAAAAHK8Ue0kYFeCAZ5i5Cj4sBUCcqPz"
              onChange={onChange}
              // style={{ transform: 'scale(1.11)' }}
            />
          ) : null}
          <button disabled={로그인허용안함} type="submit" className="theme-pp-button">
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
