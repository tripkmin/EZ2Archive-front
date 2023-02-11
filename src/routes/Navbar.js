/*eslint-disable*/

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { switchLoginModal } from "../store"

function Navbar(){

  let navigate = useNavigate()
  let state = useSelector( (state) => state )
  let dispatch = useDispatch()
  return (
    <header>
      <nav className="nav-wrapper theme-pp-shadow">
        <div className="container">
          <div className="nav">
            <img className="logo" src={process.env.PUBLIC_URL + '/navbar/ez2archive_logo.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div className="category-box">
              <span className="category-link" onClick={()=>{ alert('준비 중입니다') }}>성과표</span>
              <span className="category-link" onClick={()=>{ navigate('/rank')}}>서열표</span>
              <span className="category-link" onClick={()=>{ navigate('/tier')}}>티어표</span>
              <span className="category-link" onClick={()=>{ alert('준비 중입니다') }}>안내</span>
            </div>
            <img className="pp-navbar-pattern" src={process.env.PUBLIC_URL + '/navbar/Asset 1.svg'} alt="logo" onClick={()=>{ navigate('/') }}></img>
            <div>
              <span className="category-link" onClick={()=>{ dispatch(switchLoginModal()) }}>로그인</span>
              <span className="category-link" onClick={()=>{ navigate('/signin') }}>회원가입</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar