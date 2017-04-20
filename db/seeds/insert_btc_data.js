
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('btc_prices').del()
    .then(function () {
      // Inserts seed entries
      return knex('btc_prices').insert([
        {
          id: 1,
          date: 'Tuesday 11th April 2017 12:00:00 AM',
          price: '1226.6170375'
        },
        {
          id: 2,
          date: 'Wednesday 12th April 2017 12:00:00 AM',
          price: '1220.1239874'
        },
        {
          id: 3,
          date: 'Thursday 13th April 2017 12:00:00 AM',
          price: '1180.0237125'
        }
      ]);
    });
};
