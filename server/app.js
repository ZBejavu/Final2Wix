const express = require('express');

const app = express();

const filePath = process.env.ZACH_STORAGE || 'data.json';

const fs = require('fs');

app.use(express.static('../client/build'));

app.get('/api/tickets', (req, res) => {
  const data = fs.readFileSync(filePath);
  const tickets = JSON.parse(data);
  if (req.query.searchText && req.query.searchText !== '') {
    // eslint-disable-next-line max-len
    const filteredArr = tickets.filter((ticket) => {
      const lowerCaseTitle = ticket.title.toLowerCase();
      const lowerCaseQuery = req.query.searchText.toLowerCase();
      return lowerCaseTitle.indexOf(lowerCaseQuery) !== -1;
    });
    res.send(filteredArr);
  } else {
    res.send(tickets);
  }
});

app.post('/api/tickets/:ticketId/done', (req, res) => {
  const data = fs.readFileSync(filePath);
  const tickets = JSON.parse(data);
  let found = false;
  tickets.forEach((ticket, i) => {
    if (ticket.id === req.params.ticketId) {
      const prevState = tickets[i].done;
      found = true;
      // console.log(tickets[i]);
      if (!prevState) {
        tickets[i].done = true;
        tickets[i].employe = req.query.employe;
        tickets[i].reason = req.query.reason;
        tickets[i].additional = req.query.additional;
        const dataInJson = JSON.stringify(tickets, null, 2);
        fs.writeFile(filePath, dataInJson, (e) => {
          if (e) { console.log(e); }
          console.log('filesave');
          res.send({ updated: true });
        });
      } else {
        res.send({ updated: false });
      }
    }
  });
  if (!found) {
    res.status(404).send('not found');
  }
});

app.post('/api/tickets/:ticketId/undone', (req, res) => {
  const data = fs.readFileSync(filePath);
  const tickets = JSON.parse(data);
  let found = false;
  tickets.forEach(async (ticket, i) => {
    if (ticket.id === req.params.ticketId) {
      const prevState = tickets[i].done;
      found = true;
      // console.log(tickets[i]);
      if (!prevState) {
        res.send({ updated: false });
      } else {
        delete tickets[i].done;
        tickets[i].employe = req.query.employe;
        tickets[i].additional = req.query.additional;
        delete tickets[i].reason;
        const dataInJson = JSON.stringify(tickets, null, 2);
        fs.writeFile(filePath, dataInJson, (e) => {
          if (e) { console.log(e); }
          console.log('filesave');
          res.send({ updated: true });
        });
      }
    }
  });
  if (!found) {
    res.status(404).send('not found');
  }
});

module.exports = app;
