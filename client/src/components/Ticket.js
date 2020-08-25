import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import Ticket from './components/Ticket'
import Button from '@material-ui/core/Button';

function Ticket(props) {
  const {
    content, title, userEmail, labels, creationTime, id, hidden,
  } = props.ticket;


  const smallerContentFunc = () => {
    const myString = content;
    let smaller = '';
    let strArr = myString.split('\n');

    if(strArr.length > 4){
      let newArr=[];
      for( let i = 0; i<4; i++){
        newArr.push(strArr[i]);
      }
      return newArr;
    }
    else if (myString.length > 420) {
      for (let i = 0; i < 420; i++) {
        smaller += myString[i];
      }
      return smaller.split('\n');
    }
    return myString.split('\n');
  };



  const smallerContent = smallerContentFunc();
  //let arr = str.split('\n');
  let str = content;
  let arr2 = str.split('\n');

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

  let subject = 'Re: ';
  function buildingDate() {
    const newDate = new Date(creationTime);
    const year = `${(newDate.getMonth() === 12) ? 1 : newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
    //const day = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    const day = newDate.toLocaleTimeString();
    return (`${year} , ${day}`);
  }
  subject += title;
  return (
    hidden ? <div />
      : (
        <div className="ticket">
          <div className="hideTicketButton" onClick={() => { props.hideItem(id); }}>hide</div>
          <div className="ticketTitle">{title}</div>
          <div className="ticketContent">
            {contentToDisplay.map(line=> <div>{line}</div>)}
            {
            // eslint-disable-next-line no-nested-ternary
            (content.length > 420 || arr2.length > 4)
              ? (contentToDisplay.length < 5)
                ? <div onClick={() => { showMoreOrLess(); }} className="viewMore">see more</div>
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
        </div>
      )
  );
}

export default Ticket;
