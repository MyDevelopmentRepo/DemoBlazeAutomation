# DemoBlazeAutomation

Instructions on how to run the tests:

Prerequisites:

Node.js should be installed
Visual Studio code should be installed
Chrome browser should be installed

Steps:

Clone the repo in your local machine

Open the cloned project in VS code.(File-> Add Folder to workspace)

Open command line terminal in VS code (Right Click on the project folder -> Open in integrated terminal)

Run the command : npm install This would install all the dependencies specified in package.json file

To install cypress, run command : 

npm install cypress --save-dev

To install allure serve reports, run below commands

  npm install --save-dev allure-cypress
  npm install rimraf --save-dev   

To run the project and generate reports execute below commands in order:

npm run clean:allure 
npx cypress run  
npm run allure:report
npm run allure:serve 

This will delete older reports and generate new and open allure web report.


 
