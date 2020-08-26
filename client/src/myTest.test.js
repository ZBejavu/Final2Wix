const puppeteer = require('puppeteer');
//const nock = require('nock');
//const request = require('supertest');
const app = require('../../server/app');
//const axios = require('axios');
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
    await (new Promise((resolve) => setTimeout(resolve, 1500)));
    const ActiveListAfterDone = await page.$eval('#ticketsYouSee', e => e.innerText);
    expect(ActiveListAfterDone).toBe((ActiveListBeforeDone-1).toString());
    await (await page.$('#switchLists')).click();
    await (new Promise((resolve) => setTimeout(resolve, 1000)));
    await page.waitForSelector(`.ticket`, {visible: true});
    const ticketTofind = await page.$(`.ticket`);
    const employeId = await ticketTofind.$eval('#myEmploye', e => e.innerText);
    const description = await ticketTofind.$eval('#additionalInfo', e => e.innerText);
    expect(employeId).toBe(myEmployeeId);
    expect(description).toBe(myDescription);
    await (await ticketTofind.$('#openTicketModal')).click()
    await page.type('#requiredId', myEmployeeId);
    await page.type('#additionalInfoField', myDescription);
    await (await page.$('#confirmButton')).click();
    // browser.close();
})