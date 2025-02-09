import homePage from '../../locators/home_page_locators'
import { siteConstants } from '../../constants/site_constants'

describe('Responsiveness on different devices', () => {
  beforeEach(() => {
    cy.fixture('devices-viewports').as('viewports')
  })

  it('Verify that application Should display correctly on Mobile devices', function () {
    this.viewports.mobile.forEach((device) => {
      cy.viewport(device) // Set viewport based on the device name
      cy.visit('/')

      cy.log(`Testing on: ${device}`)
      // check top left brand logo is present
      cy.get(homePage.brandLogo).should('be.visible').find('img').should('have.attr', 'src', 'bm.png')
      cy.get(homePage.brandLogo).then((ele) => {
        const text = ele.text().trim()
        expect(text).to.equal(siteConstants.PRODUCT_STORE)
      })

      cy.checkIfTopMenuIsPresent()
      cy.checkIfCategoriesArePresent()

      // check if products are present and atleast one product is visible
      cy.get(homePage.products).should('have.length.greaterThan', 0).eq(0).should('be.visible')

      // check if  devices slider has devices and first device image is visible
      cy.get(homePage.devicesSlider).should('be.visible').should('have.length.greaterThan', 0).eq(0).find('img').should('be.visible')

      cy.checkIfFooterIsPresent()
    })
  })

  it('Verify that application Should display correctly on Desktop devices', function () {
    this.viewports.desktop.forEach((device) => {
      cy.viewport(device) // Set viewport based on the device name
      cy.visit('/')

      cy.log(`Testing on: ${device}`)
      // check top left brand logo is present
      cy.get(homePage.brandLogo).should('be.visible').find('img').should('have.attr', 'src', 'bm.png')
      cy.get(homePage.brandLogo).then((ele) => {
        const text = ele.text().trim()
        expect(text).to.equal(siteConstants.PRODUCT_STORE)
      })

      cy.checkIfTopMenuIsPresent()
      cy.checkIfCategoriesArePresent()

      // check if products are present and atleast one product is visible
      cy.get(homePage.products).should('have.length.greaterThan', 0).eq(0).should('be.visible')

      // check if  devices slider has devices and first device image is visible
      cy.get(homePage.devicesSlider).should('be.visible').should('have.length.greaterThan', 0).eq(0).find('img').should('be.visible')

      cy.checkIfFooterIsPresent()
    })
  })
})
