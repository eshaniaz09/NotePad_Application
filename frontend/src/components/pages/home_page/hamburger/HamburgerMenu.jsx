import React from 'react'
import "./hamburgerMenu.css"

const HamburgerMenu = () => {
  return (
    <div className='hamburgerMenu'>
      <ul className='hamburger-ul'>
        <li className='hamburger-ul-li'>Create</li>
        <li className='hamburger-ul-li'>Read</li>
        <li className='hamburger-ul-li'>Update</li>
      </ul>
    </div>
  )
}

export default HamburgerMenu
