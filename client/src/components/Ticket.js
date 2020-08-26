import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import Button from '@material-ui/core/Button';
import CloseModal from './CloseModal';

function Ticket(props) {
  const {
    content, title, userEmail, labels, creationTime, id,
  } = props.ticket;
  const [closingTicket, setClosingTicket] = useState(false);

  const smallerContentFunc = () => {
    const temp = content.replace('\n\n', '\n');
    const myString = temp.replace('\n \n', '\n');
    let smaller = '';
    if (myString.indexOf('\n') !== -1) {
      const strArr = myString.split('\n');
      if (strArr.length > 4) {
        const newArr = [];
        for (let i = 0; i < 4; i++) {
          newArr.push(strArr[i]);
        }
        return newArr;
      }
    }
    if (myString.length > 420) {
      for (let i = 0; i < 420; i++) {
        smaller += myString[i];
      }
      return smaller.split('\n');
    }
    return myString.split('\n');
  };

  const smallerContent = smallerContentFunc();
  // let arr = str.split('\n');
  const str = content;
  const arr2 = str.split('\n');

  const [contentToDisplay, setContent] = useState(smallerContent);

  function showMoreOrLess() {
    if (contentToDisplay.length === arr2.length) {
      setContent(smallerContent);
    } else {
      setContent(arr2);
    }
  }
  useEffect(() => {
    setContent(smallerContent);
  }, [props]);

  const subject = `Re: ${title}`;
  function buildingDate() {
    const newDate = new Date(creationTime);
    const year = `${(newDate.getMonth() === 12) ? 1 : newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
    // const day = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    const day = newDate.toLocaleTimeString();
    return (`${year} , ${day}`);
  }

  return (
    <div
      id={`${id}`}
      className="ticket"
      style={props.ticket.done ? { backgroundColor: 'rgb(168, 60, 60)' }
        : props.ticket.employe ? { backgroundColor: 'rgb(132, 209, 164)' } : { backgroundColor: 'rgb(180, 199, 216)' }}
    >

      <div className="hideTicketButton" onClick={() => { props.hideItem(id); }}>hide</div>
      <div id={title} className="ticketTitle">{title}</div>

      <div className="ticketContent">
        {contentToDisplay.map((line) => <div>{line}</div>)}
        {
          // eslint-disable-next-line no-nested-ternary
          (content.length > 420 || (arr2.length > 4 && ((arr2[4] !== '' && arr2[4] !== ' ') || (arr2[5] !== '' && arr2[5] !== ' '))))
            ? (contentToDisplay.length < 5) ? <div onClick={() => { showMoreOrLess(); }} className="viewMore">see more</div>
              : <div onClick={() => { showMoreOrLess(); }} className="viewMore">see less</div>
            : <div />
        }
      </div>

      <div className="ticketFooter">
        <div className="mailAndTime">
          <div className="mail"><a href={`mailto:${userEmail}?subject=${subject}`} target="blank">{userEmail}</a></div>
          <div className="time">
            {buildingDate()}
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

      {props.ticket.employe && (
        <div>
          <b>{props.ticket.done ? 'Closed By : ' : 'Reopened by : '}</b>
          <span id='myEmploye'>{props.ticket.employe}</span>
        </div>
      )}

      {props.ticket.reason && (
        <div>
          <b>{'Reason : '}</b>
          {props.ticket.reason}
        </div>
      )}

      {(props.ticket.additional && props.ticket.additional !== 'undefined') && (
        <div>
          <b>Added info :</b>
          <span id='additionalInfo'>{props.ticket.additional}</span>
        </div>
      )}

      <div
        id ='openTicketModal'
        style={props.ticket.done ? { float: 'right', color: 'white', marginTop: '1vh' }
          : { float: 'right', color: 'rgb(126, 33, 33)', marginTop: '1vh' }}
        className="hideTicketButton"
        onClick={() => { setClosingTicket(true); }}
      >
        {props.ticket.done ? 'REOPEN TICKET' : 'CLOSE TICKET'}
      </div>

      <CloseModal
        state={closingTicket}
        ticketData={props.ticket}
        settingState={setClosingTicket}
        refreshList={props.refreshList}
      />

    </div>
  );
}

export default Ticket;
