const express = require('express');
const useragent = require('useragent');
const Saml2js = require('saml2js');

const passport = require('../config/passportHandler');

const userAgentHandler = (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = Object.assign({}, {
    device: agent.device,
    os: agent.os
  });
  req.device = deviceInfo;
  next();
};

const router = express.Router();
/*
* This Router Authenticates req with IDP
* If Session is active it returns saml response
* If Session is not active it redirect to IDP's login form
*/
router.get('/login/sso',
  passport.authenticate('saml', {
    successRedirect: '/user/home',
    failureRedirect: '/user/login'
  })
);

/**
 * This is the callback URL
 * Once Identity Provider validated the Credentials it will be called with base64 SAML req body
 * Here we used Saml2js to extract user Information from SAML assertion attributes
 * If every thing validated we validates if user email present into user DB.
 * Then creates a session for the user set in cookies and do a redirect to Application
 */

router.post('/login/sso/callback',
  userAgentHandler,
  passport.authenticate('saml', { failureRedirect: '/false', failureFlash: true }), 
  (req, res, next) => {
    console.log('login successfully!');
    const xmlResponse = req.body.SAMLResponse;
    const parser = new Saml2js(xmlResponse);
    req.samlUserObject = parser.toObject();
    next();
  }, (req, res, next) => { 
    res.redirect('/user/home');
  });

router.get('/login', (req, res, next) => res.send('This is page of login failure'));


router.get('/home', (req, res, next) => res.send('This is home page after login succesfully'));

module.exports = router;