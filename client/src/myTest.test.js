const puppeteer = require('puppeteer');
const nock = require('nock');
const useNock = require('nock-puppeteer');
//const request = require('supertest');
const app = require('../../server/app');
//const axios = require('axios');
const { ExpansionPanelActions } = require('@material-ui/core');

const mockData1 = [
    {
      "id": "dd63145f-6340-5fa7-8619-2f44dbf63fd7",
      "title": "help me",
      "content": "pls i have been trying to run code on a dynamic page but it is not working, i need help pls. thanks",
      "userEmail": "rotif@suob.sh",
      "creationTime": 1514809791415,
      "labels": ["Corvid", "Api"]
    }],
    mockData2 =
    [{
        "id": "dd63145f-6340-5fa7-8619-2f44dbf63fd7",
        "title": "help me",
        "content": "pls i have been trying to run code on a dynamic page but it is not working, i need help pls. thanks",
        "userEmail": "rotif@suob.sh",
        "creationTime": 1514809791415,
        "labels": ["Corvid", "Api"],
        "done": true,
        "employe": "Zach123",
        "reason" : "Handled the Problem",
        "additional": "testing my Feature"
    }];

jest.setTimeout(30000);
test('handlingTicket', async () => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    useNock(page, ['http://localhost:3000/api']);
    
    const getAllTicketsMock = await nock('http://localhost:3000/', { allowUnmocked: true })
      .get('/api/tickets')
      .query(() => true)
      .reply(200, mockData1);

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    const elements = await page.$$('.ticket');
    expect(elements.length).toBe(1);
    await page.waitForSelector('#sorting', {visible: true});
    await page.select('#sorting', '1')
    await page.waitForSelector('#openTicketModal', {visible: true});
    const ActiveListBeforeDone = await page.$eval('#ticketsYouSee', e => e.innerText);
    console.log(ActiveListBeforeDone);

    await (await page.$('#openTicketModal')).click()
    await page.waitForSelector('#myModalVisible', {visible: true});
    const myTicketId = await page.$eval('.ticket', e => e.id)
    console.log('my ticket id:',myTicketId);
    const myEmployeeId ='Zach123';
    const myDescription ='testing my Feature';
    await page.type('#requiredId', myEmployeeId);
    await page.type('#additionalInfoField', myDescription);

        const getAllasdfTicketsMock = await nock('http://localhost:3000/', { allowUnmocked: true })
        .get('/api/tickets')
        .query(() => true)
        .reply(200, mockData2);
        await (await page.$('#confirmButton')).click();
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#switchLists', {visible: true});
    const ActiveListAfterDone = await page.$eval('#ticketsYouSee', e => e.innerText);
    expect(ActiveListAfterDone).toBe((ActiveListBeforeDone-1).toString());
    await (await page.$('#switchLists')).click();
    await page.waitForSelector(`.ticket`, {visible: true});
    const ticketTofind = await page.$(`.ticket`);
    const employeId = await ticketTofind.$eval('#myEmploye', e => e.innerText);
    const description = await ticketTofind.$eval('#additionalInfo', e => e.innerText);
    const myReason = await ticketTofind.$eval('#myReason', e => e.innerText);
    expect(employeId).toBe(myEmployeeId);
    expect(description).toBe(myDescription);
    expect(myReason).toBe('Handled the Problem');
    browser.close();
})