
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tweets').del()
    .then(function () {
      // Inserts seed entries
      return knex('tweets').insert([
        {
         id: 1,
         date: 'Mon Apr 17 23:48:01 +0000 2017',
         author: 'coindesk',
         tweet_text: 'RT @MBZVentures: Looking forward to participating in #Consensus2017  @CoinDesk May 22-24, 2017 Marriott Marquis in Times Square, NYC https:\u2026',
         watson_score: '0.24',
         watson_label: 'positive',
         tweet_pull_id: '854407533930438700',
         profile_img: 'http:\/\/pbs.twimg.com\/profile_images\/3596849828\/90368fac589f772b9445a4b66caeb27a_normal.png'
        },
        {
         id: 2,
         date: 'Mon Apr 17 23:48:01 +0000 2017',
         author: 'coindesk',
         tweet_text: 'RT @MBZVentures: Looking forward to participating in #Consensus2017  @CoinDesk May 22-24, 2017 Marriott Marquis in Times Square, NYC https:\u2026',
         watson_score: '0.55',
         watson_label: 'positive',
         tweet_pull_id: '854407533930438900',
         profile_img: 'http:\/\/pbs.twimg.com\/profile_images\/3596849828\/90368fac589f772b9445a4b66caeb27a_normal.png'
        },
        {
         id: 3,
         date: 'Mon Apr 17 23:48:01 +0000 2017',
         author: 'coindesk',
         tweet_text: 'RT @MBZVentures: Looking forward to participating in #Consensus2017  @CoinDesk May 22-24, 2017 Marriott Marquis in Times Square, NYC https:\u2026',
         watson_score: '0.65',
         watson_label: 'positive',
         tweet_pull_id: '854407533930438230',
         profile_img: 'http:\/\/pbs.twimg.com\/profile_images\/3596849828\/90368fac589f772b9445a4b66caeb27a_normal.png'
        }
      ]);
    });
};
