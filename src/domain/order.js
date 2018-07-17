import joi from 'joi';

/**
 * Hold and validates information about the purchase being posted client side to /paypal/create
 */
export default class Order {
  constructor({
    orderId,
    amount,
    description,
  } = {}) {
    this.orderId = orderId;
    this.amount = amount;
    this.description = description;
  }

  static get CONSTRAINTS() {
    return joi.object({
      orderId: joi.string().required(),
      amount: joi.number().min(0).required(),
      description: joi.string().required(),
    }).options({ stripUnknown: true });
  }
}
