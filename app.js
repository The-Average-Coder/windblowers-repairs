const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const db = mysql.createPool({
  connectionLimit: 4,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//let auth = basicAuth({
//  users: {
//    user: 'password',
//  },
//});
//app.use(auth);

app.get('/api/repairs/get', (req, res) => {
    const sqlSelect = "SELECT * FROM repairs";
    db.query(sqlSelect, (err, result) => {
      if (!err) {
        res.send(result);
      }
      else {
        console.log(err);
      }
    })
});

app.get('/api/repairs/getJob/:id', (req, res) => {
  const id = req.params.id;

  const sqlSelect = 'SELECT * FROM repairs WHERE id=?';
  db.query(sqlSelect, [id], (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/api/repairs/getLastJobNumber', (req, res) => {
  const sqlSelect = 'SELECT job_number FROM repairs WHERE id=(SELECT MAX(id) FROM repairs)';
  db.query(sqlSelect, (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});

app.post("/api/repairs/newJob", (req, res) => {
  const repairStatus = req.body.repairStatus;
  const repairJobNumber = req.body.repairJobNumber;
  const repairCustomerId = req.body.repairCustomerId;
  const repairInstrument = req.body.repairInstrument;
  const repairManufacturer = req.body.repairManufacturer;
  const repairModel = req.body.repairModel;
  const repairSerialNumber = req.body.repairSerialNumber;
  const repairNotes = req.body.repairNotes;
  const repairDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sqlInsert = "INSERT INTO repairs (status, job_number, customer_id, instrument, manufacturer, model, serial_number, notes, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sqlInsert, [repairStatus, repairJobNumber, repairCustomerId, repairInstrument, repairManufacturer, repairModel, repairSerialNumber, repairNotes, repairDateTime], (err, result) => {
    if (!err) {
      res.json({id: result.insertId});
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/editDetails', (req, res) => {
  const repairId = req.body.repairId
  const repairInstrument = req.body.repairInstrument;
  const repairManufacturer = req.body.repairManufacturer;
  const repairModel = req.body.repairModel;
  const repairSerialNumber = req.body.repairSerialNumber;
  const repairNotes = req.body.repairNotes;

  const sqlUpdate = 'UPDATE repairs SET instrument = ?, manufacturer = ?, model = ?, serial_number = ?, notes = ? WHERE id = ?';

  db.query(sqlUpdate, [repairInstrument, repairManufacturer, repairModel, repairSerialNumber, repairNotes, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/updateCustomer', (req, res) => {
  const customerId = req.body.customerId;
  const repairId = req.body.repairId;

  const sqlUpdate = "UPDATE repairs SET customer_id = ? WHERE id = ?";

  db.query(sqlUpdate, [customerId, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/updateStatus', (req, res) => {
  const repairId = req.body.repairId;
  const repairStatus = req.body.repairStatus;

  const sqlUpdate = 'UPDATE repairs SET status = ? WHERE id = ?';
  db.query(sqlUpdate, [repairStatus, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/setDateFinished/:id', (req, res) => {
  const repairId = req.params.id;
  const repairDateFinished = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sqlUpdate = 'UPDATE repairs SET date_finished = ? WHERE id = ?';
  db.query(sqlUpdate, [repairDateFinished, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/setDateCollected/:id', (req, res) => {
  const repairId = req.params.id;
  const repairDateCollected = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sqlUpdate = 'UPDATE repairs SET date_collected = ? WHERE id = ?';
  db.query(sqlUpdate, [repairDateCollected, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/assess', (req, res) => {
  const repairId = req.body.repairId;
  const repairExpectedTime = req.body.repairExpectedTime;
  const repairCostForTime = req.body.repairCostForTime;
  const repairNotesForMaterials = req.body.repairNotesForMaterials;
  const repairCostOfMaterialsForUs = req.body.repairCostOfMaterialsForUs;
  const repairCostOfMaterialsForCustomer = req.body.repairCostOfMaterialsForCustomer;
  const repairAssessmentNotes = req.body.repairAssessmentNotes;

  const sqlUpdate = 'UPDATE repairs SET has_been_assessed = 1, expected_time = ?, cost_for_time = ?, materials_notes = ?, materials_cost_us = ?, materials_cost_customer = ?, misc_notes = ? WHERE id = ?';
  db.query(sqlUpdate, [repairExpectedTime, repairCostForTime, repairNotesForMaterials, repairCostOfMaterialsForUs, repairCostOfMaterialsForCustomer, repairAssessmentNotes, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/allocate', (req, res) => {
  const repairId = req.body.repairId;
  const repairRepairerId = req.body.repairRepairerId;
  const repairDeadline = req.body.repairDeadline;
  const repairUnallocatedTime = req.body.repairUnallocatedTime;

  const sqlUpdate = 'UPDATE repairs SET has_been_allocated = 1, repairer_id = ?, deadline = ?, unallocated_time_calendar = ? WHERE id = ?';
  db.query(sqlUpdate, [repairRepairerId, repairDeadline, repairUnallocatedTime, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/updateAssessment', (req, res) => {
  const repairId = req.body.repairId;
  const repairUpdatedExpectedTime = req.body.repairUpdatedExpectedTime;
  const repairUpdatedCostForTime = req.body.repairUpdatedCostForTime;
  const repairUpdatedCostOfMaterialsForUs = req.body.repairUpdatedCostOfMaterialsForUs;
  const repairUpdatedCostOfMaterialsForCustomer = req.body.repairUpdatedCostOfMaterialsForCustomer;

  const sqlUpdate = 'UPDATE repairs SET has_been_updated = 1, updated_expected_time = ?, updated_cost_for_time = ?, updated_materials_cost_us = ?, updated_materials_cost_customer = ? WHERE id = ?';
  db.query(sqlUpdate, [repairUpdatedExpectedTime, repairUpdatedCostForTime, repairUpdatedCostOfMaterialsForUs, repairUpdatedCostOfMaterialsForCustomer, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/updateTimer', (req, res) => {
  const repairId = req.body.repairId;
  const repairTimer = req.body.repairTimer;

  const sqlUpdate = 'UPDATE repairs SET timer = ? WHERE id = ?';
  db.query(sqlUpdate, [repairTimer, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/repairs/updateUnallocatedTime', (req, res) => {
  const repairId = req.body.repairId;
  const repairUnalloctedTime = req.body.repairUnallocatedTime;

  const sqlUpdate = 'UPDATE repairs SET unallocated_time_calendar = ? WHERE id = ?'
  db.query(sqlUpdate, [repairUnalloctedTime, repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
})

app.put('/api/repairs/requestFinish', (req, res) => {
  const repairId = req.body.repairId;

  const sqlUpdate = 'UPDATE repairs SET has_been_requested_finished = 1 WHERE id = ?'
  db.query(sqlUpdate, [repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
})

app.put('/api/repairs/cancelRequestFinish', (req, res) => {
  const repairId = req.body.repairId;

  const sqlUpdate = 'UPDATE repairs SET has_been_requested_finished = 0 WHERE id = ?'
  db.query(sqlUpdate, [repairId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
})

app.get("/api/customers/get", (req, res) => {
  const sqlSelect = "SELECT * FROM customers";
  db.query(sqlSelect, (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/api/customers/getCustomer/:id', (req, res) => {
  const id = req.params.id;

  const sqlSelect = 'SELECT * FROM customers WHERE id=?';
  db.query(sqlSelect, [id], (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});

app.post("/api/customers/newCustomer", (req, res) => {
  const customerSurname = req.body.customerSurname;
  const customerFirstname = req.body.customerFirstname;
  const customerTelephone = req.body.customerTelephone;
  const customerEmail = req.body.customerEmail;
  const customerAddress = req.body.customerAddress;

  const sqlInsert = "INSERT INTO customers (surname, firstname, telephone, email, address) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlInsert, [customerSurname, customerFirstname, customerTelephone, customerEmail, customerAddress], (err, result) => {
    if (!err) {
      res.json({id: result.insertId});
    }
    else {
      console.log(err);
    }
  })
});

app.delete('/api/customers/deleteCustomer/:id', (req, res) => {
  const id = req.params.id;

  const sqlDelete = 'DELETE FROM customers WHERE id = ?';
  db.query(sqlDelete, id, (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/customers/update', (req, res) => {
  const customerId = req.body.customerId;
  const customerSurname = req.body.customerSurname;
  const customerFirstname = req.body.customerFirstname;
  const customerTelephone = req.body.customerTelephone;
  const customerEmail = req.body.customerEmail;
  const customerAddress = req.body.customerAddress;

  const sqlUpdate = "UPDATE customers SET surname = ?, firstname = ?, telephone = ?, email = ?, address = ? WHERE id = ?";

  db.query(sqlUpdate, [customerSurname, customerFirstname, customerTelephone, customerEmail, customerAddress, customerId], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.get("/api/repairers/get", (req, res) => {
  const sqlSelect = "SELECT * FROM repairers";
  db.query(sqlSelect, (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/api/repairers/getRepairer/:id', (req, res) => {
  const id = req.params.id;

  const sqlSelect = 'SELECT * FROM repairers WHERE id = ?';
  db.query(sqlSelect, [id], (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err);
    }
  })
});


app.post("/api/repairers/newRepairer", (req, res) => {
  const repairerName = req.body.repairerName;

  const sqlInsert = "INSERT INTO repairers (name) VALUES (?)";
  db.query(sqlInsert, [repairerName], (err, result) => {
    if (!err) {
      res.json({id: result.insertId});
    }
    else {
      console.log(err);
    }
  })
});

app.delete('/api/repairers/deleteRepairer/:id', (req, res) => {
  const id = req.params.id;

  const sqlDelete = 'DELETE FROM repairers WHERE id = ?';
  db.query(sqlDelete, id, (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.get('/api/calendarEvents/get', (req, res) => {
  const sqlSelect = "SELECT * FROM calendar_events";
    db.query(sqlSelect, (err, result) => {
      if (!err) {
        res.send(result);
      }
      else {
        console.log(err);
      }
    })
});

app.get('/api/calendarEvents/get/:id', (req, res) => {
  const eventId = req.params.id;

  const sqlSelect = "SELECT * FROM calendar_events WHERE id = ?";
    db.query(sqlSelect, [eventId], (err, result) => {
      if (!err) {
        res.send(result);
      }
      else {
        console.log(err);
      }
    })
});

app.get('/api/calendarEvents/getFromDate/:date', (req, res) => {
  const eventDate = req.params.date;

  const sqlSelect = "SELECT * FROM calendar_events WHERE start = ?";
    db.query(sqlSelect, [eventDate], (err, result) => {
      if (!err) {
        res.send(result);
      }
      else {
        console.log(err);
      }
    })
});

app.post("/api/calendarEvents/newEvent", (req, res) => {
  const calendarRepairId = req.body.calendarRepairId;
  const calendarTitle = req.body.calendarTitle;
  const calendarColor = req.body.calendarColor;
  const calendarTime = req.body.calendarTime
  const calendarStart = req.body.calendarStart;
  const calendarEnd = req.body.calendarEnd;

  const sqlInsert = "INSERT INTO calendar_events (repair_id, title, color, time, start, end) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sqlInsert, [calendarRepairId, calendarTitle, calendarColor, calendarTime, calendarStart, calendarEnd], (err, result) => {
    if (!err) {
      res.json({id: result.insertId});
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/calendarEvents/update', (req, res) => {
  const eventId = req.body.eventId;
  const eventStart = req.body.eventStart;
  const eventEnd = req.body.eventEnd;

  const sqlUpdate = "UPDATE calendar_events SET start = ?, end = ? WHERE id = ?";

  db.query(sqlUpdate, [ eventStart, eventEnd, eventId ], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.put('/api/calendarEvents/updateColor', (req, res) => {
  const repairId = req.body.repairId;
  const eventColor = req.body.eventColor;

  const sqlUpdate = "UPDATE calendar_events SET color = ? WHERE repair_id = ?";

  db.query(sqlUpdate, [ eventColor, repairId ], (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.delete('/api/calendarEvents/deleteEvent/:id', (req, res) => {
  const id = req.params.id;

  const sqlDelete = 'DELETE FROM calendar_events WHERE id = ?';
  db.query(sqlDelete, id, (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

app.get('/api/notifications/get', (req, res) => {
  const sqlSelect = "SELECT * FROM notifications";
    db.query(sqlSelect, (err, result) => {
      if (!err) {
        res.send(result);
      }
      else {
        console.log(err);
      }
    })
});

app.post("/api/notifications/new", (req, res) => {
  const notificationRepairId = req.body.notificationRepairId;
  const notificationTitle = req.body.notificationTitle;
  const notificationInstrument = req.body.notificationInstrument;
  const notificationJobNumber = req.body.notificationJobNumber;

  const sqlInsert = "INSERT INTO notifications (repair_id, title, instrument, job_number) VALUES (?, ?, ?, ?)";
  db.query(sqlInsert, [notificationRepairId, notificationTitle, notificationInstrument, notificationJobNumber], (err, result) => {
    if (!err) {
      res.json({id: result.insertId});
    }
    else {
      console.log(err);
    }
  })
});

app.delete('/api/notifications/delete/:id', (req, res) => {
  const id = req.params.id;

  const sqlDelete = 'DELETE FROM notifications WHERE id = ?';
  db.query(sqlDelete, id, (err, result) => {
    if (!err) {
      res.send('Success');
    }
    else {
      console.log(err);
    }
  })
});

//app.get('/authenticate', auth, (req, res) => {
//  if (req.auth.user === 'user') {
//    res.send('user');
//  }
//})

app.use(express.static(path.join(__dirname, "build")));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('running on port', port);
});
