const
  Sequelize = require('sequelize'),
  log = require('./logger.js'),

  config = require('../configs/mysql-connection.js');

// create table pets(
//     id varchar(50) not null,
//     name varchar(100) not null,
//     gender bool not null,
//     birth varchar(10) not null,
//     createdAt bigint not null,
//     updatedAt bigint not null,
//     version bigint not null,
//     primary key (id)
// ) engine=innodb;


var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
});

var Pet = sequelize.define('pet', {
  id: {
    type: Sequelize.STRING(50),
    primaryKey: true
  },
  name: Sequelize.STRING(100),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.STRING(10),
  createdAt: Sequelize.BIGINT,
  updatedAt: Sequelize.BIGINT,
  version: Sequelize.BIGINT
}, {
  timestamps: false
});

var now = Date.now();

Pet.create({
  id: 'g-' + now,
  name: 'Gaffey',
  gender: false,
  birth: '2007-07-07',
  createdAt: now,
  updatedAt: now,
  version: 0
}).then(function(p) {
  log('created.' + JSON.stringify(p));
}).catch(function(err) {
  log('failed: ' + err);
});

(async() => {
  var dog = await Pet.create({
    id: 'd-' + now,
    name: 'Odie',
    gender: false,
    birth: '2008-08-08',
    createdAt: now,
    updatedAt: now,
    version: 0
  });
  log('created: ' + JSON.stringify(dog));
})();

(async() => {
  var pets = await Pet.findAll({
    where: {
      name: 'Gaffey'
    }
  });
  log(`find ${pets.length} pets:`);
  for (let p of pets) {
    log(JSON.stringify(p));
    log('update pet...');
    p.gender = true;
    p.updatedAt = Date.now();
    p.version++;
    await p.save();
    if (p.version === 3) {
      await p.destroy();
      log(`${p.name} was destroyed.`);
    }
  }
})();
