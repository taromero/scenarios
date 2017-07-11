var co = require('co')
var scenarioRunner = require('./scenario-runner')

co(() => scenarioRunner.execute())
  .then((exitCode) => process.exit(exitCode))
  .catch((err) => {
    console.error('error while running scenarios:', err)
    process.exit(1)
  })
