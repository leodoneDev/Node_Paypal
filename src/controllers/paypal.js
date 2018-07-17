import express from 'express';
import PaypalService from '../services/paypal';
import Order from '../domain/order';
import PaypalAuthorisation from '../domain/paypal-authorisation';

const router = new express.Router();

/**
 * Authorise the payment (step 1)
 */
router.post('/paypal/create', async (req, res) => {
  try {
    const order = new Order(req.body);
    const validation = Order.CONSTRAINTS.validate(order);

    if (validation.error) {
      const e = new Error(`Order: Validation failed: ${validation.error.details}`);
      e.status = 400;
      throw e;
    }

    const paypalService = new PaypalService();
    const transaction = await paypalService.create(order);
    console.log(`transaction created / authorised with transaction id ${transaction.id}`);

    res.json({
      data: {
        type: 'transaction',
        id: transaction.id,
      },
    });
  } catch (e) {
    console.error('Error authorising payment', e);
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

/**
 * Finalise the payment (step 2)
 */
router.post('/paypal/execute', async (req, res) => {
  try {
    const paypalAuthorisation = new PaypalAuthorisation(req.body);
    const validation = PaypalAuthorisation.CONSTRAINTS.validate(paypalAuthorisation);

    if (validation.error) {
      const e = new Error(`PaypalAuthorisation: Validation failed: ${validation.error.details}`);
      e.status = 400;
      throw e;
    }

    const paypalService = new PaypalService();
    const transaction = await paypalService.execute(paypalAuthorisation);
    console.log(`transaction executed with transaction id ${transaction.id}`);

    res.json({
      data: {
        type: 'transaction',
        attributes: transaction,
      },
    });
  } catch (e) {
    console.error('Error finalising payment', e);
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

/**
 * Finalise the payment (step 2)
 */
router.get('/paypal/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paypalService = new PaypalService();
    const transaction = await paypalService.getSale(id);

    res.json({
      data: {
        type: 'transaction',
        attributes: transaction,
      },
    });
  } catch (e) {
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

export default router;
