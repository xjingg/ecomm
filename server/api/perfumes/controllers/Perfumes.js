'use strict';

/**
 * Perfumes.js controller
 *
 * @description: A set of functions called "actions" for managing `Perfumes`.
 */

module.exports = {

  /**
   * Retrieve perfumes records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.perfumes.search(ctx.query);
    } else {
      return strapi.services.perfumes.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a perfumes record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.perfumes.fetch(ctx.params);
  },

  /**
   * Count perfumes records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.perfumes.count(ctx.query);
  },

  /**
   * Create a/an perfumes record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.perfumes.add(ctx.request.body);
  },

  /**
   * Update a/an perfumes record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.perfumes.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an perfumes record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.perfumes.remove(ctx.params);
  }
};
