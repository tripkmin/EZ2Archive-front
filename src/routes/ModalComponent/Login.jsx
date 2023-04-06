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
  const [isIdVaild, setIsIdVaild] = useState(false);
  const [isPasswordVaild, setIsPasswordVaild] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaShow, setCaptchaShow] = useState(true);
  const [loginNotAllow, setLoginNotAllow] = useState(true);
  const { loginTryCount } = state.modal;
  const reCaptchaShowCount = 1;

  useEffect(() => {
    id.length > 4 ? setIsIdVaild(true) : setIsIdVaild(false);
  }, [id]);

  useEffect(() => {
    password.length > 3 ? setIsPasswordVaild(true) : setIsPasswordVaild(false);
  }, [password]);

  useEffect(() => {
    if (loginTryCount <= reCaptchaShowCount) {
      if (isIdVaild && isPasswordVaild) {
        setLoginNotAllow(false);
      } else {
        setLoginNotAllow(true);
      }
    } else {
      if (isIdVaild && isPasswordVaild && captchaChecked) {
        setLoginNotAllow(false);
      } else {
        setLoginNotAllow(true);
      }
    }
  }, [isIdVaild, isPasswordVaild, captchaChecked]);

  useEffect(() => {
    loginTryCount > reCaptchaShowCount ? setCaptchaShow(true) : setCaptchaShow(false);
  }, [loginTryCount]);

  useEffect(() => {
    if (captchaShow) {
      setLoginNotAllow(true);
    }
  }, [captchaShow]);

  const onChange = () => {
    setCaptchaChecked(true);
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
          {captchaShow ? (
            <ReCAPTCHA
              className="sign-recaptcha"
              sitekey="6Lf61GIlAAAAAHK8Ue0kYFeCAZ5i5Cj4sBUCcqPz"
              onChange={onChange}
              // style={{ transform: 'scale(1.11)' }}
            />
          ) : null}
          <button disabled={loginNotAllow} type="submit" className="theme-pp-button">
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
