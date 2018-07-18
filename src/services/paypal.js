import paypalSDK from 'paypal-rest-sdk';
import get from 'lodash/get';
import pick from 'lodash/pick';

export default class PaypalService {
  constructor({
    clientId = process.env.PAYPAL_CLIENT_ID,
    clientSecret = process.env.PAYPAL_CLIENT_SECRET,
    mode = process.env.PAYPAL_MODE,
  } = {}) {
    if (!clientId) throw new Error('Required: process.env.PAYPAL_CLIENT_ID');
    if (!clientSecret) throw new Error('Required: process.env.PAYPAL_CLIENT_SECRET');
    if (!mode) throw new Error('Required: process.env.PAYPAL_MODE');

    this.paypal = paypalSDK;
    this.paypal.configure({
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
  async create(order) {
    return new Promise((resolve, reject) => {
      const payment = {
        intent: 'sale', // [sale, authorize, order]
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://127.0.0.1', // Not used, but required
          cancel_url: 'http://127.0.0.1', // Not used, but required
        },
        transactions: [{
          amount: {
            total: order.amount,
            currency: 'AUD',
          },
          description: order.description,
        }],
      };

      this.paypal.payment.create(payment, (err, transaction) => {
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
  async execute(authorisation) {
    return new Promise((resolve, reject) => {
      const payload = {
        payer_id: authorisation.payerID,
      };

      this.paypal.payment.execute(authorisation.paymentID, payload, (err, response) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          const sale = get(response, 'transactions[0].related_resources[0].sale');

          if (!sale) {
            reject(new Error('Sale expected in payload'));
            return;
          }

          resolve({
            id: response.id,
            state: response.state,
            sale: pick(sale, ['id', 'state']),
          });
        }
      });
    });
  }

  /**
   * Shows details for a sale, by ID. Returns only sales that were created through the REST API.
   * https://developer.paypal.com/docs/api/payments/v1/#sale_get
   * @param {string} salesId - e.g "88A67294VY191105WA" (not to be confused with the Payment id)
   */
  async getSale(salesId) {
    return new Promise((resolve, reject) => {
      this.paypal.sale.get(salesId, (err, response) => {
        if (err) {
          reject(err.response ? err.response : err);
        } else {
          resolve(response);
        }
      });
    });
  }
}
