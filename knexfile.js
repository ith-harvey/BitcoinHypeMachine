//
// const path = require('path')
// const pg = require('pg')
//
// module.exports = {
//   development: {
//     client: 'pg',
//     connection: 'postgres://localhost/hype_machine_db',
//     migrations: {
//       directory: path.join(__dirname, 'db', 'migrations')
//     },
//     seeds: {
//       directory: path.join(__dirname, 'db', 'seeds')
//     }
//   },
//   production: {
//     client: 'pg',
//     connection: process.env.DATABASE_URL,
//     migrations: {
//       directory: path.join(__dirname, 'db', 'migrations')
//     },
//     seeds: {
//       directory: path.join(__dirname, 'db', 'seeds')
//     }
//   }
// }


const path = require('path')

module.exports = {

  development: {
    client: 'pg',
    connection: `postgres://localhost/hype_machine_db`,
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: 'postgres://localhost/hype_machine_db',
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  }

}
