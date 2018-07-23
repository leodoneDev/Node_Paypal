# Paypal server-side implementation with Node.js

Example of Paypal client-side / server-side integration flow.  
Essentially this is a full implementation of https://developer.paypal.com/demo/checkout/#/pattern/server  

I have kept the files organised making the code portable.

## Tooling
* Node.js es6
* Target version Node v8.9.4
* Using Babel to transpile to es5

## Prerequisites and configuration
* Go to https://developer.paypal.com/
* Create an account (sandbox)
* Create an app under "My Apps & Credentials"
* Copy the client ID / secret into `.env-sample`
* Rename `.env-sample` to `.env`

## Start the app
```
npm i  
npm start
```
Go to http://localhost:3001 and click the "Paypal Checkout" button. This will start the payment flow.
Open your console to see the req / res flow.

## Paypal SDK
This project uses the Node.js [Paypal REST SDK](https://www.npmjs.com/package/paypal-rest-sdk) which under the hood makes HTTP requests to the [Paypal API](https://developer.paypal.com/docs/api/payments/v1/).

The benefit of using the SDK means you don't need to authorise each request, that is all done for you.

## Sample payloads
The folder `/test/mock` contains mock request / response payloads for the SDK. Useful for testing / debugging or just gaining an understanding of how it works.

## File tree
<pre>
.
├── LICENSE
├── README.md
├── logs
│   └── 2018-07-18.log
├── package-lock.json
├── package.json
├── public
│   └── index.html
├── src
│   ├── controllers
│   │   ├── pages.js
│   │   └── paypal.js
│   ├── domain
│   │   ├── order.js
│   │   └── paypal-authorisation.js
│   ├── index.js
│   └── services
│       ├── logger.js
│       └── paypal.js
└── test
    └── mock
        ├── authorise.request.json
        ├── authorise.response.json
        ├── execute.request.json
        ├── execute.response.json
        └── sale.response.json
</pre>
