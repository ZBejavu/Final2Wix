import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from 'axios';

function CloseModal(props) {
  const [closeReason, setCloseReason] = useState('Handled the Problem');
  const [employeId, setEmployeId] = useState(undefined);
  const [addedInfo, setAddedInfo] = useState(undefined);
  useEffect(() => {
    setEmployeId(undefined);
    setAddedInfo(undefined);
  }, [props.state]);

  function handlingTicketClosing() {
    if (!props.ticketData.done) {
      axios.post(`/api/tickets/${props.ticketData.id}/done?employe=${employeId}&reason=${closeReason}&additional=${addedInfo}`)
        .then(() => { props.settingState(false); props.refreshList(''); });
    } else {
      axios.post(`/api/tickets/${props.ticketData.id}/undone?employe=${employeId}&additional=${addedInfo}`)
        .then(() => { props.settingState(false); props.refreshList(''); });
    }
  }

  return (
    <Modal
      open={props.state}
      onClose={() => { props.settingState(false); }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div
        id="myModalVisible"
        style={props.ticketData.done ? { backgroundColor: 'rgb(132, 209, 164)', top: '50%', left: '50%' } : { top: '50%', left: '50%' }}
        className="paper"
      >
        <div className="closeModal" onClick={() => props.settingState(false)}>X</div>
        <h2 id="simple-modal-title">{props.ticketData.done ? 'Reopen Ticket, Are you Sure?' : 'Closing Ticket'}</h2>
        <div id="simple-modal-description">
          <h3>
            Ticket Title :
            <span style={{ fontWeight: '400' }}>{props.ticketData.title}</span>
          </h3>

          <div style={{ display: 'flex' }}>
            <div className="employeId">Employee id: </div>
            <TextField style={{ display: 'inline-block' }} label="Required" placeholder="enter name" onChange={(e) => { setEmployeId(e.target.value); }} />
          </div>
          {
            !props.ticketData.done && (
              <div style={{ display: 'flex' }}>
                <div className="employeId" style={{ marginTop: '5%' }}>Closing Reason</div>
                <NativeSelect
                  name="Sort By:"
                  onChange={(e) => setCloseReason(e.target.value)}
                  inputProps={{
                    name: 'age',
                    id: 'age-native-helper',
                  }}
                >
                  <option value="Handled the Problem">Handled the Problem</option>
                  <option value="Outdated">Outdated</option>
                  <option value="Customer Unreachable">Customer Unreachable</option>
                </NativeSelect>
              </div>
            )
          }
          <div className="employeId" style={{ marginTop: '5%', width: '40%' }}>Additional information (optional)</div>
          <TextField multiline style={{ width: '70%', height: '20%' }} label="..." placeholder="..." onChange={(e) => { setAddedInfo(e.target.value); }} />
          <Button disabled={!employeId} onClick={() => { handlingTicketClosing(); }} id="modalbtn" variant="contained" color="">{props.ticketData.done ? 'Confirm ' : 'Submit Ticket'}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default CloseModal;
