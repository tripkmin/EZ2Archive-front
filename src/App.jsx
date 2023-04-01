/*eslint-disable*/

import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'
import { setUserName } from './store'

import Main from './routes/Main'
import RankOrderSelector from './routes/RankOrderSelector'
import RankOrderList from './routes/RankOrderList'
import Footer from './routes/Footer'
import MyTier from './routes/MyTier'
import CustomizeBtn from './routes/CustomizeBtn'
import PleaseSelectAchievement from './routes/guider/PleaseSelectAchievement'
import PleaseSelectRank from './routes/guider/PleaseSelectRank'
import PleaseWaiting from './routes/guider/PleaseWaiting'
import Navbar from './routes/Navbar'
import Modal from './routes/Modal'
import NotFound from './routes/Announce/404'
import Manage from './routes/Manage'
import AchievementSelector from './routes/AchievementSelector'
import AchievementList from './routes/AchievementList'

function App() {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const { isLoginTried, userName, userId, userAuth, userAddTime } =
    state.userinfo

  return (
    <>
      <Navbar />
      <Modal />
      <div className="main-wrapper">
        {/* 라우트 영역 */}
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route
            path="/achievement"
            element={
              <>
                <AchievementSelector />
                <Outlet />
              </>
            }
          >
            <Route index element={<PleaseSelectAchievement />}></Route>
            <Route
              path=":urlKey/:urlLevel"
              element={
                <>
                  <AchievementList />
                </>
              }
            ></Route>
            {/* <Route
              path=":urlKey/:urlLevel"
              element={
                <>
                  <AchievementList />
                </>
              }
            ></Route>
            <Route
              path=":urlKey/:urlLevel"
              element={
                <>
                  <AchievementList />
                </>
              }
            ></Route>
            <Route
              path=":urlKey/:urlLevel"
              element={
                <>
                  <AchievementList />
                </>
              }
            ></Route> */}
          </Route>
          <Route
            path="/tier"
            element={
              <>
                <MyTier></MyTier>
                <PleaseWaiting></PleaseWaiting>
              </>
            }
          ></Route>
          <Route
            path="/rank"
            element={
              <>
                <RankOrderSelector />
                <Outlet />
              </>
            }
          >
            <Route index element={<PleaseSelectRank />}></Route>
            <Route
              path=":urlKey/:urlLevel"
              element={
                <>
                  <RankOrderList selectedKey="4k" />
                </>
              }
            ></Route>
            {/* <Route
              path="4k/:urlLevel"
              element={
                <>
                  <RankOrderList selectedKey="4k" />
                </>
              }
            ></Route>
            <Route
              path="5k/:urlLevel"
              element={
                <>
                  <RankOrderList selectedKey="5k" />
                </>
              }
            ></Route>
            <Route
              path="6k/:urlLevel"
              element={
                <>
                  <RankOrderList selectedKey="6k" />
                </>
              }
            ></Route>
            <Route
              path="8k/:urlLevel"
              element={
                <>
                  <RankOrderList selectedKey="8k" />
                </>
              }
            ></Route> */}
          </Route>
          <Route path="/manage" element={<Manage />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <CustomizeBtn />
    </>
  )
}

export default App
