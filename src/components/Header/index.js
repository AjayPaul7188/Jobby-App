import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="link-item">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="menu-list-lg">
          <Link to="/" className="link-item">
            <li className="each-list">Home</li>
          </Link>
          <Link to="/jobs" className="link-item">
            <li className="each-list">Jobs</li>
          </Link>
        </ul>

        <button className="logout-btn-lg" type="button" onClick={onClickLogout}>
          Logout
        </button>

        <ul className="menu-list-sm">
          <Link to="/" className="link-item">
            <li className="each-list">
              <AiFillHome className="menu-icon" />
            </li>
          </Link>

          <Link to="/jobs" className="link-item">
            <li className="each-list">
              <BsFillBriefcaseFill className="menu-icon" />
            </li>
          </Link>

          <li className="each-list">
            <button
              type="button"
              className="logout-btn-sm"
              onClick={onClickLogout}
            >
              <FiLogOut className="menu-icon" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
