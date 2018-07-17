import paypal from 'paypal-rest-sdk';

export default class PaypalService {
  constructor({
    clientId = process.env.PAYPAL_CLIENT_ID,
    clientSecret = process.env.PAYPAL_CLIENT_SECRET,
    mode = process.env.PAYPAL_MODE,
  } = {}) {
    if (!clientId) throw new Error('Required: process.env.PAYPAL_CLIENT_ID');
    if (!clientSecret) throw new Error('Required: process.env.PAYPAL_CLIENT_SECRET');
    if (!mode) throw new Error('Required: process.env.PAYPAL_MODE');

    paypal.configure({
      client_id: clientId,
      client_secret: clientSecret,
      mode,
    });
  }

  /**
   * Creates a sale, an authorized payment to be captured later, or an order
   * https://developer.paypal.com/docs/api/payments/v1/#payment_create
   * @param {PaypalAuthoriseModel} payment
   */
  async create(order) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      /**
       * This is the payload being sent to the Paypal create service
       * Notice the redirect_url section. It is required, but in the server side flow they never get called
       */
      const payment = {
        intent: 'authorize', // [sale, authorize, order]
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://127.0.0.1:3000/success',
          cancel_url: 'http://127.0.0.1:3000/err',
        },
        transactions: [{
          amount: {
            total: order.amount,
            currency: 'AUD',
          },
          description: order.description,
        }],
      };

      paypal.payment.create(payment, (err, transaction) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          resolve(transaction);
        }
      });
    });
  }

  /**
   * Executes a PayPal payment that the customer has approved
   * https://developer.paypal.com/docs/api/payments/v1/#payment_execute
   * @param {PaypalAuthorisation} authorisation
   */
  async execute(authorisation) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      const payload = {
        payer_id: authorisation.payerID,
      };

      paypal.payment.execute(authorisation.paymentID, payload, (err, transaction) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          resolve(transaction);
        }
      });
    });
  }

  /**
   * Shows details for a sale, by ID. Returns only sales that were created through the REST API.
   * https://developer.paypal.com/docs/api/payments/v1/#sale_get
   * @param {string} paymentId
   */
  async getSale(paymentId) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      paypal.sale.get(paymentId, (err, transaction) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          resolve(transaction);
        }
      });
    });
  }

  /**
   * Shows details for a payment, by ID, that has yet to complete
   * https://developer.paypal.com/docs/api/payments/v1/#payment_get
   * @param {string} paymentId e.g "PAY-9BD890500A9676143LNGX6KI"
   */
  async getPaymentDetails(paymentId) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      paypal.payment.get(paymentId, (err, transaction) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          resolve(transaction);
        }
      });
    });
  }
}
