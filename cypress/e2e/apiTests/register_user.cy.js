import { v4 as uuidv4 } from 'uuid'
describe('Register User API', () => {

  it('Register Api should register a new user when valid data is provided', function () {
    const user = {username: `APIAutomation_${uuidv4()}`, password: 'password123'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(200) // API is returning 200 not 201
      cy.log(`User ${user.username} registered successfully`)
    })
  })

  it('Register Api should return error , status 4xx when an existing user is provided', function () {
    const user = {username: 'kanchanTest123', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.body.errorMessage).to.eq('This user already exist.')
      expect(response.status).to.match(/^4\d{2}$/) // match any 4xx series code  
    })
  })

  it('Register Api should return 400 when an invalid username is provided', function () {
    const user = {username: '$%$#$%%^$%', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Register Api should return 400 when provided username is blank string with spaces', function () {
    const user = {username: '       ', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Register Api should return 400 when provided password blank string with spaces', function () {
    const user = {username: 'vcbcvbcvb', password: '    '}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Register Api should return 400 when provided username and password are blank string with spaces', function () {
    const user = {username: '        ', password: '        '}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Register Api should return 400 when body is not passsed', function () {
    const user = {}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/signup`,
      body: user
    }).then((response) => {
      expect(response.body.errorMessage).to.eq('Bad parameter, missing username or password')
      expect(response.status).to.eq(400)
    })
  })
})
