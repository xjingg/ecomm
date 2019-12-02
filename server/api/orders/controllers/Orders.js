'use strict';

const stripe = require('stripe')("sk_test_0qdNpiFcjz4AS487Pjemtsux00vdsCzTt0");
/**
 * Orders.js controller
 *
 * @description: A set of functions called "actions" for managing `Orders`.
 */

export async function find(ctx) {
  if (ctx.query._q) {
    return strapi.services.orders.search(ctx.query);
  }
  else {
    return strapi.services.orders.fetchAll(ctx.query);
  }
}
export async function findOne(ctx) {
  if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
    return ctx.notFound();
  }
  return strapi.services.orders.fetch(ctx.params);
}
export async function count(ctx) {
  return strapi.services.orders.count(ctx.query);
}
export async function create(ctx) {
  const { address, amount, perfumes, postalCode, token, city } = ctx.request.body;
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: 'USD',
    description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    source: token
  });
  //create order in database
  const order = await strapi.services.orders.add({
    user: ctx.state.user._id,
    address,
    amount,
    perfumes,
    postalCode,
    city
  });
  return order;
}
export async function update(ctx, next) {
  return strapi.services.orders.edit(ctx.params, ctx.request.body);
}
export async function destroy(ctx, next) {
  return strapi.services.orders.remove(ctx.params);
}
