import Sequelize from 'sequelize';
import path from 'path';

import User from './models/user.model';

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: path.resolve('tmp', 'db.sqlite'), // for Windows
  logging: false
});

// Init all models
User(sequelize);

sequelize.sync();

export default sequelize;
