/*eslint-disable*/

import { useState } from 'react';
import { useSelector } from 'react-redux';

const Footer = () => {
  const state = useSelector(state => state);
  const [close, setClose] = useState(false);
  const date = new Date();
  const year = date.getFullYear();
  const { manageMode } = state.userinfo;

  return !manageMode ? (
    <footer>
      <div className="container">
        <div className="footer">
          <div>
            <p>
              본 사이트는 게임 <strong>「EZ2ON REBOOT:R」</strong>의 팬 사이트이며,
              <br></br>사이트 내 사용된 모든 게임 컨텐츠의 저작권은{' '}
              <strong>NEONOVICE</strong>에 있습니다.
            </p>
          </div>
          <div>
            <p>
              ©️ {year} <strong>EZ2ARCHIVE</strong>
              <br></br>© 2020 <strong>NEONOVICE</strong> & ©️ 2011-{year}{' '}
              <strong>SQUARE PIXELS</strong> All Rights Reserved.
            </p>
            <p>
              Special Thanks to{' '}
              <strong>
                <a
                  href="https://twitter.com/suisou610"
                  target="_blank"
                  className="text-underline"
                >
                  수조
                </a>
              </strong>
            </p>
          </div>
        </div>
      </div>
      {close ? null : (
        <div className="no-support">
          <span>본 사이트는 반응형 페이지를 지원하지 않습니다.</span>
          <button
            onClick={() => {
              setClose(true);
            }}
          >
            [닫기]
          </button>
        </div>
      )}
    </footer>
  ) : null;
};

export default Footer;
