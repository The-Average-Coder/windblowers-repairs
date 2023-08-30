import '../stylesheets/Dashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import fluteIcon from '../images/fluteIcon.png';
import oboeIcon from '../images/oboeIcon.png';
import clarinetIcon from '../images/clarinetIcon.png';
import bassoonIcon from '../images/bassoonIcon.png';
import saxophoneIcon from '../images/saxophoneIcon.png';

function Dashboard() {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        Axios.get("/api/notifications/get").then((response) => {
            setNotifications(response.data);
        })
    }

    const instrumentSymbol = { 
        'concert flute': fluteIcon,
        'piccolo': fluteIcon,
        'alto flute': fluteIcon,
        'bass flute': fluteIcon,
        'flute (other)': fluteIcon,
        'oboe': oboeIcon,
        'cor anglais': oboeIcon,
        'oboe (other)': oboeIcon,
        'b♭ clarinet': clarinetIcon,
        'a clarinet': clarinetIcon,
        'e♭ clarinet': clarinetIcon,
        'alto clarinet': clarinetIcon,
        'bass clarinet': clarinetIcon,
        'contrabass clarinet': clarinetIcon,
        'clarinet (other)': clarinetIcon,
        'soprano recorder': clarinetIcon,
        'alto recorder': clarinetIcon,
        'tenor recorder': clarinetIcon,
        'bass recorder': clarinetIcon,
        'recorder (other)': clarinetIcon,
        'bassoon': bassoonIcon,
        'bassoon (other)': bassoonIcon,
        'soprano saxophone': saxophoneIcon,
        'alto saxophone': saxophoneIcon,
        'tenor saxophone': saxophoneIcon,
        'baritone saxophone': saxophoneIcon,
        'bass saxophone': saxophoneIcon,
        'saxophone (other)': saxophoneIcon,
    }

    const clearNotification = (e, notificationId) => {
      e.stopPropagation();
      e.preventDefault();

      Axios.delete(`/api/notifications/delete/${notificationId}`).then((response) => {
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
      })
    }

    return <div className='dashboard__page'>
        <div className='sideBar'> 
            <p></p>
        </div>
        <div className='panel'>
            <div className='titleBlock'>
                <p className='title'>Dashboard</p>
                <p className='description'>Welcome back to the dashboard.</p>
            </div>
            <div className='contentBlock'>
                <div className='notificationBlock'>
                    <p className='notificationBlockTitle'>Notifications:</p>
                    <div className='notificationsList'>
                        {notifications.length > 0 ? notifications.reverse().map((notification) => {
                            return [
                                <Link className='notificationsListElement' to={`/repair/${notification.repair_id}`}>
                                    <img className='notificationsListElementIcon' src={instrumentSymbol[notification.instrument]} alt='' />
                                    <p className='notificationsListElementTitle'>{notification.title}</p>
                                    <p className='notificationsListElementJobNumber'>{notification.job_number}</p>
                                    <button className='notificationsListElementClear' onClick={(e) => {clearNotification(e, notification.id)}}>Clear</button>
                                </Link>
                            ]
                        }) : <p>No Notifications</p>}
                    </div>
                </div>
                <div className='otherBlock'>
                    <p></p>
                </div>
            </div>
        </div>
    </div>
}

export default Dashboard;