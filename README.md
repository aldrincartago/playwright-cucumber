### Prerequisites
Before running this project, make sure you have Node.js and npm installed.
Install the project dependencies:

1 `npm install`

Install the necessary Playwright browsers:

2 `npx playwright install `
### Run Tests
Execute the tests with the following command:

`npm run test`

### Example Test with Cucumber
Here's a sample scenario written in Gherkin syntax:


```gherkin
Feature: Check24 Main Page

  Scenario: Search for Products
    Given I open Check24 page
    When I search for "PS5"
    Then I am on product result page
```

### Running Tests in Non-Headless Mode
By default, tests run in headless mode (without displaying a browser). 
To check the test execution in a browser window, set the headless option to `false` in the "GlobalHooks.js" file:
```js
this.browser = await chromium.launch({ headless: false });
```

### Test Artifacts for Debugging
The project generates test artifacts for failed tests, which are stored in the test-artefacts directory at the root of the project. 
These include:

- **Screenshots**: Captured at the moment a test fails.
- **Traces**: Provides a detailed view of the test execution, which can be reviewed in Playwright's Trace Viewer.
- **Videos**: Recorded for each test scenario.

### Reviewing Test Artifact trace
To review trace files, open them using Playwright's Trace Viewer:

```sh
npx playwright show-trace tests/test-artefacts/traces/<trace-file-name>.zip
```
Replace <trace-file-name> with the actual name of the trace file you want to view.

### Independent Cucumber Runner Configuration
The Cucumber runner used in this project is independent of the Playwright test runner configuration specified in playwright.config.js. 
This means that any settings in the Playwright configuration file do not apply to the Cucumber scenarios execution.