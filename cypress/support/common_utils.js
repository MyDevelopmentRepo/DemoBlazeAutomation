import { v4 as uuidv4 } from 'uuid'

Cypress.Commands.add('registerUser', () => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')
  const user = {username: generateRandomUsername(),  password: '12345' }
  return cy.request({
    method: 'POST',
    url: `${apiBaseUrl}/signup`,
    body: user,
    headers: { 'Content-Type': 'application/json'}
  }).then((response) => {
    expect(response.status).to.eq(200)
    return cy.wrap(user)
  })
})

Cypress.Commands.add('loginViaAPI', (user) => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')

  cy.request({
    method: 'POST',
    url: `${apiBaseUrl}/login`,
    body: user,
    headers: { 'Content-Type': 'application/json'}
  }).then((response) => {
    console.log(response.body)
    expect(response.status).to.eq(200)
    return cy.wrap(response.body.replace('Auth_token: ', '').trim())
  })
})

Cypress.Commands.add('handleAlert', (expectedText, validateAlertText) => {
  cy.removeListener('window:alert', () => {
  })
  cy.wait(500) // Wait for the alert to appear on Ui ,else sometimes alert is missed
  cy.on('window:alert', (text) => {
    if (validateAlertText) {
      expect(text.trim().replace(/\./g, '')).to.equal(expectedText.trim().replace(/\./g, ''))
    }
    return true
  })
})

function generateRandomUsername () {
  const prefix = 'Automation'
  const uniqueId = uuidv4().split('-')[0]; // Take first part of UUID (8 characters)
  return `${prefix}_${uniqueId}`
}
