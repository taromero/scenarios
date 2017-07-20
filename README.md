# Scenarios

Prevent regression bugs by controlling when a particular API response should change, through configuration-based smoke tests.

Think of Jest's snapshot testing, but for APIs.

### What

Scenarios records your API endpoint responses for a set of requests, and then use those recordings to check if the response changes over time.

### Why

The main benefit of this is being able to notice when some of your responses changes inadvertently. Because you only want to change a response for a scenario when you want to do it, and not when it's a side effect from that file change you were sure wouldn't break a thing.

### Secondary benefits

- Having your endpoints documented. You have live documentation on how to hit an endpoint.
- Providing mocks to client developers. They don't need to boot (nor setup the environment for) your server, when they can just use the latest recorded mocks.
- Achieve high testing coverage easily, with no written tests.

### Principles

- Smoke testing should require little effort, so there's no excuse not to do it.
- When something changes, it should be easy to spot if the change is wanted or not.
- When a test fails, a cURL-like command should be provided to the user to be able to reproduce the problem.
- Updating the recordings should be trivial.

### How to use

0. Setup a scenarios-conf.js file to override the desired defaults.
1. Configure a scenarios.js file within your project's root. Take a look at the provided one for examples.
2. `npx scenarios` to record the uses cases.
3. `npx scenarios --mode=test` to compare results.
  - Modify how a response from one of your endpoints to see some failing tests.

### Example

Check the examples directory for examples on how to use this tool.
