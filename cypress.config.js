const { defineConfig } = require('cypress')
const { allureCypress } = require('allure-cypress/reporter')
// import { allureCypress } from 'allure-cypress/reporter'

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: 'cypress/allure-results'
      })
      return config
    // implement node event listeners here
    },
    baseUrl: 'https://www.demoblaze.com',
    apiBaseUrl: 'https://api.demoblaze.com',
    video: true

  }

})
