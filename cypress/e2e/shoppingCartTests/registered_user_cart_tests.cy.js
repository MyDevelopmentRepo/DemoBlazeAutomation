import topMenu from '../../locators/top_menu_locators'
import shoppingCart from '../../locators/shopping_cart_locators'

describe('Shopping Cart tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.registerUser().then((user) => {
      cy.wrap(user).as('loggedInUser')
      cy.loginViaAPI(user).then((authToken) => {
        cy.setCookie('tokenp_', authToken)
      }
      )
      cy.fixture('invalid_card_numbers').as('invalidCards')
    })
  })

  it('Verify logged in user is able to place order', function () {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()

    // Fill user details
    cy.get(shoppingCart.placeOrderUserDetails.country).should('be.visible').type('Sweden')
    cy.get(shoppingCart.placeOrderUserDetails.city).should('be.visible').type('solna')
    cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').type('1234567890')
    cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').type('Test User')
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()

    // Verify order details
    cy.getOrderId().then(({ orderId, totalPrice }) => {
      cy.log(`Order with  ID: ${orderId} and Total Price: ${totalPrice} is placed successfully`)
    })

    cy.checkCartIsEmpty() // Verify cart is empty once order is placed
  })

  it('Verify cart remains unchanged after user logs out and logs back in.', function () {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()

    // Log out
    cy.get(topMenu.logout).should('be.visible').click()

    // once you logs our cart should be empty
    cy.checkCartIsEmpty()

    // Log back in
    cy.get('@loggedInUser').then((user) => {
      cy.loginViaAPI(user)
      cy.getCookie('tokenp_').should('exist')
    })

    // Verify cart remains the same
    cy.visit('/')
    cy.get(topMenu.cart).should('be.visible').click()
    cy.get(shoppingCart.productDetails.productsList).should('have.length', 1) // there should be at least one product in the cart
    cy.get(shoppingCart.productDetails.productsList).eq(0).find('td').eq(1).should('have.text', 'Samsung galaxy s6') // Verify product name

  })

  it('Verify logged in user should not be able to place order when cart is empty', function () {
    cy.getCookie('tokenp_').should('exist')
    cy.checkCartIsEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()
    cy.wait(150) // putting static wait as aliasing,timeout,retries  are not wokring
    cy.get(shoppingCart.placeOrderUserDetails.placeOrderModal).as('placeOrderAlias')
    cy.get('@placeOrderAlias').should('not.be.visible')
  })

  it('Verify logged in user should not be able to place order if name or card is missing', () => {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(false)
    cy.checkCartIsNotEmpty()

    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()

    // passing card and name as null
    cy.get(shoppingCart.placeOrderUserDetails.card).clear()
    cy.get(shoppingCart.placeOrderUserDetails.name).clear()
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
    cy.handleAlert('Please fill out Name and Creditcard.', true)

    // passing  name as blank
    cy.get(shoppingCart.placeOrderUserDetails.name).clear()
    cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').type('1234567890')
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
    cy.handleAlert('Please fill out Name and Creditcard.', true)

    // passing  card as null
    cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').type('test name')
    cy.get(shoppingCart.placeOrderUserDetails.card).clear()
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
    cy.handleAlert('Please fill out Name and Creditcard.', true)
  })

  it('Verify logged in user should not be able to place order if name and card are blank strings with spaces', () => {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()
    cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').invoke('val', '    ').trigger('input')
    cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').invoke('val', '    ').trigger('input')
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
    cy.get(shoppingCart.orderDetails.finalBillDetails).eq(0).should('not.be.visible')
  })

  it('Verify logged in user should not be able to place order if country and city are missing', () => {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()
    cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').invoke('val', '1234567890').trigger('input') // keeping country and city as blank
    cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').type('Test User')
    cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
    cy.get(shoppingCart.orderDetails.finalBillDetails).eq(0).should('not.be.visible')
  })

  it('Verify logged in user should not be able to place order if card number is invalid', function () {
    cy.getCookie('tokenp_').should('exist')
    this.invalidCards.cardNumbers.forEach((cardNumber) => {
      cy.log(`Checking card number ${cardNumber} `)
      cy.addFirstProduct(true)
      cy.checkCartIsNotEmpty()
      cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()
      cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').invoke('val', cardNumber).trigger('input')
      cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').type('test name')
      cy.get(shoppingCart.placeOrderUserDetails.purchaseButton).should('be.visible').click()
      cy.get(shoppingCart.orderDetails.finalBillDetails).eq(0).should('not.be.visible')
    })
  })

  it('Verify if checkout is cancelled, products in the cart remain unchanged', function () {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()

    // Fill user details

    cy.get(shoppingCart.placeOrderUserDetails.country).should('be.visible').type('Sweden')
    cy.get(shoppingCart.placeOrderUserDetails.city).should('be.visible').type('solna')
    cy.get(shoppingCart.placeOrderUserDetails.card).should('be.visible').type('1234567890')
    cy.get(shoppingCart.placeOrderUserDetails.name).should('be.visible').type('Test User')
    cy.get(shoppingCart.placeOrderUserDetails.closeButton).should('be.visible').click()
    cy.checkCartIsNotEmpty() // Verify cart is not empty once orderis placed
  })

  it('Verify if page is reloaded or redirected, products in the cart remain unchanged', function () {
    cy.getCookie('tokenp_').should('exist')
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.reload()
    cy.checkCartIsNotEmpty() // Verify cart is not empty once orderis placed
  })
})
