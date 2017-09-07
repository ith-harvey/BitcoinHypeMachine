
exports.up = function(knex) {
  return knex.schema.createTable('btc_prices', function(table) {
    table.increments()
    table.string('date').notNullable().unique()
    table.string('price').notNullable()
    table.timestamps(true, true)
  });
}

exports.down = function(knex) {
  return knex.schema.dropTable('btc_prices')
};
