# TODO

- [x] Adjust `authController.logIn` to return JWT token immediately upon successful login and remove the OTP email step.
- [x] Update `authController.signUp` to create and email an OTP, store it for later verification, and defer issuing the JWT until verification succeeds.
- [x] Ensure `authController.verify2FA` (or a new verification handler if required) returns the JWT token after successful OTP confirmation post-signup.
- [x] Review related validators, routes, and email messaging to align with the new signup/login flows.
