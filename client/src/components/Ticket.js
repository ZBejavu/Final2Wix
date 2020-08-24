import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import Button from '@material-ui/core/Button';

function Ticket({ ticket }) {
  const {
    content, title, userEmail, labels, creationTime,
  } = ticket;
  const [smallerContent, setSmallerContent] = useState(() => {
    const myString = content;
    let smaller = '';
    if (myString.length > 400) {
      for (let i = 0; i < 400; i++) {
        smaller += myString[i];
      }
      return smaller;
    }
    return myString;
  });
  const [contentToDisplay, setContent] = useState(smallerContent);
  function showMoreOrLess() {
    if (contentToDisplay.length > 400) {
      setContent(smallerContent);
    } else {
      setContent(content);
    }
  }

  return (
    <div className="ticket">
      <div className="hideMe">hide</div>
      <div className="ticketTitle">{title}</div>
      <div className="ticketContent">
        {contentToDisplay}
        {
            // eslint-disable-next-line no-nested-ternary
            (content.length > 400)
              ? (contentToDisplay.length < 401)
                ? <div onClick={() => { showMoreOrLess(); }} className="viewMore">see more</div>
                : <div onClick={() => { showMoreOrLess(); }} className="viewMore">see less</div>
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
                ? labels.map((label) => <Button id="labelBtn" className="label" variant="contained" style={{ textTransform: 'none', marginLeft: '1rem' }} color="primary">{label}</Button>)
                : <div />
            }
        </div>
      </div>
    </div>
  );
}

export default Ticket;
