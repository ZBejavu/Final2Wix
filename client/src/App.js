// import React, { useEffect, useState } from 'react';
import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import axios from 'axios';
import Ticket from './components/Ticket';
import Header from './components/Header';

import './App.css';

function App() {
  const [TicketArr, setTicketArr] = useState([]);
  const [hiddenCounter, setHiddenCounter] = useState(0);
  const [sortByTime, setSortByTime] = useState([[],'default']);
  const [dateRange , setDateRange] = useState({from: (new Date(2017,11,1)).getTime(), to: Date.now()});
  useEffect(() => {
    axios.get('/api/tickets').then((response) => {setSortByTime([response.data,'default']); setTicketArr(response.data);});
  }, []);


  useEffect(() => {
    const newArr = TicketArr.filter(ticket => {return ticket.creationTime< dateRange.to && ticket.creationTime> dateRange.from})
    oldOrNew(sortByTime[1].toString());
    console.log(dateRange);
  }, [dateRange])


  useEffect(() => {
    //setSortByTime([TicketArr,0]);
      const newArr = TicketArr.filter(ticket => {return ticket.creationTime< dateRange.to && ticket.creationTime> dateRange.from})
      oldOrNew(sortByTime[1].toString());
    console.log(dateRange);
  },[TicketArr]);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
    const classes = useStyles();



  function revealHidden() {
    const newArr = TicketArr.slice();
    newArr.forEach((ticket, i) => {
      if (ticket.hasOwnProperty('hidden')) {
        delete newArr[i].hidden;
      }
    });
    setHiddenCounter(0);
    setTicketArr(newArr);
  }

  function filterTickets(textVal) {
    if (hiddenCounter > 0) {
      revealHidden();
    }
    axios.get(`/api/tickets?searchText=${textVal}`)
      .then((response) => {  oldOrNew(sortByTime[1].toString(),response.data); setTicketArr(response.data)});
  }

  function hideItem(id) {
    const newArr = TicketArr.slice();
    newArr.forEach((ticket, i) => {
      if (ticket.id === id) {
        newArr[i].hidden = true;
        setTicketArr(newArr);
        setHiddenCounter(hiddenCounter + 1);
      }
    });
  }
  

  
  
  
  function oldOrNew(val,arr){
    console.log('in function');
    const arrCopy = arr || TicketArr.slice();
    console.log(val === 0 , val)
    if(val === "0"){
      const newArr = arrCopy.filter(ticket => {return ticket.creationTime< dateRange.to && ticket.creationTime> dateRange.from})
      newArr.sort((a,b)=> a.creationTime - b.creationTime);
      setSortByTime([newArr,'0']);
    }else if(val ==="1"){
      const newArr = arrCopy.filter(ticket => {return ticket.creationTime< dateRange.to && ticket.creationTime> dateRange.from})
      newArr.sort((a,b)=> b.creationTime - a.creationTime);
      setSortByTime([newArr, '1']);
    }else{
      setSortByTime([arrCopy,'default']);
    }
  }
  const date = new Date();

  console.log(sortByTime[1])
  return (
    <div className="myApp">
      <Header />
      <TextField
        variant="outlined"
        id="searchInput"
        style={{
          textColor: 'black', height: '5vh', marginTop: '2rem', width: '30vh',
        }}
        placeholder="Filter Tickets"
        onChange={(e) => filterTickets(e.target.value)}
      />
                <TextField
                style={{marginTop:'1.5vh'}}
        id="dateEnd"
        label="FROM"
        onChange={(e) => {let date = new Date(e.target.value);
          console.log('firstDateTime', date.getTime());
          console.log(new Date(2018 ,11,27,5,14,17).getTime());
          setDateRange({from : new Date( date.getFullYear(), date.getMonth(), date.getDate(),).getTime(), to: dateRange.to})}}
        type="date"
        defaultValue="2018-01-01"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
          <TextField
          style={{marginTop:'1vh'}}
        id="dateStart"
        label="UNTIL"
        onChange={(e) => {let date = new Date(e.target.value);
          console.log('firstDateTime', date.getTime());
          console.log(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
          setDateRange({to : new Date( date.getFullYear(), date.getMonth(), date.getDate()+1,).getTime(), from: dateRange.from})}}
        type="date"
        defaultValue="2019-01-01"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <InputLabel style={{marginTop:'1vh'}} htmlFor="age-native-helper">Sort By:</InputLabel>
      <NativeSelect
          name='Sort By:'
          onChange={(e) =>{console.log(e.target.value);if(e.target.value === "3"){setSortByTime([TicketArr,0])}else{oldOrNew(e.target.value)}}}
          inputProps={{
            name: 'age',
            id: 'age-native-helper',
          }}
        >
          <option value={'default'}>Default</option>
          <option value={1}>New to old</option>
          <option value={0}>Old to new</option>
        </NativeSelect>
      <div className="ticketContainer">
        <div className="showingResults">
          <div>
            Showing
            {TicketArr.length}
            {' '}
            Results
          </div>
          {
            hiddenCounter > 0 ? (
              <div style={{
                color: 'grey', display: 'flex', alignItems: 'space-between', marginLeft: '1vh',
              }}
              >
                (
                <span id="hideTicketsCounter">{hiddenCounter}</span>
                hidden tickets -
                <div id="restoreHideTickets" onClick={() => revealHidden()}> restore</div>
                )
              </div>
            ) : <div />
          }

        </div>
        {
        sortByTime[0].map((ticket) => <Ticket ticket={ticket} hideItem={hideItem} />)
      }
      </div>
    </div>
  );
}

export default App;
