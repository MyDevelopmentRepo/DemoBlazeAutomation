describe('Login User API', () => {

  it('Login Api should return 200 when valid user is provided', function () {
    const user = {username: 'kanchanTest123', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('Auth_token') // response is a String not Json 
      expect(response.body.split(':')[1]).not.be.null // validate the token value to be not null
    })
  })

  it('Login Api should return 401 when non existing user is provided', function () {
    const user = {username: '@^%%^&*876$%*^', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      // url: `${Cypress.config('apiBaseUrl')}/signup`,
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.body.errorMessage.trim()).to.eq('User does not exist.')
      expect(response.status).to.eq(401)
    })
  })

  it('Login Api should return 400 when provided username is blank string with spaces', function () {
    const user = {username: '      ', password: '12345'}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Login Api should return 400 when provided password blank string with spaces', function () {
    const user = {username: 'vcbcvbcvb', password: '    '}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Login Api should return 400 when provided username and password are blank string with spaces', function () {
    const user = {username: '      ', password: '        '}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Login Api should return 400 when body is not passed', function () {
    const user = {}
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/login`,
      body: user
    }).then((response) => {
      expect(response.body.errorMessage).to.eq('Bad parameter, missing username')
      expect(response.status).to.eq(400)
    })
  })
})
