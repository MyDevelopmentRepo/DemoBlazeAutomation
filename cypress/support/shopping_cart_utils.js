import shoppingCart from '../locators/shopping_cart_locators'
import productPage from '../locators/product_page_locators'
import homePage from '../locators/home_page_locators'
import topMenu from '../locators/top_menu_locators'

Cypress.Commands.add('getOrderId', () => {

  cy.get(shoppingCart.orderDetails.finalBillDetails).should('be.visible').invoke('text').then((text) => {
    cy.log('Full Order Confirmation Text:', text)

    const orderMatch = text.match(/Id:\s(\d+)/)
    const orderId = orderMatch ? orderMatch[1] : null // get orderid

    // Extract Price using Regex
    const priceMatch = text.match(/Amount:\s(\d+\sUSD)/) // get price
    let totalPrice = priceMatch ? priceMatch[1] : null
    totalPrice = parseFloat(totalPrice.replace(' USD', '')) // Remove ' USD' and convert to float from string

    expect(totalPrice).to.not.be.null
    expect(totalPrice).to.be.greaterThan(0)
    expect(orderId).to.not.be.null

    return cy.wrap({ orderId, totalPrice})
  })
})
// As we do not have serach feature in the application, we are writing below methods wihtout pasing any product to add or delete
Cypress.Commands.add('addFirstProduct', (validateAlertText) => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')
  cy.intercept(`${apiBaseUrl}/entries`).as('loadImagesIntercept')
  cy.visit('/')
  cy.wait('@loadImagesIntercept', {timeout: 20000})
  cy.intercept('POST', `${apiBaseUrl}/view`).as('viewProductIntercept')
  cy.get(homePage.products, {timeout: 7000}).should('have.length.greaterThan', 0).eq(0).find('img').should('be.visible').click()
  cy.wait('@viewProductIntercept', {timeout: 20000})
  cy.get(productPage.addToCartButton).should('be.visible').click()

  cy.handleAlert('Product added', validateAlertText)
  cy.log('First Product is added')
})

Cypress.Commands.add('addSecondProduct', (validateAlertText) => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')
  cy.intercept(`${apiBaseUrl}/entries`).as('loadImagesIntercept')
  cy.visit('/')
  cy.wait('@loadImagesIntercept', {timeout: 20000})
  cy.intercept('POST', `${apiBaseUrl}/view`).as('viewProductIntercept')
  cy.get(homePage.products, {timeout: 7000}).should('have.length.greaterThan', 0).eq(1).find('img').should('be.visible').click()
  cy.wait('@viewProductIntercept', {timeout: 20000})
  cy.get(productPage.addToCartButton).should('be.visible').click()
  cy.handleAlert('Product added', validateAlertText)
  cy.log('Second Product is added')
})

Cypress.Commands.add('checkCartIsNotEmpty', () => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')
  cy.intercept('POST', `${apiBaseUrl}/viewcart`).as('viewProductCartIntercept')
  cy.visit('/')
  cy.get(topMenu.cart).should('be.visible').click()
  cy.wait('@viewProductCartIntercept', {timeout: 100000}) // cart is taking too long to load and at times doesnt load at all, hence high timeout
  cy.get(shoppingCart.productDetails.productsList).should('have.length.greaterThan', 0)
})

Cypress.Commands.add('removeTopProduct', () => {
  cy.get(shoppingCart.productDetails.productsList).eq(0).find('td').eq(3).find('a').should('be.visible').click()
})

Cypress.Commands.add('checkCartIsEmpty', () => {
  const apiBaseUrl = Cypress.config('apiBaseUrl')
  cy.intercept('POST', `${apiBaseUrl}/viewcart`).as('viewProductCartIntercept')
  cy.visit('/')
  cy.get(topMenu.cart).should('be.visible').click()
  cy.wait('@viewProductCartIntercept', {timeout: 50000})
  cy.get(shoppingCart.productDetails.productsList).should('not.exist')
})
