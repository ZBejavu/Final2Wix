// import React, { useEffect, useState } from 'react';
import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import axios from 'axios';
import Ticket from './components/Ticket';
import Header from './components/Header';

import './App.css';

function App() {
  const [TicketArr, setTicketArr] = useState([]);
  useEffect(() => {
    axios.get('/api/tickets').then((response) => setTicketArr(response.data));
  }, []);
  return (
    <div className="myApp">
      <Header />
      <div className="ticketContainer">
        {
        TicketArr.map((ticket) => <Ticket ticket={ticket} />)
      }
      </div>
    </div>
  );
}

export default App;
