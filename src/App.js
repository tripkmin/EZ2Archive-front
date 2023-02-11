// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

import Main from "./routes/Main.js"
import RankOrderSelector from './routes/RankOrderSelector';
import RankOrderList from './routes/RankOrderList.js';
import Footer from './routes/Footer.js'
import MyTier from './routes/MyTier.js'
import CustomizeBtn from './routes/CustomizeBtn.js'
import PleaseSelect from './routes/PleaseSelect';
import Preparing from './routes/Preparing.js'
import Navbar from './routes/Navbar.js'
import Login from './routes/Login.js'
import SignIn from './routes/SignIn';
import Testpageblocker from './routes/Testpageblocker';

import { useEffect } from 'react';
import { setUserName } from './store';

function App() {
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  
  useEffect(()=>{
    /* 검증해야 할 것 
      1. 엑세스 토큰이 만약 만료됐다면 리프레쉬 토큰을 이용해서 서버에서 새로운 엑세스 토큰을 받아온다.
      2. 리프레쉬 토큰까지 만료가 됐다면 쿠키 삭제시킨다.
      3. 만약 쿠키가 유효하다면 안녕하세요 누구 님~처럼 파싱한 쿠키의 데이터의 이름을 로그인 쪽 에다가 이름을 적도록 한다.   
    */ 


  // 파싱한 것들에 대해서 어떤 것들을 할 지 체크를 좀 해봐야 할 거 같은데... 이거 어떻게 해야 할 지 모르겠음.

    if (typeof cookies.accessToken !== 'undefined'){
      var accessToken = cookies.accessToken
      var base64Payload = accessToken.split('.')[1]; // .을 기준으로 나누고 거기서 2번째 요소를 고름
      var payload = decodeURIComponent(window.atob(base64Payload)); // JSON화 된 거라 한 번 파싱을 해줘야 함.
      var result = JSON.parse(payload) // 그럼 이제 객체 형태로 나옴.
      var isExpired = result.exp - result.iat < 0
      dispatch(setUserName(result.sub))
      // console.log("로그인 한 아이디 이름 : " + result.sub)
      // console.log("리프레쉬 토큰 발급일자 : " + new Date(result.iat * 1000))
      // console.log("리프레쉬 토큰 만료날짜 : " + new Date(result.exp * 1000))
      // console.log("리프레쉬 토큰 만료여부 : " + isExpired)
    }}
  )

  return (
    <>
      <Navbar/>
        <Login setCookie={setCookie} />
          <div className="main-wrapper">
          {/* 라우트 영역 */}
            <Routes>
              <Route path="/" element={ <Main/> }></Route>
              <Route path="/signin" element={ <SignIn/> }></Route>
              {/* <Route path="/tier" element={ <><MyTier></MyTier></> }></Route> */}
              <Route path="/tier" element={ <><MyTier></MyTier><Preparing></Preparing></> }></Route>
              <Route path="/rank" element={ <><RankOrderSelector/> <Outlet></Outlet></> }>
                <Route index element={ <PleaseSelect/> }></Route>
                <Route path="4k/:selectedDifficulty" element={ <><RankOrderList selectedKey="4k"/></> }></Route>
                <Route path="5k/:selectedDifficulty" element={ <><RankOrderList selectedKey="5k"/></> }></Route>
                <Route path="6k/:selectedDifficulty" element={ <><RankOrderList selectedKey="6k"/></> }></Route>
                <Route path="8k/:selectedDifficulty" element={ <><RankOrderList selectedKey="8k"/></> }></Route>
              </Route>
            </Routes>
          </div>
        <Footer/>
      <CustomizeBtn/>
    </>
  );
}

export default App;
