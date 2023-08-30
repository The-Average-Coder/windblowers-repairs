import Header from './Header';
import Main from './Main';
import LockScreen from './LockScreen';
import '../stylesheets/App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    readCookie();
  }, [])

  const readCookie = () => {
    Axios.get('/read-cookie').then((response) => {
      if (response.data === 'user') {
        setLoggedIn(true);
      }
    });
  }

  function login() {
    setLoggedIn(true);
  }

  function logout() {
    Axios.get('/clear-cookie').then((response) => {
      setLoggedIn(false);
    })
  }

  return <>
    {loggedIn ?
      <>
        <Header />
        <Main logout={logout} />
      </>
    :
      <>
        <LockScreen login={login} />
      </>
    }
  </>
    
}

export default App;
