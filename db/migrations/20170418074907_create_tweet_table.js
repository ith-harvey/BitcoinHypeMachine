
exports.up = function(knex) {
  return knex.schema.createTable('tweets', function(table) {
    table.increments()
    table.date('date')
    table.string('author')
    table.string('tweet_pull_id')
    table.string('tweet_text')
    table.integer('watson_score')
    table.string('watson_label')
    table.string('profile_img')
    table.timestamps(true, true)
  });
}
exports.down = function(knex) {
  return knex.schema.dropTable('tweets')
};
