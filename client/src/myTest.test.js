const puppeteer = require('puppeteer');
//const nock = require('nock');
//const request = require('supertest');
const app = require('../../server/app');
const { ExpansionPanelActions } = require('@material-ui/core');
jest.setTimeout(30000);
test('handlingTicket', async () => {
    let browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();
    await page.goto('http://localhost:3000/');
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
    await (await page.$('#confirmButton')).click();
    await (new Promise((resolve) => setTimeout(resolve, 3000)));
    const ActiveListAfterDone = await page.$eval('#ticketsYouSee', e => e.innerText);
    expect(ActiveListAfterDone).toBe((ActiveListBeforeDone-1).toString());
    // const { body } = await request(app)
    //   .post(`/api/tickets/${myTicketId}/undone}`)
    //   .expect(200)
    //   expect(body.updated).toBe(true);
    await (await page.$('#switchLists')).click();
    await (new Promise((resolve) => setTimeout(resolve, 1000)));
    const ticketTOfind = await page.$(`#${myTicketId}`);
    const employeId = await ticketTOfind.$eval('#myEmploye', e => e.innerText);
    console.log('foundemploye', employeId);
    expect(employeId).toBe(myEmployeeId);
    browser.close();
})