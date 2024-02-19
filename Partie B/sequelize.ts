import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    database: 'ecommerceDb',
    username: 'user',
    password: 'user',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});

export default sequelize;
