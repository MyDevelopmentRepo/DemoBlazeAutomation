import topMenu from '../locators/top_menu_locators'
import homePage from '../locators/home_page_locators'
import { siteConstants } from '../constants/site_constants'

Cypress.Commands.add('checkIfTopMenuIsPresent', () => {
  cy.get(topMenu.cart).should('be.visible').should('have.text', 'Cart')
  cy.get(topMenu.login).should('be.visible').should('have.text', 'Log in')
  cy.get(topMenu.signUp).should('be.visible').should('have.text', 'Sign up')
  cy.get(topMenu.contact).should('be.visible').should('have.text', 'Contact')
  cy.get(topMenu.aboutUs).should('be.visible').should('have.text', 'About us')
  cy.get(topMenu.home).should('be.visible').then((ele) => {
    const text = ele.text().trim()
    expect(text).to.include(siteConstants.HOME)
  })
})

Cypress.Commands.add('checkIfFooterIsPresent', () => {
  cy.get(homePage.footerAboutUs).should('be.visible').should('have.text', 'About Us')
  cy.get(homePage.footerGetInTouch).should('be.visible').should('have.text', 'Get in Touch')
  cy.get(homePage.footerBrandLogo).should('be.visible').find('img').should('have.attr', 'src', 'bm.png')
  cy.get(homePage.footerBrandLogo).then((ele) => {
    const text = ele.text().trim()
    expect(text).to.equal(siteConstants.PRODUCT_STORE)
  })
  cy.get(homePage.copyright).should('be.visible').should('have.text', siteConstants.COPYRIGHT_TEXT)
})

Cypress.Commands.add('checkIfCategoriesArePresent', () => {
  cy.get(homePage.categories).should('be.visible').nextAll('a').eq(0).should('have.text', siteConstants.PHONES)
  cy.get(homePage.categories).should('be.visible').nextAll('a').eq(1).should('have.text', siteConstants.LAPTOPS)
  cy.get(homePage.categories).should('be.visible').nextAll('a').eq(2).should('have.text', siteConstants.MONITORS)
})
