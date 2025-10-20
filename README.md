# DEV1003-Assessment02

Backend API for a Full Stack MERN project!

**Moderate security vulnerability from Validatorjs:**
`isURL` validator accepts some url formats which should not be accepted.
This occurs only through direct user entry of urls.
Applying a discrete protocol argument will negate this issue, currently being worked on in a PR on their repo further information and pull request [available here](https://github.com/validatorjs/validator.js/pull/2608)
Will update to latest version once fix has been completed
