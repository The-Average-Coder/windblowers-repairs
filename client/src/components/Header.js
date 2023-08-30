import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import '../stylesheets/Header.css';
import brand from '../images/brand.png';
import logo500white from '../images/logo500white.png';
import menuIcon from '../images/menuIcon.png';
import searchIcon from '../images/searchIcon.png';
import backIcon from '../images/backIcon.png';


function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();

  const navBar = useRef(null);

  function toggleSearchMode(e) {
    e.stopPropagation()
    setMobileMenu(false)
    setSearchMode(!searchMode);
  }

  function toggleMobileMenu() {
    setMobileMenu(!mobileMenu);
  }

  function handleSearchChange(e) {
    setSearchInput(e.target.value);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate(`/results/${searchInput}`, { replace: true });
    setSearchInput('');
    setSearchMode(false);
  }

  return <><div className='header'>
    <ul className='navBar' ref={navBar}>
      { searchMode ? <>
        <li className='exitMobileSearch'><button onClick={toggleSearchMode}><img src={backIcon} alt='Back' /></button></li>
        <form className='mobileSearchForm' onSubmit={handleSearchSubmit}>
          <input type='text' placeholder='Search' className='mobileSearchBar' value={searchInput} onChange={handleSearchChange} maximumScale={1} />
        </form>
        </>
        : <>
        <li className='home' onClick={() => {setMobileMenu(false)}}><Link to='/'><img className='brand' src={brand} alt='Brand' /></Link></li>
        <li className='mobileHome' onClick={() => {setMobileMenu(false)}}><Link to='/'><img className='icon' src={logo500white} alt='Logo' /></Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/repairs">Repairs</Link></li>
        <li><Link to="/customers">Customers</Link></li>

        <li className='settingsNav'><Link to="/settings">Settings</Link></li>
        <li className='mobileMenuButton'><button onClick={toggleMobileMenu}><img src={menuIcon} alt='Menu' /></button></li>
        <li className='mobileSearch'><button onClick={toggleSearchMode}><img src={searchIcon} alt='Search' /></button></li>
        

        <form className='searchForm' onSubmit={handleSearchSubmit}>
          <input type='text' placeholder='Search' className='searchBar' value={searchInput} onChange={handleSearchChange} maximumScale={1} />
        </form>
        </>
      }
      
    </ul>
  </div>
  
  { mobileMenu ? <>
    <ul className='mobileMenu'>
        <li><Link to="/dashboard" onClick={() => {setMobileMenu(false)}}>DASHBOARD</Link></li>
        <li><Link to="/repairs" onClick={() => {setMobileMenu(false)}}>REPAIRS</Link></li>
        <li><Link to="/customers" onClick={() => {setMobileMenu(false)}}>CUSTOMERS</Link></li>
        <li><Link to="/settings" onClick={() => {setMobileMenu(false)}}>SETTINGS</Link></li>
    </ul>
    </>
    : null }</>
}

export default Header;