import React, { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from 'axios';
import Ticket from './components/Ticket';
import Header from './components/Header';
import './App.css';

function App() {
  const [TicketArr, setTicketArr] = useState([]);
  const [sortByTime, setSortByTime] = useState([[], 'default']);
  const [dateRange, setDateRange] = useState(
    {
      from: (new Date(2017, 11, 1)).getTime(),
      to: Date.now(),
    },
  );
  const [showFinished, setShowFinished] = useState(false);
  const filteredCompletely = sortByTime[0].filter((ticket) => !ticket.done && !ticket.hidden);
  const ticketsThatAreDone = sortByTime[0].filter((ticket) => ticket.done && !ticket.hidden);
  const hiddenCounter1 = sortByTime[0].length - (filteredCompletely.length + ticketsThatAreDone.length);

  function oldOrNew(val, arr) {
    const arrCopy = arr ? arr.slice() : TicketArr.slice();
    const newArr = arrCopy.filter((ticket) => ticket.creationTime < dateRange.to && ticket.creationTime > dateRange.from);
    if (val === '0') {
      newArr.sort((a, b) => a.creationTime - b.creationTime);
      setSortByTime([newArr, '0']);
    } else if (val === '1') {
      newArr.sort((a, b) => b.creationTime - a.creationTime);
      setSortByTime([newArr, '1']);
    } else {
      setSortByTime([newArr, 'default']);
    }
  }

  useEffect(() => {
    axios.get('/api/tickets').then((response) => { setSortByTime([response.data, 'default']); setTicketArr(response.data); });
  }, []);

  useEffect(() => {
    oldOrNew(sortByTime[1].toString());
  }, [dateRange, TicketArr]);

  function hideItem(id) {
    const newArr = TicketArr.slice();
    newArr.forEach((ticket, i) => {
      if (ticket.id === id) {
        newArr[i].hidden = true;
        setTicketArr(newArr);
      }
    });
  }

  function revealHidden() {
    const newArr = TicketArr.slice();
    newArr.forEach((ticket, i) => {
      if (ticket.hidden) {
        delete newArr[i].hidden;
      }
    });
    setTicketArr(newArr);
  }

  function filterTickets(textVal) {
    if (hiddenCounter1 > 0) {
      revealHidden();
    }
    axios.get(`/api/tickets?searchText=${textVal}`)
      .then((response) => {
        oldOrNew(sortByTime[1].toString(), response.data);
        setTicketArr(response.data);
      });
  }

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

  // const filteredList = TicketArr.filter(ticket=> !ticket.hidden);
  return (
    <div className="myApp">
      <Header />
      <TextField
        variant="outlined"
        id="searchInput"
        style={{
          textColor: 'black', height: '5vh', marginTop: '2rem', width: '30vh',
        }}
        placeholder="Filter Tickets by Title name"
        onChange={(e) => filterTickets(e.target.value)}
      />
      <TextField
        style={{ marginTop: '1.5vh' }}
        id="dateEnd"
        label="FROM"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setDateRange({
            from: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(), // more accurate than date.getTime()
            to: dateRange.to,
          });
        }}
        type="date"
        defaultValue="2018-01-01"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        style={{ marginTop: '1vh' }}
        id="dateStart"
        label="UNTIL"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setDateRange({
            to: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime(), // more accurate than date.getTime()
            from: dateRange.from,
          });
        }}
        type="date"
        defaultValue="2019-01-01"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <span id="DateRangeTicketsCounter">
        {`${TicketArr.length - sortByTime[0].length} Restricted by date`}
        {' '}
        <span className="reverseDate" onClick={() => setDateRange({ from: (new Date(2017, 11, 1)).getTime(), to: Date.now() })}>{(TicketArr.length - sortByTime[0].length > 0) ? '- reverse' : ''}</span>
      </span>
      <InputLabel style={{ marginTop: '1vh' }} htmlFor="age-native-helper">Sort By:</InputLabel>
      <NativeSelect
        name="Sort By:"
        onChange={(e) => {
          if (e.target.value === '3') {
            setSortByTime([TicketArr, 0]);
          } else {
            oldOrNew(e.target.value);
          }
        }}
        inputProps={{
          name: 'age',
          id: 'sorting',
        }}
      >
        <option value="default">Default</option>
        <option id='new' value={1}>New to old</option>
        <option id='old' value={0}>Old to new</option>
      </NativeSelect>
      <div className="ticketContainer">
        <div className="showingResults">

          <div>
            Showing
            <span id='ticketsYouSee'>{!showFinished ? filteredCompletely.length : ticketsThatAreDone.length}</span>
            {!showFinished ? 'Active Tickets' : 'Handeled Tickets' }
          </div>
          <div>
            {
              hiddenCounter1 > 0 ? (
                <div style={{
                  color: 'grey', display: 'flex', alignItems: 'space-between', marginLeft: '1vh',
                }}
                >
                  (
                  <span id="hideTicketsCounter">{hiddenCounter1}</span>
                  hidden tickets -
                  <div id="restoreHideTickets" onClick={() => revealHidden()}> restore</div>
                  )
                </div>
              ) : <div />
            }
          </div>
          <div id='switchLists' style={{ cursor: 'pointer' }} onClick={() => { setShowFinished(!showFinished); }}>
            {!showFinished ? 'Show Handled Tickets' : 'Show Active Tickets'}
          </div>
        </div>
        {
          !showFinished
            ? filteredCompletely.map((ticket) => <Ticket ticket={ticket} hideItem={hideItem} refreshList={filterTickets} />)
            : ticketsThatAreDone.map((ticket) => <Ticket ticket={ticket} hideItem={hideItem} refreshList={filterTickets} />)
        }
      </div>
    </div>
  );
}

export default App;
