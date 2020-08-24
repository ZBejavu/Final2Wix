import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import axios from 'axios';

function Ticket({ ticket }) {
  const {
    content, title, userEmail, labels, creationTime,
  } = ticket;
  const [smallerContent, setSmallerContent] = useState(() => {
    const myString = content;
    let smaller = '';
    if (myString.length > 260) {
      for (let i = 0; i < 260; i++) {
        smaller += myString[i];
      }
      return smaller;
    }
    return myString;
  });
  const [contentToDisplay, setContent] = useState(smallerContent);
  function showMoreOrLess() {
    if (contentToDisplay.length > 260) {
      setContent(smallerContent);
    } else {
      setContent(content);
    }
  }

  return (
    <div className="ticket">
      <div className="ticketTitle">{title}</div>
      <div className="ticketContent">
        {contentToDisplay}
        {
            (content.length > 260)
              ? (contentToDisplay.length < 261)
                ? <div onClick={()=>{showMoreOrLess()}} className="viewMore">show more</div>
                : <div onClick={()=>{showMoreOrLess()}} className="viewMore">show less</div>
              : <div />
        }
      </div>
      <div className="ticketFooter">
        <div className="mailAndTime">
          <div className="mail">{userEmail}</div>
          <div className="time">
            {' '}
            |
            {creationTime}
          </div>
        </div>
        <div className="labels">
          {
              (labels)
                ? labels.map((label) => <button className="labelBtn">{label}</button>)
                : <div />
            }
        </div>
      </div>
    </div>
  );
}

export default Ticket;
