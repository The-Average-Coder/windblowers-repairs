import '../stylesheets/Repairs.css';
import plusSymbol from '../images/plusIcon.png';
import fluteIcon from '../images/fluteIcon.png';
import oboeIcon from '../images/oboeIcon.png';
import clarinetIcon from '../images/clarinetIcon.png';
import bassoonIcon from '../images/bassoonIcon.png';
import saxophoneIcon from '../images/saxophoneIcon.png';
import backIcon from '../images/backIcon.png';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import moment from 'moment';
import Select from 'react-select';

function Repairs(props) {
  const { customerId } = useParams();

  const [repairList, setRepairList] = useState([]);
  const [listLayout, setListLayout] = useState(1);
  const [calendarLayout, setCalendarLayout] = useState(0);
  const [creatingNewTask, setCreatingNewTask] = useState(0);
  const [customerList, setCustomerList] = useState([])
  const [customerOptions, setCustomerOptions] = useState([]);
  const [archiveSearch, setArchiveSearch] = useState('');
  
  const [repairCustomerId, setRepairCustomerId] = useState('');
  const [repairInstrument, setRepairInstrument] = useState("");
  const [repairManufacturer, setRepairManufacturer] = useState("");
  const [repairModel, setRepairModel] = useState("");
  const [repairSerialNumber, setRepairSerialNumber] = useState("");
  const [repairNotes, setRepairNotes] = useState("");

  const [lastJobNumber, setLastJobNumber] = useState('');

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarExternalEvents, setCalendarExternalEvents] = useState([]);
  const [calendarSidebarActive, setCalendarSidebarActive] = useState(0);
  const [selectedUnallocatedTask, setSelectedUnallocatedTask] = useState('');
  const [timeToAllocate, setTimeToAllocate] = useState(0);
  const [timeToAllocateHours, setTimeToAllocateHours] = useState(0);
  const [timeToAllocateMinutes, setTimeToAllocateMinutes] = useState(0);
  const [calendarEventPriority, setCalendarEventPriority] = useState(0);

  const navigate = useNavigate();

  const instrumentSymbol = { 
    'flute': fluteIcon,
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

  useEffect(() => {
    loadRepairs();
    loadCustomers();
    loadCalendarEvents();
    getLastJobNumber();

    if (props.newRepair === true) {
      createNewTask();
      setRepairCustomerId(customerId);
    }
  }, []);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    if (draggableEl) {
      const draggable = new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
            let id = eventEl.dataset.id;
            let title = eventEl.getAttribute("title");
            let color = eventEl.dataset.color;

            return {
                id: id,
                title: title,
                color: color,
                create: true,
            };
        }
      });

      return () => draggable.destroy();
    }
  });

  const loadRepairs = () => {
    Axios.get("/api/repairs/get").then((response) => {
      setRepairList(response.data);
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
    })
  }

  const loadCalendarEvents = () => {
    Axios.get('/api/calendarEvents/get').then((response) => {
      setCalendarEvents(response.data);
    })
  }

  const getLastJobNumber = () => {
    Axios.get('/api/repairs/getLastJobNumber').then((response) => {
      if (response.data.length === 0) {
        setLastJobNumber('');
      }
      else {
        setLastJobNumber(response.data[0].job_number);
      }
    });
  }

  const calculateJobNumber = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(2);
    const currentWeek = moment(currentDate).format('W').toString();

    const weekCode = currentYear + currentWeek;
    
    if (lastJobNumber.length >= 4) {
      const lastWeekCode = lastJobNumber.slice(0, 4);

      if (weekCode === lastWeekCode) {
        const previousJobCode = parseInt(lastJobNumber.slice(4));
        const currentJobCode = ('00' + (previousJobCode + 1).toString()).slice(-3);
        const currentJobNumber = weekCode + currentJobCode;
        return currentJobNumber;
      }
    }

    const currentJobCode = '001';
    const currentJobNumber = (weekCode + currentJobCode).toString();

    return currentJobNumber;
  }

  const switchToCalendarLayout = () => {
    setCalendarLayout(1);
    setListLayout(0);
  }

  const switchToListLayout = () => {
    setCalendarLayout(0);
    setListLayout(1);
  }

  const createNewTask = () => {
    setCreatingNewTask(1);
  }

  const submitNewTask = (e) => {
    e.preventDefault();
    setCreatingNewTask(0);

    const repairJobNumber = calculateJobNumber();

    Axios.post("/api/repairs/newJob", {
      repairStatus: 'assessment / quote',
      repairJobNumber: repairJobNumber,
      repairCustomerId: repairCustomerId,
      repairInstrument: repairInstrument,
      repairManufacturer: repairManufacturer,
      repairModel: repairModel,
      repairSerialNumber: repairSerialNumber,
      repairNotes: repairNotes
    }).then((response) => {
      setRepairList([
        ...repairList,
        {
          id: response.data.id,
          status: 'assessment / quote',
          job_number: repairJobNumber,
          customer_id: repairCustomerId,
          instrument: repairInstrument,
          manufacturer: repairManufacturer,
          model: repairModel,
          serial_number: repairSerialNumber,
          notes: repairNotes
        }
      ]);

      navigate(`/repair/${response.data.id}`);
    });


    setRepairInstrument('');
    setRepairManufacturer('');
    setRepairModel('');
    setRepairSerialNumber('');
    setRepairNotes('');

    setLastJobNumber(repairJobNumber);
  }

  const cancelNewTask = (e) => {
    e.preventDefault();
    setCreatingNewTask(0);

    setRepairInstrument('');
    setRepairManufacturer('');
    setRepairModel('');
    setRepairSerialNumber('');
    setRepairNotes('');
  }

  const getCustomerName = (id) => {
    let name = "";
    customerList.forEach(element => {
      if (element.id === id) {
        name = `${element.firstname} ${element.surname}`;
      }
    })
    if (name.length > 0) {
      return name;
    }
    return "<no customer>";
  }

  const getCustomerSurname = (id) => {
    let name = ""
    customerList.forEach(element => {
      if (element.id === id) {
        name = element.surname;
      }
    })
    if (name.length > 0) {
      return name;
    }
    return "<no customer>";
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
      borderRadius: "8px 8px 4px 4px",
    }),

    valueContainer: (defaultStyles) => ({
      ...defaultStyles,
      padding: "0 6px",
    }),

    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      fontSize: "16px"
    }),
  }

  const statusColor = {
    'assessment / quote': 'red',
    'open': 'orange',
    'closed': 'gray',
    'complete': 'limegreen',
    'collected': 'black'
  }

   const calendarEventClick = (eventClickInfo) => {
    const calendarEventRepairId = calendarEvents.filter(calendarEvent => calendarEvent.id == eventClickInfo.event._def.publicId)[0].repair_id;
    navigate(`/repair/${calendarEventRepairId}`);
  }

  const calendarEventChange = (eventClickInfo) => {
    const calendarEventId = eventClickInfo.event._def.publicId;
    const calendarEventStart = eventClickInfo.event._instance.range.start.toISOString().split('T')[0];
    const calendarEventEnd = eventClickInfo.event._instance.range.end.toISOString().split('T')[0];
    Axios.put('/api/calendarEvents/update', {
      eventId: calendarEventId,
      eventStart: calendarEventStart,
      eventEnd: calendarEventEnd
    }).then((response) => {
      const updatedEvents = calendarEvents.map(event => 
        event.id == calendarEventId ? { id: calendarEventId, title: event.title, color: event.color, time: event.time, repair_id: event.repair_id, start: calendarEventStart, end: calendarEventEnd, priority: event.priority } : event);
      setCalendarEvents(updatedEvents);
      
    })
  }

  const toggleCalendarSidebar = () => {
    setCalendarSidebarActive(1-calendarSidebarActive);
    setSelectedUnallocatedTask('');
  }

  const titleCase = (str) => {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  const updateTimeToAllocateMinutes = (e) => {
    setTimeToAllocateMinutes(e.target.value);
    updateTimeToAllocate(timeToAllocateHours, e.target.value);
  }

  const updateTimeToAllocateHours = (e) => {
    setTimeToAllocateHours(e.target.value);
    updateTimeToAllocate(e.target.value, timeToAllocateMinutes);
  }

  const updateTimeToAllocate = (hours, minutes) => {
    const allocatedTime = parseInt(hours) * 60 + parseInt(minutes);
    setTimeToAllocate(allocatedTime);
    if (allocatedTime <= 0) {
      setCalendarExternalEvents([]);
    }
  }

  const updateDraggable = () => {
    const repair = repairList.filter(repair => repair.id === selectedUnallocatedTask)[0];
    let newEvent = {
      title: `${titleCase(repair.instrument.slice(0, 2))}. ${repair.job_number} ${timeToAllocateHours} Hr ${timeToAllocateMinutes} Mins`,
      color: 'orange',
    }

    setCalendarExternalEvents([newEvent]);
  }

  const calendarEventReceive = (eventInfo) => {
    const repair = repairList.filter(repair => repair.id === selectedUnallocatedTask)[0];
    const calendarEventStart = eventInfo.event._instance.range.start.toISOString().split('T')[0];
    const calendarEventEnd = eventInfo.event._instance.range.end.toISOString().split('T')[0];

    Axios.post('/api/calendarEvents/newEvent', {
      calendarRepairId: repair.id,
      calendarTitle: eventInfo.draggedEl.getAttribute('title'),
      calendarColor: eventInfo.draggedEl.getAttribute('data-color'),
      calendarTime: timeToAllocate,
      calendarStart: calendarEventStart,
      calendarEnd : calendarEventEnd,
      calendarPriority: calendarEventPriority
    }).then((response) => {
      const newEvent = {
        id: response.data.id,
        repairId: repair.id,
        title: eventInfo.draggedEl.getAttribute("title"),
        color: eventInfo.draggedEl.getAttribute("data-color"),
        time: timeToAllocate,
        start: calendarEventStart,
        end: calendarEventEnd,
        priority: calendarEventPriority
      };

      setCalendarEvents([
        ...calendarEvents,
        newEvent
      ])

      const repairUnallocatedTime = repair.unallocated_time_calendar - (parseInt(timeToAllocateHours) * 60 + parseInt(timeToAllocateMinutes));

      Axios.put('/api/repairs/updateUnallocatedTime', {
        repairId: repair.id,
        repairUnallocatedTime: repairUnallocatedTime
      }).then((response) => {
        loadRepairs();
      })

      if (repairUnallocatedTime <= 0) {
        setSelectedUnallocatedTask('');
      }

      setCalendarExternalEvents([]);
    })
  }

  const calendarEventDidMount = (e) => {
    const eventId = e.event.id;
    e.el.addEventListener("contextmenu", (jsEvent) => {
      jsEvent.preventDefault();
      Axios.get(`/api/calendarEvents/get/${eventId}`).then((response) => {
        const eventRepairId = response.data[0].repair_id;

        Axios.get(`/api/repairs/getJob/${eventRepairId}`).then((repairResponse) => {
          const unallocatedTime = repairResponse.data[0].unallocated_time_calendar + response.data[0].time;
  
          Axios.put('/api/repairs/updateUnallocatedTime', {
            repairId: eventRepairId,
            repairUnallocatedTime: unallocatedTime
          }).then((updateResponse) => {
            loadRepairs();
          })
  
          Axios.delete(`/api/calendarEvents/deleteEvent/${eventId}`).then((deleteResponse) => {
            loadCalendarEvents();
          });
  
          e.event.remove();
        });
      });
    })
  }

  const createCalendarBlock = () => {
    updateDraggable();
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

  return (<div className='repairs__page'>
    <div className='repairsPanel'>
      <ul className='repairsPanelLayoutSelect'>
        <li><button active={listLayout} onClick={switchToListLayout}>List</button></li>
        <li><button active={calendarLayout} onClick={switchToCalendarLayout}>Calendar</button></li>
      </ul>
      {listLayout ? <>
      <div className='repairsParentPanel'>
        <div className='taskList' newTask={creatingNewTask}>
          <p className='repairsListTitle'>To Do</p>
          <p className='repairsListCount'>{repairList.filter(repair => repair.status !== 'closed' && repair.status !== 'collected').length}</p>
          <div className='repairsList'>
            <button className='repairsNewTaskButton' onClick={createNewTask}><img src={plusSymbol} alt='' /><p>Add New Task</p></button>
            {repairList.filter(repair => repair.status === 'assessment / quote' || repair.status === 'open' || repair.status === 'complete').map((val) => {
              return [
                <Link className='repairsListElement' to={`/repair/${val.id}`}>
                  <img className='repairsListElementIcon' src={instrumentSymbol[val.instrument]} alt='' />
                  <div className='repairsListElementStatus' style={{backgroundColor: statusColor[val.status]}} />
                  <p className='repairsListElementTitle'>{titleCase(val.instrument)}</p>
                  <p className='repairsListElementManufacturer'>{val.manufacturer}</p>
                  <p className='repairsListElementModel'>{val.model}</p>
                  <p className='repairsListElementSerialNumber'>{val.job_number}</p>
                  <p className='repairsListElementDate'>Date Created: {val.date_created === undefined ? 'Error' : val.date_created.slice(0, 10)}</p>
                  <p className='repairsListElementDate'>Deadline: {val.deadline === undefined || val.deadline === null ? 'Not Set' : val.deadline.slice(0, 10)}</p>
                  <p className='repairsListElementCustomer'>{getCustomerName(val.customer_id)}</p>
                </Link>
              ];
            })}
          </div>

          <p className='repairsListTitle' style={{marginTop: '42px'}}>Archive (Closed Or Collected)</p>
          <input type='text' className='customers__customerSearchBar' style={{marginLeft: '20px', width: 'calc(100% - 120px)'}} value={archiveSearch} onChange={(e) => setArchiveSearch(e.target.value)} placeholder='Search...'/>

          <div className='repairsList' style={{marginTop: '0px', paddingTop: '0px', maxHeight: '230px'}}>
            { archiveSearch.replace(/\s+/g, '') === '' ? <p className='customers__customerSearchInstruction'>Search To Show Repairs</p> : 
            repairList.filter(repair => repair.status !== 'assessment / quote' && repair.status !== 'open' && repair.status !== 'complete').filter(repair => `${repair.instrument.toLowerCase()} ${repair.manufacturer.toLowerCase()} ${repair.model.toLowerCase()} ${repair.serial_number.toLowerCase()} ${repair.job_number.toLowerCase()} ${getCustomerName(repair.customer_id).toLowerCase()}`.includes(archiveSearch.toLowerCase())).map((val) => {
              return [
                <Link className='repairsListElement' to={`/repair/${val.id}`}>
                  <img className='repairsListElementIcon' src={instrumentSymbol[val.instrument]} alt='' />
                  <div className='repairsListElementStatus' style={{backgroundColor: statusColor[val.status]}} />
                  <p className='repairsListElementTitle'>{titleCase(val.instrument)}</p>
                  <p className='repairsListElementManufacturer'>{val.manufacturer}</p>
                  <p className='repairsListElementModel'>{val.model}</p>
                  <p className='repairsListElementSerialNumber'>{val.job_number}</p>
                  <p className='repairsListElementDate'>Date Created: {val.date_created === undefined ? 'Error' : val.date_created.slice(0, 10)}</p>
                  <p className='repairsListElementDate'>Deadline: {val.deadline === undefined || val.deadline === null ? 'Not Set' : val.deadline.slice(0, 10)}</p>
                  <p className='repairsListElementCustomer'>{getCustomerName(val.customer_id)}</p>
                </Link>
              ];
            })}
          </div>
        </div>
        <div className='newTaskPanel' newTask={creatingNewTask}>
          <p className='newTaskPanelTitle'>New Task</p>
          <form className='newTaskForm' onSubmit={submitNewTask}>
            <div className='newTaskInputs'>
              <p>Customer Details</p>
              <Select options={customerOptions} placeholder={"Select Customer"} value={customerOptions.filter(option => option.value == repairCustomerId)} onChange={(option) => {setRepairCustomerId(option.value)}} styles={customerSelectionStyles} className='customerDropdown' />
              <div className='newTaskNewCustomerButton'><Link className='normalButton' style={{textDecoration: 'none', color: 'black'}} to='/customers/new'>Create New Customer</Link></div>
              <p>Repair Details</p>      
              <select className="instrumentDropdown" value={repairInstrument} onChange={(e) => {setRepairInstrument(e.target.value)}} maximumScale={1} required>
                <option value="" selected disabled hidden>Select Instrument</option>
                <optgroup label='Flute Family'>
                  <option value="flute">Flute</option>
                  <option value="piccolo">Piccolo</option> 
                  <option value="alto flute">Alto Flute</option> 
                  <option value="bass flute">Bass Flute</option> 
                  <option value="flute (other)">Flute (Other)</option> 
                </optgroup>
                <optgroup label='Clarinet Family'>
                  <option value="b♭ clarinet">B♭ Clarinet</option>
                  <option value="a clarinet">A Clarinet</option> 
                  <option value="e♭ clarinet">E♭ Clarinet</option> 
                  <option value="alto clarinet">Alto Clarinet</option> 
                  <option value="bass clarinet">Bass Clarinet</option> 
                  <option value="contrabass clarinet">Contrabass Clarinet</option> 
                  <option value="clarinet (other)">Clarinet (Other)</option> 
                </optgroup>
                <optgroup label='Saxophone Family'>
                  <option value="soprano saxophone">Soprano Saxophone</option> 
                  <option value="alto saxophone">Alto Saxophone</option> 
                  <option value="tenor saxophone">Tenor Saxophone</option> 
                  <option value="baritone saxophone">Baritone Saxophone</option> 
                  <option value="bass saxophone">Bass Saxophone</option> 
                  <option value="saxophone (other)">Saxophone (Other)</option> 
                </optgroup>
                <optgroup label='Oboe Family'>
                  <option value="oboe">Oboe</option>
                  <option value="cor anglais">Cor Anglais</option>
                  <option value="oboe (other)">Oboe (Other)</option>
                </optgroup>
                <optgroup label='Bassoon Family'>
                  <option value="bassoon">Bassoon</option>
                  <option value="bassoon (other)">Bassoon (Other)</option>
                </optgroup>
                <optgroup label='Recorder Family'>
                  <option value='soprano recorder'>Soprano Recorder</option>
                  <option value='alto recorder'>Alto Recorder</option>
                  <option value='tenor recorder'>Tenor Recorder</option>
                  <option value='bass recorder'>Bass Recorder</option>
                  <option value='recorder (other)'>Recorder (Other)</option>
                </optgroup>
                <optgroup label='Other'>
                  <option value='other'>Other</option>
                </optgroup>
              </select><br />
              <input type="text" placeholder='Manufacturer' className='manufacturerInput' value={repairManufacturer} onChange={(e) => {setRepairManufacturer(e.target.value)}} maximumScale={1} required></input><br />
              <input type="text" placeholder='Model' className='modelInput' value={repairModel} onChange={(e) => {setRepairModel(e.target.value)}} maximumScale={1} required></input><br />
              <input type="text" placeholder='Serial Number' className='serialNumberInput' value={repairSerialNumber} onChange={(e) => {setRepairSerialNumber(e.target.value)}} maximumScale={1} required></input><br />
              <textarea className='notesInput' placeholder='Notes (Optional)' rows={5} value={repairNotes} onChange={(e) => {setRepairNotes(e.target.value)}} maximumScale={1} ></textarea>
            </div>
            <div className='newTaskButtons'>
              <button className='cancelNewTask' onClick={cancelNewTask}>Cancel</button>
              <button className='submitNewTask' type='submit'>Submit</button>
            </div>
          </form>
        </div>
      </div>
      </> :
      <div className='calendarPanel'>
        <div className='calendarContainer'>
          <FullCalendar plugins={[ dayGridPlugin, interactionPlugin ]} initialView='dayGridMonth' droppable={true}
          hiddenDays={[0, 1]} events={calendarEvents} editable={true} selectable={true} eventClick={calendarEventClick}
          eventChange={calendarEventChange} eventReceive={calendarEventReceive} eventDidMount={calendarEventDidMount} 
          dayCellContent={calendarEventContent} eventOrder={'-priority,-time,title'}/>
        </div>
        <div className='calendarSidebar' allocateCalendar={calendarSidebarActive}>
          <button className='calendarSidebarToggle' onClick={toggleCalendarSidebar}><img src={backIcon} alt='' /></button>
          {calendarSidebarActive ? <div className='calendarSidebarPanel'>
            <p className='calendarSidebarTitle'>Unallocated Tasks</p>
            <div className='calendarSidebarUnallocatedTaskList'>
              { repairList.filter(repair => repair.unallocated_time_calendar > 0 && repair.status !== 'complete').map((val) => {
                return [<div className='calendarSidebarUnallocatedTask' style={{backgroundColor: selectedUnallocatedTask === val.id ? 'rgb(210, 210, 210)' : 'rgb(231, 231, 231)'}} onClick={() => {setSelectedUnallocatedTask(val.id)}}>
                  <p className='unallocatedJobNumber'>Repair {val.job_number}</p>
                  <p className='unallocatedSurname'>{getCustomerSurname(val.customer_id)}</p>
                  <p className='unallocatedInstrument'>{titleCase(val.instrument)}</p>
                  <p className='unallocatedDeadline'>{new Date(val.deadline).toString().slice(0, 10)}</p>
                  <p className='unallocatedTime'>{Math.floor(val.unallocated_time_calendar / 60)} Hrs {val.unallocated_time_calendar % 60} Mins</p>
                </div>]
              }) }
            </div>
            {
              selectedUnallocatedTask === '' ? 
              repairList.filter(repair => repair.unallocated_time_calendar > 0 && repair.status !== 'complete').length > 0 ? <>
                <p className='calendarSidebarSelectionInstruction'>Select A Job</p>
              </> : <>
                <p className='calendarSidebarSelectionInstruction'>No Unallocated Jobs</p>
              </> : <><div className='calendarSidebarTimeToAllocateConatainer'>
                <label>Time To Allocate: </label>
                <select className="calendarSidebarTimeHours" value={timeToAllocateHours} onChange={updateTimeToAllocateHours}>
                  <option value="0" selected>0 Hours</option>
                  <option value="1">1 Hour</option> 
                  <option value="2">2 Hours</option> 
                  <option value="3">3 Hours</option> 
                  <option value="4">4 Hours</option>
                  <option value="5">5 Hours</option>
                  <option value="6">6 Hours</option>
                  <option value="7">7 Hours</option>
                  <option value="8">8 Hours</option>
                </select>
                <select className="calendarSidebarTimeMinutes" value={timeToAllocateMinutes} onChange={updateTimeToAllocateMinutes}>
                    <option value="0" selected>0 Minutes</option>
                    <option value="15">15 Minutes</option> 
                    <option value="30">30 Minutes</option> 
                    <option value="45">45 Minutes</option> 
                </select><br />
                <label>Priority: </label>
                <input type='checkbox' value={calendarEventPriority} onChange={(e) => setCalendarEventPriority(!calendarEventPriority)} /><br />
                <button className='normalButton' style={{marginTop: '20px'}} onClick={createCalendarBlock}>Create Calendar Block</button>
              </div>
              <div id='external-events' className='calendarSidebarExternalEvents'>
                {calendarExternalEvents.map((event) => {
                  return (
                    <div className='fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2'
                    title={event.title}
                    data-id={event.id}
                    data-color={event.color}
                    key={event.id}
                    style={{
                      backgroundColor: event.color,
                      borderColor: event.color,
                      cursor: 'pointer'
                    }}>
                      <div className='fc-event-main'>
                        {event.title}
                      </div>
                    </div>
                  )
                })}
              </div></>
            }
          </div> : null }
        </div>
      </div>}
      
    </div>
  </div>);
}

export default Repairs;