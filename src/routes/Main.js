function Main(){
  return (
    <>

      <div className="main-title">
        <div className="main-title-background"></div>
        <div>
          <h3>Welcome to</h3>
          <h1 className="theme-pp">EZ2ARCHIVE!</h1>
          <p>성과표, 서열표 및 티어표를 포함한 다양한 기능을 제공합니다.</p>
        </div>
      </div>
      
      <div className="main-box">
        <div className="main-left-box">
          <div className="main-notice">
            <h4 className="theme-pp">공지사항</h4>
            <li className="link-2">현재 베타테스트 중입니다.</li>
          </div>
          <div className="sub-notice">
            <div className="sub-notice-element">
              <h4 className="theme-pp">게임 도움말</h4>
              <p>「EZ2ON REBOOT : R」이<br></br>처음이시라면?</p>
              <button className="theme-pp-button">게임 도움말 확인하기</button>
            </div>
            <div className="sub-notice-element">
              <h4 className="theme-pp">도움말 및 안내</h4>
              <p>활용하기 어렵거나<br></br>사용법이 궁금하시다면?</p>
              <button className="theme-pp-button">도움말 및 안내 확인하기</button>
            </div>
          </div>
        </div>
        <div className="main-right-box">
          <h4 className="theme-pp">성과 기록용 클라이언트</h4>
          <img src={process.env.PUBLIC_URL + '/source/imageclientdemo.webp'} alt="imageclientdemo"></img>
          <p>단 두 번의 조작으로<br></br>성과를 간편하게 기록하세요.</p>
          <button className="theme-pp-button">다운로드 하기</button>
        </div>
      </div>    
    </>
  )
}

export default Main