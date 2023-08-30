import { useState, useEffect } from 'react';
import Axios from "axios";
import '../stylesheets/Settings.css'
import plusSymbol from '../images/plusIcon.png';
import bcrypt from 'bcryptjs';

function Settings(props) {
    const [repairers, setRepairers] = useState([]);
    const [newRepairerName, setNewRepairerName] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [passwordsDidntMatch, setPasswordsDidntMatch] = useState(false);
    const [successfullyChangedPassword, setSuccessfullyChangedPassword] = useState(false);

    useEffect(() => {
        Axios.get('/api/repairers/get').then((response) => {
            setRepairers(response.data);
        })
    }, []);

    const deleteRepairer = (id) => {
        Axios.delete(`/api/repairers/deleteRepairer/${id}`).then((response) => {
            setRepairers(repairers.filter(repairer => repairer.id !== id));
        })
    }

    const createRepairer = (e) => {
        e.preventDefault();

        Axios.post('/api/repairers/newRepairer', {repairerName: newRepairerName}).then((response) => {
            setRepairers([
                ...repairers,
                { id: response.data.id, name: newRepairerName }
            ]);
            setNewRepairerName('');
        })
    }

    const requestChangePassword = async (e) => {
        e.preventDefault();
        setSuccessfullyChangedPassword(false);

        if (newPassword === newPasswordConfirm) {
            setPasswordsDidntMatch(false);
            const hashedPassword = bcrypt.hashSync(newPassword, '$2a$10$CwTycUXWue0Thq9StjUM0u');
            Axios.put('/api/authentication/updatePassword', {password: hashedPassword}).then((response) => {
                setSuccessfullyChangedPassword(true);
            })
        }
        else {
            setPasswordsDidntMatch(true);
        }

        setNewPassword('');
        setNewPasswordConfirm('');
    }

    return <div className="settings__page">
        <div className='settings__mainPanel'>
            <p className='repairsListTitle'>Repairers</p>
            <div className='settings__repairerList'>
                <form className='settings__newRepairerForm' onSubmit={createRepairer}>
                    <input type='text' className='settings__newRepairerInput' value={newRepairerName} onChange={(e) => setNewRepairerName(e.target.value)} placeholder='New Repairer Name'/>
                    <button className='settings__newRepairerButton' type='submit'><img src={plusSymbol} /><p>Add New Repairer</p></button>
                </form>
                {repairers.map((val) => {
                    return <div className='settings__repairerElement'>
                        <p className='settings__repairerTitle'>{val.name}</p>
                        <button className='submitButton' onClick={() => {deleteRepairer(val.id)}}>Delete</button>
                    </div>
                })}
            </div>
            <p className='repairsListTitle'>Password</p>
            <form className='settings__changePasswordForm' onSubmit={requestChangePassword}>
                { passwordsDidntMatch ? <p style={{margin: '0', color: 'red'}}>Error: Passwords didn't match</p> : null}
                { successfullyChangedPassword ? <p style={{margin: '0'}}>successfully changed password</p> : null}
                <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' required/><br />
                <input type='password' value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder='Confirm New Password' required/><br />
                <button className='submitButton'>Save</button>
            </form>
            <button className='submitButton' style={{marginLeft: '30px', marginTop: '50px'}} onClick={props.logout}>Logout</button>
        </div>
    </div>;
}

export default Settings;