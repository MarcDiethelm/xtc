xtc testing
===========

Running xtc functions inside xtc module for dev testing without a project works by forcing a special test config.
If (process.env.testRun == true) configure.js will load `configs.test.json` instead of configs.json.
All intra-xtc testing must therefore set process.env.testRun somehow.

- To run test server manually set env var xtcDev=true. ==> easily done in WebStorm Run Config
- To test build manually use `npm test` which starts grunt with necessary args.
  Gruntfile then sets process.env.testRun.
- To run automated tests mocha.opts specifies loading a file test.setup.js
  which sets process.env.testRun

We need to have a working config set in one place because that's how lib/configure.js works.
Therefore and to (hopefully) minimize confusion the test config files are in the same folder where there regular config templates are, inside the generator.
This way xtc can use the project default file in the generator when running xtc functions without a project for manual testing.



But basically it would be nice to have a mode in configure.js that does not fail if configs.json and configs-default.js are not in the default place. using it would just require merge()'ing a viable config.

Alternative manual testing: Put the necessary project resources in xtc's parent folder and do manual testing from there.
