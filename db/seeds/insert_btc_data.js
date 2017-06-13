
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('btc_prices').del()
    .then(function () {
      // Inserts seed entries
      return knex('btc_prices').insert([
        {
          id: 1,
          date: 'Tue Jun 13 07:31:53 +0000 2017',
          price: '1226.6170375'
        },
        {
          id: 2,
          date: 'Mon Jun 12 07:31:53 +0000 2017',
          price: '1220.1239874'
        },
        {
          id: 3,
          date: 'Wed Jun 14 07:31:53 +0000 2017',
          price: '1180.0237125'
        }
      ]);
    });
};
