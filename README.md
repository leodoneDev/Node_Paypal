# Paypal server-side implementation with Node.js

Example of Paypal client-side / server-side integration flow.

## Prerequisites and configuration
* Go to https://developer.paypal.com/
* Create an account (sandbox)
* Create an app under "My Apps & Credentials"
* Copy the client ID / secret into a `.env-sample`
* Rename `.env-sample` to `.env`

## Start the app
```
npm i  
npm start
```
Go to http://localhost:3000 and click the "Paypal Checkout" button.

## Paypal SDK
This project uses the Node.js [Paypal REST SDK](https://www.npmjs.com/package/paypal-rest-sdk) which under the hood makes HTTP requests to the [Paypal API](https://developer.paypal.com/docs/api/payments/v1/).

The benefit of using the SDK means you don't need to authorise each request, that is all done for you.

## Sample payloads
The foler `/test/mock` contains mock request / response payloads for the SDK. Useful for testing / debugging.

## File tree
<pre>
├── LICENSE
├── README.md
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
│       └── paypal.js
└── test
    └── mock
        ├── authorise.request.json
        ├── authorise.response.json
        ├── execute.request.json
        ├── execute.response.json
        └── sale.response.json
</pre>
