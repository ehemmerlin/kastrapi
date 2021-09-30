const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { url } = ctx.params;

    const entity = await strapi.services.dependencies.findOne({ url });
    return sanitizeEntity(entity, { model: strapi.models.dependencies });
  },
  async webhook() {
    const { data } = await axios.get('http://localhost:1337/dependencies/xcut');

    console.log(data);  
    return data;
  },
};