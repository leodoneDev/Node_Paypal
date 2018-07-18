import express from 'express';
import PaypalService from '../services/paypal';
import Order from '../domain/order';
import PaypalAuthorisation from '../domain/paypal-authorisation';
import logger from '../services/logger';

const router = new express.Router();

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
    logger.info(`transaction created / authorised with transaction id ${transaction.id}`);

    res.json({
      data: {
        type: 'transaction',
        id: transaction.id,
      },
    });
  } catch (e) {
    logger.error('Error authorising payment', e);
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

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
    logger.info(`transaction executed with transaction id ${transaction.id}`);

    res.json({
      data: {
        type: 'transaction',
        attributes: transaction,
      },
    });
  } catch (e) {
    logger.error('Error finalising payment', e);
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

/**
 * Use the salesId from the transaction to verify the payment status
 */
router.get('/paypal/sale/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paypalService = new PaypalService();
    const sale = await paypalService.getSale(id);

    res.json({
      data: {
        type: 'sale',
        attributes: sale,
      },
    });
  } catch (e) {
    logger.error('Error verifying sale', e);
    res.status(e.status || e.httpStatusCode || 500).json({
      errors: [{
        status: e.status || e.httpStatusCode || 500,
        title: e.message,
      }],
    });
  }
});

export default router;
