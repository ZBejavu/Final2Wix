// import React, { useEffect, useState } from 'react';
import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import { TextField } from '@material-ui/core';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import axios from 'axios';
import Ticket from './components/Ticket';
import Header from './components/Header';

import './App.css';

function App() {
  const [TicketArr, setTicketArr] = useState([]);
  const [hiddenCounter, setHiddenCounter] = useState(0);
  useEffect(() => {
    axios.get('/api/tickets').then((response) => setTicketArr(response.data));
  }, []);

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
    // if (hiddenCounter > 0) {
    //   revealHidden();
    // }
    axios.get(`/api/tickets?searchText=${textVal}`)
      .then((response) => setTicketArr(response.data));
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
        TicketArr.map((ticket) => <Ticket ticket={ticket} hideItem={hideItem} />)
      }
      </div>
    </div>
  );
}

export default App;
