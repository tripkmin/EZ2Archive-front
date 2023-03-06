/*eslint-disable*/

const MyTier = () => {
  return (
    <div className="rank-order-selector-wrapper">
      <div className="rank-order-selector">
        <div className="tier-box-items tier-title border-right">
          {/* 현재 하드코딩된 상태. 향후 변경할 것! */}
          <h4>티어</h4>
          <div className="tierimg">
            <img src={process.env.PUBLIC_URL + '/tiertag/master3.webp'} alt="nemesis1"></img>
            <div className="testbox"></div>
          </div>
        </div>
        <div className="tier-box-items tier-key border-right">
          <div className="key-mode">
            <div><span className="link">All</span></div>
            {/* 임시로 볼드처리 시킴 */}
            <div><span className="link bold">4K</span></div>
            <div><span className="link">5K</span></div>
            <div><span className="link">6K</span></div>
            <div><span className="link">8K</span></div>
          </div>
          <div className="current-tier flex-grow-1">
            <h1 className="current-tier-title theme-pp">4K</h1>
            <h4 className="current-tier-subtitle">TIER</h4>
          </div>
          <div>
            <h3>MASTER 3</h3>
          </div>
        </div>
        <div className="tier-box-items p30">
          <table>
            <tbody>
              <tr>
                <td className="theme-pp">DJ Name.</td>
                <td>FOX-B</td>
              </tr>
              <tr>
                <td className="theme-pp">TOP 50 합계</td>
                <td>5700.00</td>
              </tr>
              <tr>
                <td className="theme-pp">환산 포인트</td>
                <td>5100.00</td>
              </tr>
              <tr>
                <td className="theme-pp">NEXT TIER</td>
                <td>MASTER 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyTier