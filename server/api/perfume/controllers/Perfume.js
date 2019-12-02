'use strict';

/**
 * Perfume.js controller
 *
 * @description: A set of functions called "actions" for managing `Perfume`.
 */

module.exports = {

  /**
   * Retrieve perfume records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.perfume.search(ctx.query);
    } else {
      return strapi.services.perfume.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a perfume record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.perfume.fetch(ctx.params);
  },

  /**
   * Count perfume records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.perfume.count(ctx.query);
  },

  /**
   * Create a/an perfume record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.perfume.add(ctx.request.body);
  },

  /**
   * Update a/an perfume record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.perfume.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an perfume record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.perfume.remove(ctx.params);
  }
};
