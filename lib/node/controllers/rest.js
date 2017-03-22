const APIError = require('../utils/rest').APIError;

module.exports = {
  'GET /api/test': async(ctx, next) => {
    if (true) {
      ctx.rest({
        test: true
      });
    } else {
      throw new APIError('Something wrong');
    }
  }
}
