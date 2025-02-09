import topMenu from '../../locators/top_menu_locators'
import shoppingCart from '../../locators/shopping_cart_locators'

describe('Shopping Cart tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Verify user is able add product to cart', function () {
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
  })

  it('Verify user is able add and view multiple products and verify total price in the cart', function () {
    cy.fixture('products_pricelist').as('productList')
    cy.addFirstProduct(true)
    cy.addFirstProduct(true) // adding two quantity of first product
    cy.addSecondProduct(true)
    cy.get(topMenu.cart).should('be.visible').click()
    cy.get(shoppingCart.productDetails.productsList).each((ele) => { // looping through each product in the cart
      cy.wrap(ele).find('td').eq(1).invoke('text').then((name) => { // get name of the product from the cart
        cy.wrap(ele).find('td').eq(2).invoke('text').then((price) => { // get price of the product from the cart
          const expectedProduct = this.productList.find(p => p.name.trim() === name.trim()) // compare the cart product name with the fixture test data

          if (expectedProduct) {
            expect(price.trim()).to.equal(expectedProduct.price) // Verify price
            expect(name.trim()).to.equal(expectedProduct.name) // Verify name
          }
        })
      })
    })

    cy.get(shoppingCart.productDetails.totalPrice).should('have.text', '1540') // Verify total price
  })

  it('Verify user is able remove products from the cart', function () {
    cy.addFirstProduct(true)
    cy.addSecondProduct(true)
    cy.checkCartIsNotEmpty()
    cy.removeTopProduct() // removing the first product
    cy.removeTopProduct() // removing the second product
  })

  it('Verify guest user should not be able to place order', function () {
    cy.addFirstProduct(true)
    cy.checkCartIsNotEmpty()
    cy.get(shoppingCart.productDetails.placeOrderButton).should('be.visible').click()
    cy.wait(150) // putting static wait as aliasing,timeout,retries  are not wokring
    cy.get(shoppingCart.placeOrderUserDetails.placeOrderModal).should('not.be.visible')
  })
})
