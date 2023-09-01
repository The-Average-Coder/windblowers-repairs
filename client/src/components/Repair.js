import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Select from 'react-select';
import '../stylesheets/Repair.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Repair() {
    const { repairId } = useParams();

    const navigate = useNavigate();

    const [invalidJob, setInvalidJob] = useState(false);
    const [repair, setRepair] = useState({});
    const [repairStatus, setRepairStatus] = useState('');
    const [repairJobNumber, setRepairJobNumber] = useState('');
    const [repairCustomerId, setRepairCustomerId] = useState('');
    const [repairInstrument, setRepairInstrument] = useState('');
    const [repairManufacturer, setRepairManufacturer] = useState('');
    const [repairModel, setRepairModel] = useState('');
    const [repairSerialNumber, setRepairSerialNumber] = useState('');
    const [repairNotes, setRepairNotes] = useState('');
    const [repairDateCreated, setRepairDateCreated] = useState('');

    const [repairHasBeenAssessed, setRepairHasBeenAssessed] = useState(false);
    
    const [repairExpectedTimeHours, setRepairExpectedTimeHours] = useState('0');
    const [repairExpectedTimeMinutes, setRepairExpectedTimeMinutes] = useState('0');
    const [repairExpectedTime, setRepairExpectedTime] = useState(0);
    const [repairCostForTime, setRepairCostForTime] = useState('0');
    const [repairNotesForMaterials, setRepairNotesForMaterials] = useState('');
    const [repairCostOfMaterialsForUs, setRepairCostOfMaterialsForUs] = useState('0');
    const [repairCostOfMaterialsForCustomer, setRepairCostOfMaterialsForCustomer] = useState('0');
    const [repairAssessmentNotes, setAssessmentNotes] = useState('');

    const [repairHasBeenAllocated, setRepairHasBeenAllocated] = useState(false);

    const [repairRepairerId, setRepairRepairerId] = useState('');
    const [repairDeadline, setRepairDeadline] = useState('');

    const [repairHasBeenUpdated, setRepairHasBeenUpdated] = useState(false);

    const [repairUpdatedExpectedTimeHours, setRepairUpdatedExpectedTimeHours] = useState(0);
    const [repairUpdatedExpectedTimeMinutes, setRepairUpdatedExpectedTimeMinutes] = useState(0);
    const [repairUpdatedExpectedTime, setRepairUpdatedExpectedTime] = useState(0);
    const [repairUpdatedCostForTime, setRepairUpdatedCostForTime] = useState('');
    const [repairUpdatedCostOfMaterialsForUs, setRepairUpdatedCostOfMaterialsForUs] = useState('');
    const [repairUpdatedCostOfMaterialsForCustomer, setRepairUpdatedCostOfMaterialsForCustomer] = useState('');

    const [repairOpenJobNotes, setRepairOpenJobNotes] = useState('');
    const [repairOpenJobTimer, setRepairOpenJobTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const [repairHasBeenRequestedFinished, setRepairHasBeenRequestedFinished] = useState(false);

    const [repairDateFinished, setRepairDateFinished] = useState('');
    const [repairDateCollected, setRepairDateCollected] = useState('');

    const [invalidCustomer, setInvalidCustomer] = useState(false);
    const [customer, setCustomer] = useState({});
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerFirstname, setCustomerFirstname] = useState('');
    const [customerTelephone, setCustomerTelephone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress ] = useState('');

    const [invalidRepairer, setInvalidRepairer] = useState(false);
    const [repairer, setRepairer] = useState({});
    const [repairerName, setRepairerName] = useState('');
    
    const [customerList, setCustomerList] = useState([])
    const [customerOptions, setCustomerOptions] = useState([]);

    const [repairerList, setRepairerList] = useState([]);
    const [repairerOptions, setRepairerOptions] = useState([]);

    const [editMode, setEditMode] = useState(false);
    const [changingCustomer, setChangingCusomer] = useState(false);
    const [assessmentMode, setAssessmentMode] = useState(false);
    const [updateAssessmentMode, setUpdateAssessmentMode] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);

    const [repairDates, setRepairDates] = useState([]);

    const [deleteConfirmationBox, setDeleteConfirmationBox] = useState(false);

    useEffect(() => {
        loadRepair();
        loadCustomers();
        loadRepairers();
        loadCalendarEvents();
    }, []);

    useEffect(() => {
        let intervalId;
        if (timerRunning) {
            intervalId = setInterval(() => {
                Axios.put('/api/repairs/updateTimer', {
                    repairId: repairId,
                    repairTimer: repairOpenJobTimer + 1
                })
                setRepairOpenJobTimer(parseInt(repairOpenJobTimer) + 1)
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [timerRunning, repairOpenJobTimer])

    const loadRepair = () => {
        Axios.get(`/api/repairs/getJob/${repairId}`).then((response) => {
            if (response.data.length === 0) {
                setInvalidJob(true);
            }
            else {
                setRepair(response.data[0]);
                setRepairStatus(response.data[0].status);
                setRepairJobNumber(response.data[0].job_number);
                setRepairCustomerId(response.data[0].customer_id);
                setRepairInstrument(response.data[0].instrument);
                setRepairManufacturer(response.data[0].manufacturer);
                setRepairModel(response.data[0].model);
                setRepairSerialNumber(response.data[0].serial_number);
                setRepairNotes(response.data[0].notes);
                setRepairHasBeenAssessed(!!response.data[0].has_been_assessed);
                setRepairHasBeenAllocated(!!response.data[0].has_been_allocated);
                setRepairHasBeenUpdated(!!response.data[0].has_been_updated);
                setRepairHasBeenRequestedFinished(!!response.data[0].has_been_requested_finished)
                setRepairDateCreated(response.data[0].date_created);
                setInvalidJob(false);

                if (!!response.data[0].has_been_assessed) {
                    setRepairExpectedTimeHours(Math.floor(response.data[0].expected_time / 60).toString());
                    setRepairExpectedTimeMinutes((response.data[0].expected_time % 60).toString());
                    setRepairExpectedTime(response.data[0].expected_time)
                    setRepairCostForTime(response.data[0].cost_for_time); 
                    setRepairNotesForMaterials(response.data[0].materials_notes);
                    setRepairCostOfMaterialsForUs(response.data[0].materials_cost_us);
                    setRepairCostOfMaterialsForCustomer(response.data[0].materials_cost_customer);
                    setAssessmentNotes(response.data[0].misc_notes);
                    
                    if (!!response.data[0].has_been_allocated) {
                        setRepairRepairerId(response.data[0].repairer_id);
                        setRepairDeadline(new Date(response.data[0].deadline));
                        setRepairOpenJobNotes(response.data[0].open_job_notes);
                        setRepairOpenJobTimer(response.data[0].timer)

                        loadRepairer(response.data[0].repairer_id)
                    }

                    if (!!response.data[0].has_been_updated) {
                        setRepairUpdatedExpectedTimeHours(Math.floor(response.data[0].updated_expected_time / 60).toString());
                        setRepairUpdatedExpectedTimeMinutes((response.data[0].updated_expected_time % 60).toString());
                        setRepairUpdatedExpectedTime(response.data[0].updated_expected_time);
                        setRepairUpdatedCostForTime(response.data[0].updated_cost_for_time);
                        setRepairUpdatedCostOfMaterialsForUs(response.data[0].updated_materials_cost_us);
                        setRepairUpdatedCostOfMaterialsForCustomer(response.data[0].updated_materials_cost_customer);
                    }
                    else {
                        setRepairUpdatedExpectedTimeHours(Math.floor(response.data[0].expected_time / 60).toString());
                        setRepairUpdatedExpectedTimeMinutes((response.data[0].expected_time % 60).toString());
                        setRepairUpdatedExpectedTime(response.data[0].expected_time);
                        setRepairUpdatedCostForTime(response.data[0].cost_for_time);
                        setRepairUpdatedCostOfMaterialsForUs(response.data[0].materials_cost_us);
                        setRepairUpdatedCostOfMaterialsForCustomer(response.data[0].materials_cost_customer);
                    }
                }

                if (response.data[0].status === 'complete') {
                    setRepairDateFinished(response.data[0].date_finished);
                }

                if (response.data[0].status === 'collected') {
                    setRepairDateFinished(response.data[0].date_finished);
                    setRepairDateCollected(response.data[0].date_collected);
                }

                loadCustomer(response.data[0].customer_id);
            }
        })
    }

    const loadCustomer = (id) => {
        Axios.get(`/api/customers/getCustomer/${id}`).then((response) => {
            if (response.data.length === 0) {
                setInvalidCustomer(true);
            }
            else {
                setCustomer(response.data[0]);
                setCustomerSurname(response.data[0].surname);
                setCustomerFirstname(response.data[0].firstname);
                setCustomerTelephone(response.data[0].telephone);
                setCustomerEmail(response.data[0].email);
                setCustomerAddress(response.data[0].address);
                setInvalidCustomer(false);
            }
        })
    }

    const loadRepairer = (id) => {
        Axios.get(`/api/repairers/getRepairer/${id}`).then((response) => {
            if (response.data.length === 0) {
                setInvalidRepairer(true);
            }
            else {
                setRepairer(response.data[0]);
                setRepairerName(response.data[0].name);
            ;}
        })
    }

    const loadCustomers = () => {
        Axios.get("/api/customers/get").then((response) => {
          setCustomerList(response.data);
          let listOfCustomers = []
          response.data.forEach(element => {
            listOfCustomers.push({ value: element.id, label: `${element.firstname} ${element.surname}, ${element.telephone}` });
          })
          setCustomerOptions(listOfCustomers);
        });
    }

    const loadRepairers = () => {
        Axios.get("/api/repairers/get").then((response) => {
          setRepairerList(response.data);
          let listOfRepairers = []
          response.data.forEach(element => {
            listOfRepairers.push({ value: element.id, label: element.name });
          })
          setRepairerOptions(listOfRepairers);
        });
    }

    const loadCalendarEvents = () => {
        Axios.get("/api/calendarEvents/get").then((response) => {
          setCalendarEvents(response.data);
          setRepairDates(response.data.filter(event => event.repair_id == repairId))
        });
    }

    const toggleEditMode = () => {
        if (editMode === true) {
            setChangingCusomer(false);
            setRepairManufacturer(repair.manufacturer);
            setRepairModel(repair.model);
            setRepairSerialNumber(repair.serial_number);
            setRepairNotes(repair.notes);
        }
        setEditMode(!editMode);
    }

    const submitRepairEdit = () => {
        Axios.put('/api/repairs/editDetails', {
            repairId: repairId,
            repairInstrument: repairInstrument,
            repairManufacturer: repairManufacturer,
            repairModel: repairModel,
            repairSerialNumber: repairSerialNumber,
            repairNotes: repairNotes
        }).then((response) => {
            loadRepair();
        })

        setEditMode(false);
    }

    const toggleChangeCustomer = () => {
        setChangingCusomer(!changingCustomer);
    }

    const submitCustomerChange = () => {
        Axios.get(`/api/customers/getCustomer/${repairCustomerId}`).then((response) => {
            if (response.data.length === 0) {
                setInvalidCustomer(true);
            }
            else {
                setCustomer(response.data[0]);
                setCustomerSurname(response.data[0].surname);
                setCustomerFirstname(response.data[0].firstname);
                setCustomerTelephone(response.data[0].telephone);
                setCustomerEmail(response.data[0].email);
                setCustomerAddress(response.data[0].address);
                setInvalidCustomer(false);

                Axios.put('/api/repairs/updateCustomer', {customerId: response.data[0].id, repairId: repairId}).then((updateReponse) =>  {

                });
            }
        })

        setChangingCusomer(false);
    }

    const submitAssessment = () => {
        Axios.put('/api/repairs/assess', {
            repairId: repairId,
            repairExpectedTime: repairExpectedTime,
            repairCostForTime: repairCostForTime,
            repairNotesForMaterials: repairNotesForMaterials,
            repairCostOfMaterialsForUs: repairCostOfMaterialsForUs,
            repairCostOfMaterialsForCustomer: repairCostOfMaterialsForCustomer,
            repairAssessmentNotes: repairAssessmentNotes
        });
        setRepairHasBeenAssessed(true);
        setAssessmentMode(false);
        repair.has_been_assessed = 1;
        repair.expected_time = repairExpectedTime;
        repair.cost_for_time = repairCostForTime;
        repair.materials_notes = repairNotesForMaterials;
        repair.materials_cost_us = repairCostOfMaterialsForUs;
        repair.materials_cost_customer = repairCostOfMaterialsForCustomer;
        repair.misc_notes = repairAssessmentNotes;
        sendNotification('Job Assessed - Ready To Notify Customer');
    }

    const titleCase = (str) => {
        return str.toLowerCase().split(' ').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }

    const customerSelectionStyles = {

        option: (defaultStyles, state) => ({
          ...defaultStyles,
          color: "#000000",
          fontSize: "16px",
          backgroundColor: state.isSelected ? "#d5d5d5" : state.isFocused ? "#e2e2e2" : "#e7e7e7",
        }),
    
        menu: (defaultStyles) => ({
          ...defaultStyles,
          backgroundColor: "#e7e7e7",
        }),
    
        control: (defaultStyles) => ({
          ...defaultStyles,
          fontSize: "16x",
          backgroundColor: "#e7e7e7",
          border: "1px solid #8a8a8a",
          borderRadius: "6px",
        }),
    
        valueContainer: (defaultStyles) => ({
          ...defaultStyles,
          padding: "0 6px"
        }),
    
        singleValue: (defaultStyles) => ({
          ...defaultStyles,
          fontSize: "16px"
        }),
    }

    const toggleAssessMode = () => {
        if (assessmentMode === true) {
            setRepairExpectedTimeHours('0');
            setRepairExpectedTimeMinutes('0');
            updateTimeExpected('0', '0');
            setRepairNotesForMaterials('');
            setRepairCostOfMaterialsForUs('');
            setRepairCostOfMaterialsForCustomer('');
            setAssessmentNotes('');
        }
        setAssessmentMode(!assessmentMode);
    }

    const toggleEditAssessmentMode = () => {
        if (assessmentMode === true) {
            const hours = Math.floor(repair.expected_time / 60).toString();
            const minutes = (repair.expected_time % 60).toString(); 
            setRepairExpectedTimeHours(hours);
            setRepairExpectedTimeMinutes(minutes);
            setRepairExpectedTime(0);
            setRepairCostForTime(repair.cost_for_time);
            setRepairNotesForMaterials(repair.materials_notes);
            setRepairCostOfMaterialsForUs(repair.materials_cost_us);
            setRepairCostOfMaterialsForCustomer(repair.materials_cost_customer);
            setAssessmentNotes(repair.misc_notes);
        }
        setAssessmentMode(!assessmentMode);
    }

    const updateTimeExpectedHours = (e) => {
        setRepairExpectedTimeHours(e.target.value);
        updateTimeExpected(e.target.value, repairExpectedTimeMinutes);
    }

    const updateTimeExpectedMinutes = (e) => {
        setRepairExpectedTimeMinutes(e.target.value);
        updateTimeExpected(repairExpectedTimeHours, e.target.value);
    }

    const updateTimeExpected = (hours, minutes) => {
        const newRepairExpectedTime = parseInt(hours) * 60 + parseInt(minutes);
        setRepairExpectedTime(newRepairExpectedTime);
        setRepairCostForTime(newRepairExpectedTime / 60 * 40);
    }

    const updateUpdatedTimeExpectedHours = (e) => {
        setRepairUpdatedExpectedTimeHours(e.target.value);
        updateUpdatedTimeExpected(e.target.value, repairUpdatedExpectedTimeMinutes);
    }

    const updateUpdatedTimeExpectedMinutes = (e) => {
        setRepairUpdatedExpectedTimeMinutes(e.target.value);
        updateUpdatedTimeExpected(repairUpdatedExpectedTimeHours, e.target.value);
    }

    const updateUpdatedTimeExpected = (hours, minutes) => {
        const newRepairUpdatedExpectedTime = parseInt(hours) * 60 + parseInt(minutes);
        setRepairUpdatedExpectedTime(newRepairUpdatedExpectedTime);
        setRepairUpdatedCostForTime(newRepairUpdatedExpectedTime / 60 * 40);
    }

    const openJob = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'open' });
        setRepairStatus('open');
        repair.status = 'open';
    }

    const closeJob = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'closed' });
        setRepairStatus('closed');
        repair.status = 'closed';
    }

    const unCloseJob = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'assessment / quote' });
        setRepairStatus('assessment / quote');
        repair.status = 'assessment / quote';
    }

    const allocateJob = (e) => {
        e.preventDefault();
        Axios.put('/api/repairs/allocate', { repairId: repairId, repairRepairerId: repairRepairerId, repairDeadline: repairDeadline, repairUnallocatedTime: repairExpectedTime}).then((response) => {
            setRepairHasBeenAllocated(true);
            loadRepairer(repairRepairerId);
        });
    }

    const toggleUpdateJobAssessment = () => {
        setUpdateAssessmentMode(!updateAssessmentMode);
    }

    const updateJobAssessment = () => {
        setRepairHasBeenUpdated(true);
        setUpdateAssessmentMode(false);
        Axios.get(`/api/repairs/getJob/${repairId}`).then((response) => {
            const newRepairUnallocatedTime = response.data[0].unallocated_time_calendar + (!!response.data[0].has_been_updated ? repairUpdatedExpectedTime - response.data[0].updated_expected_time : repairUpdatedExpectedTime - response.data[0].expected_time);
            
            Axios.put('/api/repairs/updateUnallocatedTime', { repairId: repairId, repairUnallocatedTime: newRepairUnallocatedTime })
            
        
            Axios.put('/api/repairs/updateAssessment', { 
                repairId: repairId, 
                repairUpdatedExpectedTime: repairUpdatedExpectedTime, 
                repairUpdatedCostForTime: repairUpdatedCostForTime,
                repairUpdatedCostOfMaterialsForUs: repairUpdatedCostOfMaterialsForUs,
                repairUpdatedCostOfMaterialsForCustomer: repairCostOfMaterialsForCustomer
            });
        })
    }

    const startTimer = () => {
        setTimerRunning(true);
    }

    const stopTimer = () => {
        setTimerRunning(false);
    }

    const statusColor = {
        'assessment / quote': 'red',
        'open': 'orange',
        'closed': 'gray',
        'complete': 'limegreen',
        'collected': 'black'
    }

    const updateOpenJobNotes = () => {
        Axios.put('/api/repairs/updateOpenJobNotes', { repairId: repairId, repairOpenJobNotes: repairOpenJobNotes })
    }

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    const requestFinishJob = () => {
        Axios.put('/api/repairs/requestFinish', { repairId: repairId }).then((response) => {
            setRepairHasBeenRequestedFinished(true);
            sendNotification('Job Ready To Be Signed Off');
        });
    }

    const cancelRequestFinishJob = () => {
        Axios.put('/api/repairs/cancelRequestFinish', { repairId: repairId }).then((response) => {
            setRepairHasBeenRequestedFinished(false);
        });
    }

    const finishJob = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'complete' }).then((response) => {
            setRepairStatus('complete');
            setRepairDateFinished(new Date().toISOString().slice(0, 19).replace('T', ' '));
            Axios.put(`/api/repairs/setDateFinished/${repairId}`);
            Axios.put('/api/calendarEvents/updateColor', { repairId: repairId, eventColor: 'gray' })
        });
        sendNotification('Job Complete And Ready To Be Collected');
    }

    const unFinishJob = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'open' }).then((response) => {
            setRepairStatus('open');
            cancelRequestFinishJob();
            Axios.put('/api/calendarEvents/updateColor', { repairId: repairId, eventColor: 'orange' })
        });
    }

    const instrumentCollected = () => {
        Axios.put('/api/repairs/updateStatus', { repairId: repairId, repairStatus: 'collected' }).then((response) => {
            setRepairStatus('collected');
            setRepairDateCollected(new Date().toISOString().slice(0, 19).replace('T', ' '));
            Axios.put(`/api/repairs/setDateCollected/${repairId}`);
        });
    }

    const getRepairDateRange = () => {
        let earliest = new Date(repairDates[0].start), latest = new Date(repairDates[0].end);
        latest.setDate(latest.getDate() - 1);
        repairDates.forEach((repairEvent) => {
            if (new Date(repairEvent.start) < earliest) {
                earliest = new Date(repairEvent.start);
            }
            let repairEventEnd = new Date(repairEvent.end);
            repairEventEnd.setDate(repairEventEnd.getDate() - 1)
            if (repairEventEnd > latest) {
                latest = new Date(repairEvent.end);
            }
        })
        if (earliest < latest) {
            return `${earliest.toDateString()} - ${latest.toDateString()}`;
        }
        return earliest.toDateString();
    }

    const sendNotification = (title) => {
        Axios.post('/api/notifications/new', {
            notificationRepairId: repairId,
            notificationTitle: title,
            notificationInstrument: repairInstrument,
            notificationJobNumber: repairJobNumber
        })
    }

    const calendarEventContent = (arg) => {
        let date = new Date(arg.date);
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);
        const events = calendarEvents.filter(event => event.start === date);
        let totalTime = 0;
        events.forEach(event => totalTime += event.time);
        return (<>
          { totalTime > 0 ?
            <p style={{color: totalTime > 300 ? 'red' :  'black', borderColor: totalTime > 300 ? 'red' :  'black'}} className='calendarTotalTime'>{Math.floor(totalTime / 60)} Hrs {totalTime % 60} Mins</p>
           : null }
          {arg.dayNumberText}
        </>)
      }

    const requestDeleteJob = () => {
        setDeleteConfirmationBox(true);
    }

    const deleteJob = () => {
        setDeleteConfirmationBox(false);
        Axios.delete(`/api/repairs/delete/${repairId}`).then((response) => {
            navigate('/repairs');
        })
    }

    return <div className="repair__page">
        <div className='repair__mainPanel'>
            {invalidJob ? <p>Job doesn't exist</p> : <>

            <p className='repair__jobTitle'>Repair Number: {repairJobNumber}<span>Date Created: {repairDateCreated.slice(8, 10)}-{repairDateCreated.slice(5, 7)}-{repairDateCreated.slice(0, 4)}</span></p>
            <button className='repair__editJobButton' type='button' onClick={toggleEditMode}>{editMode ? 'Cancel Edit' : 'Edit Details'}</button>
            <button className='repair__saveJobButton' type='button' onClick={submitRepairEdit} style={{display: editMode ? 'block' : 'none'}}>Save</button>
            <p className='repair__repairStatus' style={{backgroundColor: statusColor[repairStatus]}}>Status: {titleCase(repairStatus)}</p>
            <p className='repair__repairInstrument'>Instrument: {titleCase(repairInstrument)}</p>
            { deleteConfirmationBox ?  <div className='repair__calendarPopupContainer'>
                <div className='repair__calendarPopup' style={{width: '40%'}}>
                    <div style={{marginTop: '20px'}}>
                        <p style={{fontSize: '20px', textAlign: 'center'}}>Confirm Deletion?</p>
                        <div style={{display: 'flex'}}>
                            <button className='normalButton' style={{flex: '1'}} onClick={() => setDeleteConfirmationBox(false)}>Cancel</button>
                            <button className='submitButton' style={{marginLeft: '10px', flex: '1'}} onClick={deleteJob}>Delete</button>
                        </div>
                    </div>
                </div>
            </div> : null }

            <form className='repair__infoForm'>
                <div className='repair__infoContainer'>
                    <div className='repair__repairDetailsContainer'>
                        <input type='text' className='repair__repairManufacturer' value={repairManufacturer} onChange={(e) => { setRepairManufacturer(e.target.value) }} readOnly={!editMode} style={{width: repairManufacturer.length * 11 + 10}} />
                        <input type='text' className='repair__repairModel' value={repairModel} onChange={(e) => { setRepairModel(e.target.value) }} readOnly={!editMode} style={{width: repairModel.length * 10 + 10}} />
                        <br /><label>Serial Number: </label>
                        <input type='text' className='repair__repairSerialNumber' value={repairSerialNumber} onChange={(e) => { setRepairSerialNumber (e.target.value) }} readOnly={!editMode} style={{width: repairSerialNumber.length * 9 + 10}} />
                    </div>
                    <div className='repair__repairNotesContainer'>
                        <label>Notes:</label><br />
                        <textarea className='repair__repairNotes' placeholder='No notes' rows={3} value={repairNotes} onChange={(e) => {setRepairNotes(e.target.value)}} readOnly={!editMode} />
                    </div>
                </div>
                <div className='repair__customerInfoContainer'>
                    <p className='repair__customerName' >{customerFirstname} {customerSurname}</p>
                    <p className='repair__customerTelephone' >{customerTelephone}</p>
                    <p className='repair__customerEmail' >{customerEmail.length > 0 ? customerEmail : '<no email>'}</p>
                </div>
                <p className='repair__customerAddress' >{customerAddress.length > 0 ? customerAddress : '<no address>'}</p>
                {editMode ? <button style={{float: changingCustomer ? 'left' : 'none'}} className='repair__changeCustomerButton' type='button' onClick={toggleChangeCustomer}>{changingCustomer ? 'Cancel' : 'Change Customer'}</button> : null}
                {changingCustomer ? <button className='repair__saveCustomerChangeButton' type='button' onClick={submitCustomerChange}>Save</button> : null}
                {changingCustomer ? <Select options={customerOptions} placeholder={"Select Customer"} onChange={(option) => {setRepairCustomerId(option.value)}} styles={customerSelectionStyles} className='repair__customerDropdown' /> : null}
                
                
            </form>
            <div className='repair__instrumentAssessment'>
                <p className='repair__instrumentAssessmentTitle'>Instrument Assessment:</p>
                {
                    repairHasBeenAssessed ? 
                    <>
                    {
                        repairStatus === 'assessment / quote' ? <>

                        <button className='repair__editAssessmentButton' type='button' onClick={toggleEditAssessmentMode}>{assessmentMode ? 'Cancel Edit' : 'Edit Assessment'}</button>
                        <button className='repair__saveAssessmentChangesButton' type='button' onClick={submitAssessment} style={{display: assessmentMode ? 'block' : 'none'}}>Save</button>

                        </> : null
                    }
                    
                    
                    {
                        assessmentMode ? <>
                        
                        <div className='repair__instrumentAssessmentForm'>
                            <div className='repair__assessmentFlexContainer'>
                                <div className='repair__assessmentTime'>
                                    <label>Expected Time: </label><br />
                                    <select className="repair__assessmentHours" value={repairExpectedTimeHours} onChange={updateTimeExpectedHours} maximumScale={1} required>
                                        <option value="0" selected>0 Hours</option>
                                        <option value="1">1 Hour</option> 
                                        <option value="2">2 Hours</option> 
                                        <option value="3">3 Hours</option> 
                                        <option value="4">4 Hours</option>
                                        <option value="5">5 Hours</option>
                                        <option value="6">6 Hours</option>
                                        <option value="7">7 Hours</option>
                                        <option value="8">8 Hours</option>
                                        <option value="9">9 Hours</option>
                                        <option value="10">10 Hours</option>
                                        <option value="11">11 Hours</option>
                                        <option value="12">12 Hours</option>
                                        <option value="13">13 Hours</option>
                                        <option value="14">14 Hours</option>
                                        <option value="15">15 Hours</option>
                                        <option value="16">16 Hours</option>
                                        <option value="17">17 Hours</option>
                                        <option value="18">18 Hours</option>
                                        <option value="19">19 Hours</option>
                                        <option value="20">20 Hours</option>
                                        <option value="21">21 Hours</option>
                                        <option value="22">22 Hours</option>
                                        <option value="23">23 Hours</option>
                                        <option value="24">24 Hours</option>
                                    </select>
                                    <select className="repair__assessmentMinutes" value={repairExpectedTimeMinutes} onChange={updateTimeExpectedMinutes} maximumScale={1} required>
                                        <option value="0" selected>0 Minutes</option>
                                        <option value="15">15 Minutes</option> 
                                        <option value="30">30 Minutes</option> 
                                        <option value="45">45 Minutes</option> 
                                    </select><br />
                                    <label>Cost For Time: </label><br />
                                    <input type="text" placeholder='Cost For Time' className='repair_assessmentCostForTime' value={'£' + repairCostForTime} onChange={(e) => {setRepairCostForTime(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                </div>
                                <div className='repair__assessmentMaterials'>
                                    <label>Notes For Materials Required:</label><br />
                                    <textarea className='repair__assessmentMaterialNotes' placeholder='No notes' rows={3} value={repairNotesForMaterials} onChange={(e) => {setRepairNotesForMaterials(e.target.value)}} /><br />
                                    <label>Cost Of Materials For Us:</label><br />
                                    <input type="text" className='repair_assessmentCostForTime' value={'£' + repairCostOfMaterialsForUs} onChange={(e) => {setRepairCostOfMaterialsForUs(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                    <label>Cost Of Materials For Customer:</label><br />
                                    <input type="text" className='repair_assessmentCostForTime' value={'£' + repairCostOfMaterialsForCustomer} onChange={(e) => {setRepairCostOfMaterialsForCustomer(e.target.value.slice(1))}} maximumScale={1} required></input>
                                </div>
                            </div>
                            
                            <label>Miscellaneous Notes:</label><br />
                            <textarea className='repair__assessmentMiscNotes' placeholder='No notes' rows={3} value={repairAssessmentNotes} onChange={(e) => {setAssessmentNotes(e.target.value)}} />
                        </div>

                        
                        </> : <>
                        
                        <div className='repair__assessmentDisplay'>
                            <div className='repair__assessmentFlexContainer'>
                                <div className='repair__assessmentTime'>
                                    <p className='repair__assessmentTimeDisplay'>Expected Time: {repairExpectedTimeHours} Hours {repairExpectedTimeMinutes} Minutes</p>
                                    <p className='repair__assessmentCostForTimeDisplay'>Cost For Time: £{repairCostForTime}</p>
                                    <p className='repair__assessmentMiscNotesDisplay'><span>Miscellaneous Notes:</span><br />{repairAssessmentNotes}</p>
                                </div>
                                <div className='repair__assessmentMaterials'>
                                    <p className='repair__assessmentMaterialsDisplay'><span>Materials Notes:</span><br />{repairNotesForMaterials}</p>
                                    <p className='repair__assessmentMaterialCostForUsDisplay'>Materials Cost For Us: £{repairCostOfMaterialsForUs}</p>
                                    <p className='repair__assessmentMaterialCostForUsDisplay'>Materials Cost For Customer: £{repairCostOfMaterialsForCustomer}</p>
                                </div>
                            </div>

                            {
                                repairStatus === 'assessment / quote' ? <>
                                    <button className='repair__agreeQuoteButton' onClick={openJob}>Customer Agreed</button>
                                    <button className='repair__disagreeQuoteButton' onClick={closeJob}>Customer Disagreed</button>
                                </> : null
                            }

                            { repairStatus === 'closed' ? <>
                                <button className='normalButton' onClick={unCloseJob}>Return To Assessment Stage</button>
                            </> : null }
                        </div>
                        
                        </>
                    }
                    
                    </>
                    :
                    <>
                    <button style={{float: assessmentMode ? 'left' : 'none'}} className='repair__assessInstrumentButton' type='button' onClick={toggleAssessMode}>{assessmentMode ? 'Cancel' : 'Assess Instrument'}</button>
                    {assessmentMode ? <>

                    <button className='repair__submitAssessmentButton' onClick={submitAssessment} >Submit</button>

                    <div className='repair__instrumentAssessmentForm'>
                        <div className='repair__assessmentFlexContainer'>
                            <div className='repair__assessmentTime'>
                                <label>Time Expected: </label><br />
                                <select className="repair__assessmentHours" value={repairExpectedTimeHours} onChange={updateTimeExpectedHours} maximumScale={1} required>
                                    <option value="0" selected>0 Hours</option>
                                    <option value="1">1 Hour</option> 
                                    <option value="2">2 Hours</option> 
                                    <option value="3">3 Hours</option> 
                                    <option value="4">4 Hours</option>
                                    <option value="5">5 Hours</option>
                                    <option value="6">6 Hours</option>
                                    <option value="7">7 Hours</option>
                                    <option value="8">8 Hours</option>
                                    <option value="9">9 Hours</option>
                                    <option value="10">10 Hours</option>
                                    <option value="11">11 Hours</option>
                                    <option value="12">12 Hours</option>
                                    <option value="13">13 Hours</option>
                                    <option value="14">14 Hours</option>
                                    <option value="15">15 Hours</option>
                                    <option value="16">16 Hours</option>
                                    <option value="17">17 Hours</option>
                                    <option value="18">18 Hours</option>
                                    <option value="19">19 Hours</option>
                                    <option value="20">20 Hours</option>
                                    <option value="21">21 Hours</option>
                                    <option value="22">22 Hours</option>
                                    <option value="23">23 Hours</option>
                                    <option value="24">24 Hours</option>
                                </select>
                                <select className="repair__assessmentMinutes" value={repairExpectedTimeMinutes} onChange={updateTimeExpectedMinutes} maximumScale={1} required>
                                    <option value="0" selected>0 Minutes</option>
                                    <option value="15">15 Minutes</option> 
                                    <option value="30">30 Minutes</option> 
                                    <option value="45">45 Minutes</option> 
                                </select><br />
                                <label>Cost For Time: </label><br />
                                <input type="text" placeholder='Cost For Time' className='repair_assessmentCostForTime' value={'£' + repairCostForTime} onChange={(e) => {setRepairCostForTime(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                            </div>
                            <div className='repair__assessmentMaterials'>
                                <label>Notes For Materials Required:</label><br />
                                <textarea className='repair__assessmentMaterialNotes' placeholder='No notes' rows={3} value={repairNotesForMaterials} onChange={(e) => {setRepairNotesForMaterials(e.target.value)}} /><br />
                                <label>Cost Of Materials For Us:</label><br />
                                <input type="text" className='repair_assessmentCostForTime' value={'£' + repairCostOfMaterialsForUs} onChange={(e) => {setRepairCostOfMaterialsForUs(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                <label>Cost Of Materials For Customer:</label><br />
                                <input type="text" className='repair_assessmentCostForTime' value={'£' + repairCostOfMaterialsForCustomer} onChange={(e) => {setRepairCostOfMaterialsForCustomer(e.target.value.slice(1))}} maximumScale={1} required></input>
                            </div>
                        </div>
                        
                        <label>Miscellaneous Notes:</label><br />
                        <textarea className='repair__assessmentMiscNotes' placeholder='No notes' rows={3} value={repairAssessmentNotes} onChange={(e) => {setAssessmentNotes(e.target.value)}} />
                    </div>

                    </> : null}
                    </>
                }
                
            </div>
            { repairStatus == 'open' ? <div className='repair__openJobDetails'>
                <p className='repair__openJobDetailsTitle'>Open Job Details</p>
                {
                    repairHasBeenAllocated ? <><div className='repair__openJobPanel'>
                        <div className='repair__openJobBasicDetails'>
                            <p className='repair__repairDeadline'>Repair Deadline: {repairDeadline.toString().slice(0, 15)}</p>
                            <p className='repair__repairDeadline'>Repair Dates: {repairDates.length > 0 ? getRepairDateRange() : 'None Set'}</p>
                            <p className='repair__repairRepairer'>Repairer: {repairerName}</p>
                            <button type='button' className='normalButton' onClick={toggleUpdateJobAssessment}>{updateAssessmentMode ? 'Cancel' : 'Update Assessment'}</button>
                            <button type='button' className='submitButton' onClick={updateJobAssessment} style={{display: updateAssessmentMode ? 'inline-block' : 'none', marginLeft: '10px'}}>Save</button>
                            {
                                updateAssessmentMode ? <div style={{lineHeight: '30px'}}>
                                    <label>Time Expected: </label><br />
                                    <select className="repair__assessmentHours" value={repairUpdatedExpectedTimeHours} onChange={updateUpdatedTimeExpectedHours} maximumScale={1} required>
                                        <option value="0" selected>0 Hours</option>
                                        <option value="1">1 Hour</option> 
                                        <option value="2">2 Hours</option> 
                                        <option value="3">3 Hours</option> 
                                        <option value="4">4 Hours</option>
                                        <option value="5">5 Hours</option>
                                        <option value="6">6 Hours</option>
                                        <option value="7">7 Hours</option>
                                        <option value="8">8 Hours</option>
                                        <option value="9">9 Hours</option>
                                        <option value="10">10 Hours</option>
                                        <option value="11">11 Hours</option>
                                        <option value="12">12 Hours</option>
                                        <option value="13">13 Hours</option>
                                        <option value="14">14 Hours</option>
                                        <option value="15">15 Hours</option>
                                        <option value="16">16 Hours</option>
                                        <option value="17">17 Hours</option>
                                        <option value="18">18 Hours</option>
                                        <option value="19">19 Hours</option>
                                        <option value="20">20 Hours</option>
                                        <option value="21">21 Hours</option>
                                        <option value="22">22 Hours</option>
                                        <option value="23">23 Hours</option>
                                        <option value="24">24 Hours</option>
                                    </select>
                                    <select className="repair__assessmentMinutes" value={repairUpdatedExpectedTimeMinutes} onChange={updateUpdatedTimeExpectedMinutes} maximumScale={1} required>
                                        <option value="0" selected>0 Minutes</option>
                                        <option value="15">15 Minutes</option> 
                                        <option value="30">30 Minutes</option> 
                                        <option value="45">45 Minutes</option> 
                                    </select><br />
                                    <label>Cost For Time: </label><br />
                                    <input type="text" className='repair_assessmentCostForTime' value={'£' + repairUpdatedCostForTime} onChange={(e) => {setRepairUpdatedCostForTime(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                    <label>Material Cost For Us: </label><br />
                                    <input type="text" className='repair_assessmentCostForTime' value={'£' + repairUpdatedCostOfMaterialsForUs} onChange={(e) => {setRepairUpdatedCostOfMaterialsForUs(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                    <label>Material Cost For Customer: </label><br />
                                    <input type="text" className='repair_assessmentCostForTime' value={'£' + repairUpdatedCostOfMaterialsForCustomer} onChange={(e) => {setRepairUpdatedCostOfMaterialsForCustomer(e.target.value.slice(1))}} maximumScale={1} required></input><br />
                                </div> : repairHasBeenUpdated ? <>

                                    <p>Updated Expected Time: {repairUpdatedExpectedTimeHours} Hours {repairUpdatedExpectedTimeMinutes} Minutes</p>
                                    <p>Updated Cost For Time: £{repairUpdatedCostForTime}</p>
                                    <p>Updated Materials Cost For Us: £{repairUpdatedCostOfMaterialsForUs}</p>
                                    <p>Updated Materials Cost For Customer: £{repairUpdatedCostOfMaterialsForCustomer}</p>

                                </> : null                  
                            }
                        </div>
                        <textarea className='repair__openJobNotes' placeholder='No notes' value={repairOpenJobNotes} onChange={(e) => {setRepairOpenJobNotes(e.target.value); updateOpenJobNotes()}} />
                        <div className='repair__openJobTimer'>
                            <p>{`${Math.floor(repairOpenJobTimer / 3600).toString().padStart(2, '0')}:${(Math.floor(repairOpenJobTimer / 60) % 60).toString().padStart(2, '0')}:${(repairOpenJobTimer % 60).toString().padStart(2, '0')}`}</p>
                            <div className='repair__openJobTimerButtons'>
                                    <button className='normalButton' onClick={stopTimer} style={{borderRadius: '0 0 0 5px'}}>Stop</button>
                                    <button className='normalButton' onClick={startTimer} style={{borderRadius: '0 0 5px 0', borderLeft: 'none'}}>Start</button>
                            </div>
                        </div>
                    </div>
                    {repairHasBeenRequestedFinished ? <>
                        <p style={{fontSize: '20px', marginLeft: '16px'}}>Sign Off On Job</p>
                        <button className='normalButton' onClick={cancelRequestFinishJob}>Needs More Work</button>
                        <button className='submitButton' style={{marginLeft: '10px'}} onClick={finishJob}>Confirm Completion</button>
                    </> : 
                        <button className='submitButton' style={{width: '300px', marginTop: '30px'}} onClick={requestFinishJob}>Finish Job</button>}
                    </> : <>
                    <form className='repair__repairAllocationForm' onSubmit={allocateJob}>
                        <label>Select Deadline: </label>
                        <input type='date' className='repair__repairDeadlineSelection' value={repairDeadline} onChange={(e) => {setRepairDeadline(e.target.value)}} required />
                        <Select options={repairerOptions} placeholder={"Select Repairer"} value={repairerOptions.filter(option => option.label === 'Purple')} onChange={(option) => {setRepairRepairerId(option.value)}} styles={customerSelectionStyles} className='repair__repairerDropdown' required />
                        <button type='submit' className='submitButton' style={{marginTop: '10px'}} >Submit</button>
                        <button type='button' className='normalButton' style={{marginLeft: '10px'}} onClick={toggleCalendar} >Show Calendar</button>
                    </form>
                    {showCalendar ? <div className='repair__calendarPopupContainer'>
                        <div className='repair__calendarPopup'>
                            <button className='repair__closeCalendarPopup normalButton' onClick={toggleCalendar}>Close</button>
                            <div style={{marginTop: '60px'}}>
                                <FullCalendar plugins={[ dayGridPlugin ]} initialView='dayGridMonth' hiddenDays={[0, 1]} events={calendarEvents} dayCellContent={calendarEventContent} eventOrder={'-priority,-time,title'} />
                            </div>
                        </div>
                    </div> : null }
                    </>
                }
            </div> : null }
            { repairStatus === 'complete' || repairStatus === 'collected' ? <>
            <div className='repair__completedOpenJobDetails'>
                <p className='repair__instrumentAssessmentTitle'>Completion Details:</p>
                <p style={{fontSize: '18px'}}>Date Finished: {repairDateFinished.slice(8, 10)}-{repairDateFinished.slice(5, 7)}-{repairDateFinished.slice(0, 4)}</p>
                <p style={{fontSize: '18px'}}>Time Taken: {`${Math.floor(repairOpenJobTimer / 3600).toString().padStart(2, '0')}:${(Math.floor(repairOpenJobTimer / 60) % 60).toString().padStart(2, '0')}:${(repairOpenJobTimer % 60).toString().padStart(2, '0')}`}</p>
                {repairHasBeenUpdated ? <>
                    <p>Updated Expected Time: {repairUpdatedExpectedTimeHours} Hours {repairUpdatedExpectedTimeMinutes} Minutes</p>
                    <p>Updated Cost For Time: £{repairUpdatedCostForTime}</p>
                    <p>Updated Materials Cost For Us: £{repairUpdatedCostOfMaterialsForUs}</p>
                    <p>Updated Materials Cost For Customer: £{repairUpdatedCostOfMaterialsForCustomer}</p>
                </> : null }
                {repairStatus === 'complete' ? <>
                    <button className='normalButton' onClick={instrumentCollected}>Instrument Has Been Collected</button><br />
                    <button className='normalButton' onClick={unFinishJob}>Re-Open Job</button>
                </> : <>
                    <p style={{fontSize: '18px'}}>Date Collected: {repairDateCollected.slice(8, 10)}-{repairDateCollected.slice(5, 7)}-{repairDateCollected.slice(0, 4)}</p>
                </> } 
            </div>
            </> : null }
            
            </> }
            
            <button className='submitButton' style={{marginLeft: '30px', marginTop: '20px'}} onClick={requestDeleteJob}>Delete Job</button>
        </div>
    </div>
}

export default Repair;