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
  useEffect(() => {
    const newDate = new Date(1542111235544);
    console.log(newDate);
    axios.get('/api/tickets').then((response) => setTicketArr(response.data));
  }, []);
  async function filterTickets(textVal) {
    const { data } = await axios.get(`/api/tickets?searchText=${textVal}`);
    setTicketArr(data);
    // axios.get(`/api/tickets/?searchText=${textVal}`)
    //   .then((response) => { setTicketArr(response.data); });
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
          Showing
          {TicketArr.length}
          {' '}
          Results
        </div>
        {
        TicketArr.map((ticket) => <Ticket ticket={ticket} />)
      }
      </div>
    </div>
  );
}

export default App;
