import '../stylesheets/LockScreen.css';
import brandred from '../images/brand-red.png';
import { useState } from 'react';
import Axios from 'axios';
import bcrypt from 'bcryptjs';

function LockScreen(props) {
  const [loginAnimation, setLoginAnimation] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);

  function handlePasswordInputChange(e) {
    setPasswordInput(e.target.value);
  }

  async function submitPasswordInput(e) {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(passwordInput, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    try {
      const res = await Axios.get('/authenticate', { auth: { username: 'user', password: hashedPassword } });
      if (res.data === 'user') {
        setLoginAnimation(1);
      }
    } catch (e) {
      setPasswordInput('');
    }
  }

  function checkCapsLock(event) {
    if (event.getModifierState("CapsLock")) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  }

  function resetCapsLockWarning() {
    setCapsLockOn(false);
  }

  return <div className='lockScreen'>
    <div className='background' onAnimationEnd={props.login} loginAnimation={loginAnimation}>
    </div>
    <form className='loginForm' onSubmit={submitPasswordInput} loginAnimation={loginAnimation}>
      <img className='loginFormLogo' src={brandred} loginAnimation={loginAnimation} />
      {capsLockOn ? <p className='capsLockWarning'>Caps Lock Is On</p> : null}
      <input className='passwordInput' type='password' placeholder='Password' value={passwordInput} onChange={handlePasswordInputChange} onBlur={resetCapsLockWarning} onKeyUp={checkCapsLock} onClick={checkCapsLock} loginAnimation={loginAnimation} maximumScale={1} /><br/>
      <input className='loginButton' type='submit' value='Log In' loginAnimation={loginAnimation} />
    </form>
  </div>;
}

export default LockScreen;