
const env = process.env.DATABASE_URL || 'development';
const config = require('../knexfile.js');
const knex = require('knex')('production')





module.exports = knex
