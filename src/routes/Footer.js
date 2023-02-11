/*eslint-disable*/

import { useState } from "react"

function Footer(){

  const [닫기, set닫기] = useState(false)  

  let date = new Date()
  let year = date.getFullYear()

  return(
    <footer>
      <div className="container">
        <div className="footer">
          <div>
            <p>본 사이트는 게임 <strong>「EZ2ON REBOOT:R」</strong>의 팬 사이트이며,<br></br>사이트 내 사용된 모든 게임 컨텐츠의 저작권은 <strong>NEONOVICE</strong>에 있습니다.</p>
          </div>
          <div>
            <p>©️ {year} <strong>EZ2ARCHIVE</strong><br></br>© 2020 <strong>NEONOVICE</strong> & ©️ 2011-{year} <strong>SQUARE PIXELS</strong> All Rights Reserved.</p>
            <p>Special Thanks to <strong><a href="https://twitter.com/suisou610" target="_blank">수조</a></strong></p>
          </div>
        </div>
      </div>
      {
        닫기 === true 
        ? null 
        : <div className="no-support">본 사이트는 반응형 페이지를 지원하지 않습니다. <button onClick={()=>{set닫기(true)}}>[닫기]</button></div>
      }
    </footer>
  )
}

export default Footer