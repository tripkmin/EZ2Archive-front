/*eslint-disable*/

import './App.css';
import { Routes, Route, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

import Main from './routes/Main'
import RankOrderSelector from './routes/RankOrderSelector';
import RankOrderList from './routes/RankOrderList';
import Footer from './routes/Footer'
import MyTier from './routes/MyTier'
import CustomizeBtn from './routes/CustomizeBtn'
import PleaseSelect from './routes/PleaseSelect';
import Preparing from './routes/Preparing'
import Navbar from './routes/Navbar'
import Login from './routes/Login'
import Testpage from './routes/Testpage';
import NotFound from './routes/404';
import { useEffect } from 'react';
import { setUserName } from './store';

function App() {
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()

  return (
    <>
      <Navbar/>
        <Login/>
          <div className="main-wrapper">
          {/* 라우트 영역 */}
            <Routes>
              <Route path="/" element={ <Main/> }></Route>
              {/* <Route path="/signin" element={ <SignIn/> }></Route> */}
              {/* <Route path="/tier" element={ <><MyTier></MyTier></> }></Route> */}
              <Route path="/tier" element={ <><MyTier></MyTier><Preparing></Preparing></> }></Route>
              <Route path="/rank" element={ <><RankOrderSelector/> <Outlet></Outlet></> }>
                <Route index element={ <PleaseSelect/> }></Route>
                <Route path="4k/:selectedDifficulty" element={ <><RankOrderList selectedKey="4k"/></> }></Route>
                <Route path="5k/:selectedDifficulty" element={ <><RankOrderList selectedKey="5k"/></> }></Route>
                <Route path="6k/:selectedDifficulty" element={ <><RankOrderList selectedKey="6k"/></> }></Route>
                <Route path="8k/:selectedDifficulty" element={ <><RankOrderList selectedKey="8k"/></> }></Route>
              </Route>
              <Route path="/testpage6220" element={ <Testpage/> }></Route>
              <Route path="*" element={ <NotFound/> }/>
            </Routes>
          </div>
        <Footer/>
      <CustomizeBtn/>
    </>
  );
}

export default App;
