
exports.up = function(knex) {
  return knex.schema.createTable('tweets', function(table) {
    table.increments()
    table.date('date').notNullable()
    table.string('author').notNullable()
    table.string('tweet_pull_id').notNullable()
    table.string('tweet_text').notNullable()
    table.string('watson_score').notNullable()
    table.string('watson_label').notNullable()
    table.string('profile_img').notNullable()
    table.timestamps(true, true)
  });
}
exports.down = function(knex) {
  return knex.schema.dropTable('tweets')
};
