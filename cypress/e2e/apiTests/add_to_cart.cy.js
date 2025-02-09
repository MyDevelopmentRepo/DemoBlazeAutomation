describe('AddToCart User API', () => {

  beforeEach(() => {
    let requestBody
    const user = {'username': 'APIAutomation_818c41c7-4bd1-4cb0-babf-bbe1327cc77e', 'password': 'password123'}
    cy.loginViaAPI(user).then((authToken) => {
      cy.log(`authToken ${authToken}`)
      requestBody = {
        'id': '10d53be8-5551-011f-30bb-fd32c6a1128e',
        'cookie': authToken,
        'prod_id': '1',
        'flag': true
      }
      cy.wrap(requestBody).as('requestBody')
    })
  })

  it('AddToCart Api should return 200 when valid data is provided with flag', function () {
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  it('AddToCart Api should return 400 when wrong product id is provided', function () {
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      requestBody.prod_id = 345678923455 // passing any random number
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.not.be.undefined // some error mesage should appear

      })
    })
  })


  it('AddToCart Api should return 400 when product id passed is blank string', function () { // same behaviour for flag true or false
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      requestBody.prod_id = "" // passing blank string
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.status).to.eq(400)     

      })
    })
  })


  it('AddToCart Api should return 400 when product id key removed from object', function () { // same behaviour for flag true or false
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      let updatedReqBody = { ... requestBody };
      delete updatedReqBody.prod_id;      // remove the product id key value pair from the object 
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: updatedReqBody
      }).then((response) => {
        expect(response.body.errorMessage).to.eq('Bad parameter, token malformed.')
        expect(response.status).to.eq(400)     

      })
    })
  })
     it('AddToCart Api should return 400 when flag key is not passed at all', function () { // same behaviour for flag true or false
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      let updatedReqBody = { ... requestBody };
      delete updatedReqBody.flag;      // remove the flag key value pair from the object 
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: updatedReqBody
      }).then((response) => {
        expect(response.body.errorMessage).to.eq('Bad parameter, flag is incorrect.')
        expect(response.status).to.eq(400)     

      })
    })
  })

  


  it('AddToCart Api should return 200 when wrong id is provided', function () {  // same behaviour for flag true or false
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      requestBody.id = "344yhh6768u87"
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.status).to.eq(200)

      })
    })
  })

  it('AddToCart Api should return 400 when (cookie , id) keys, are removed from object', function () {   // same behaviour for flag true or false
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      let updatedReqBody = { ... requestBody };
      delete updatedReqBody.cookie;      // remove the cookie key value pair from the object 
      delete updatedReqBody.id;    
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: updatedReqBody
      }).then((response) => {
        expect(response.body.errorMessage).to.eq('Bad parameter, token malformed.')
        expect(response.status).to.eq(400)     

      })
    })
  })


  it('AddToCart Api should return 500 when id is passed as blank string', function () { // same behaviour for flag true or false
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.get('@requestBody').then((requestBody) => {
      requestBody.id = "" 
      requestBody.flag = false                  
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody,
        failOnStatusCode: false 
      }).then((response) => {
        expect(response.body).to.be.contain("500 Internal Server Error")   
        expect(response.status).to.eq(500)
       
      })
    })
  })



  it('AddToCart Api should return 400 when wrong cookie is provided with flag true', function () {
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      requestBody.cookie = "ffdgfdg4343543" 
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.body.errorMessage).to.eq('Bad parameter, token malformed.')
        expect(response.status).to.eq(400)

      })
    })
  })



  it('AddToCart Api should return 200 when wrong cookie is provided with flag false', function () {
    cy.get('@requestBody').then((requestBody) => {
      let apiBaseUrl = Cypress.config('apiBaseUrl')
      requestBody.cookie = "sadsa%^^335fdf78889" // passing any random key
      requestBody.flag = false                   // when flat is true, cookie is validated else not
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.body).to.be.undefined   // no error message should appear in body
        expect(response.status).to.eq(200)
       
      })
    })
  })








  it('AddToCart Api should return 500 when cookie is passed as blank string with flag true', function () { 
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.get('@requestBody').then((requestBody) => {
      requestBody.cookie = "" 
      requestBody.flag = true                  
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody,
        failOnStatusCode: false 
      }).then((response) => {
        expect(response.body).to.be.contain("500 Internal Server Error")     
        expect(response.status).to.eq(500)
       
      })
    })
  })


  it('AddToCart Api should return 200 when cookie is passed as blank string with flag false', function () { 
    let apiBaseUrl = Cypress.config('apiBaseUrl')
    cy.get('@requestBody').then((requestBody) => {
      requestBody.cookie = "" 
      requestBody.flag = false                  
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/addtocart`,
        body: requestBody
      }).then((response) => {
        expect(response.status).to.eq(200)
       
      })
    })
  })


})
