import { CouponService } from '../services';

export class CouponsController {
  static get(req, res) {
    console.log(req.params.id)
    const { id } = req.params;

    CouponService.get(id)
      .then(
        (response) => {
          response.valid ?
            res.json({
              message: 'Valid coupon',
              id: response.id,
              amountOff: response.amount_off,
              percentOff: response.percent_off,
              valid: response.valid,
              duration: response.duration
            }) :
            onError(res)({
              statusCode: 404,
              message: `No such coupon: ${id}`,
              type: 'BcCouponInvalidError',
            })
        },
        onError(res)
      )};
}

const onError = (res) => (error) => {
  res.status(error.statusCode).json({
    error: error.message,
    valid: false,
    type: error.type
  });
}
