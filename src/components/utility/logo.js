import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import logo from '../../images/logo-seventoolkit.png'
import asponLogo from '../../images/aspon_logo_w.png'
import { setSelectedMenu} from '../../actions'
function Logo({props}) {
  return (
    <div
      className="isoLogoWrapper"
    >
      <h3>
        <Link onClick={() => props.setSelectedMenu(['performance'])} to="/">
          
          <img alt="logo" src={logo} className="logo-csr" style={{width: '120'}} />
        </Link>
      </h3>
    </div>
  )
}

export default connect(null, { setSelectedMenu})(Logo)
