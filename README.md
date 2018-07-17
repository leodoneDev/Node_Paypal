# Paypal node implementation

## Prerequisites and configuration
* Go to https://developer.paypal.com/
* Create an account (sandbox)
* Create an app under "My Apps & Credentials"
* Copy the client ID / secret into a `.env` file (see `.env-sample`)

## Start the app
```
npm i  
npm start
```

Go to http://localhost:3000 and click the "Paypal Checkout" button.  

Disclaimer: This has only been tested on Mac, but I don't see any reason it wouldn't run on a PC.
