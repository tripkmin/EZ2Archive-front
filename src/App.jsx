/*eslint-disable*/

import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';

import Main from './routes/Main';
import RankOrderSelector from './routes/RankOrderSelector';
import RankOrderList from './routes/RankOrderList';
import Footer from './routes/Footer';
import MyTier from './routes/MyTier';
import CustomizeBtn from './routes/CustomizeBtn';
import PleaseSelectAchievement from './routes/guider/PleaseSelectAchievement';
import PleaseSelectRank from './routes/guider/PleaseSelectRank';
import PleaseWaiting from './routes/guider/PleaseWaiting';
import Navbar from './routes/Navbar';
import Modal from './routes/Modal';
import NotFound from './routes/Announce/404';
import Manage from './routes/Manage';
import AchievementSelector from './routes/AchievementSelector';
import AchievementList from './routes/AchievementList';
import { useNavigate } from 'react-router-dom';

function App() {
  console.log(process.env.REACT_APP_NODE_ENV);
  const isDevelopmentEnv = process.env.REACT_APP_NODE_ENV === 'development';
  {
    return isDevelopmentEnv ? (
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
              <Route path=":urlKey/:urlLevel" element={<AchievementList />}></Route>
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
              <Route path=":urlKey/:urlLevel" element={<RankOrderList />}></Route>
            </Route>
            <Route path="/manage" element={<Manage />}></Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <CustomizeBtn />
      </>
    ) : (
      <>
        <Navbar />
        <div className="main-wrapper">
          {/* 라우트 영역 */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <RankOrderSelector />
                  <Outlet />
                </>
              }
            >
              <Route index element={<PleaseSelectRank />}></Route>
              <Route path=":urlKey/:urlLevel" element={<RankOrderList />}></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </>
    );
  }
  // return (
  //   <>
  //     <Navbar />
  //     <Modal />
  //     <div className="main-wrapper">
  //       {/* 라우트 영역 */}
  //       <Routes>
  //         <Route path="/" element={<Main />}></Route>
  //         <Route
  //           path="/achievement"
  //           element={
  //             <>
  //               <AchievementSelector />
  //               <Outlet />
  //             </>
  //           }
  //         >
  //           <Route index element={<PleaseSelectAchievement />}></Route>
  //           <Route path=":urlKey/:urlLevel" element={<AchievementList />}></Route>
  //         </Route>
  //         <Route
  //           path="/tier"
  //           element={
  //             <>
  //               <MyTier></MyTier>
  //               <PleaseWaiting></PleaseWaiting>
  //             </>
  //           }
  //         ></Route>
  //         <Route
  //           path="/rank"
  //           element={
  //             <>
  //               <RankOrderSelector />
  //               <Outlet />
  //             </>
  //           }
  //         >
  //           <Route index element={<PleaseSelectRank />}></Route>
  //           <Route path=":urlKey/:urlLevel" element={<RankOrderList />}></Route>
  //         </Route>
  //         <Route path="/manage" element={<Manage />}></Route>
  //         <Route path="*" element={<NotFound />} />
  //       </Routes>
  //     </div>
  //     <Footer />
  //     <CustomizeBtn />
  //   </>
  // );
}

export default App;
