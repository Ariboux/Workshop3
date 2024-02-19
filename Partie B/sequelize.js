"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize({
    database: 'ecommerceDb',
    username: 'user',
    password: 'user',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});
exports.default = sequelize;
