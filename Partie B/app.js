"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var sequelize_1 = require("./sequelize");
var sequelize_2 = require("sequelize");
var app = express();
var port = 3000;
app.use(cors({ origin: 'http://localhost:3001' }));
app.listen(port, function () {
    console.log('Ok, started on port: ' + port);
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});
var clientModel = sequelize_1.default.define('client', {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_2.DataTypes.STRING
    },
    phone: {
        type: sequelize_2.DataTypes.STRING
    }
}, {
    freezeTableName: true
});
var productModel = sequelize_1.default.define('product', {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: sequelize_2.DataTypes.FLOAT,
        allowNull: false
    },
    stockStatus: {
        type: sequelize_2.DataTypes.ENUM('inStock', 'outOfStock'),
        allowNull: false
    }
}, {
    freezeTableName: true
});
var orderModel = sequelize_1.default.define('order', {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'completed', 'cancelled']]
        }
    },
    totalPrice: {
        type: sequelize_2.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    freezeTableName: true
});
var cartModel = sequelize_1.default.define('cart', {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true
});
orderModel.belongsTo(clientModel, { foreignKey: 'clientId' });
clientModel.hasMany(orderModel, { foreignKey: 'clientId' });
cartModel.belongsTo(clientModel, { foreignKey: 'clientId' });
clientModel.hasMany(cartModel, { foreignKey: 'clientId' });
cartModel.belongsTo(productModel, { foreignKey: 'productId' });
productModel.hasMany(cartModel, { foreignKey: 'productId' });
orderModel.belongsToMany(productModel, { through: 'order_products' });
productModel.belongsToMany(orderModel, { through: 'order_products' });
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var clientsCount, productsCount, ordersCount, cartItemsCount, clients, products, orders, cartItems, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sequelize_1.default.sync()];
            case 1:
                _a.sent();
                return [4 /*yield*/, clientModel.count()];
            case 2:
                clientsCount = _a.sent();
                return [4 /*yield*/, productModel.count()];
            case 3:
                productsCount = _a.sent();
                return [4 /*yield*/, orderModel.count()];
            case 4:
                ordersCount = _a.sent();
                return [4 /*yield*/, cartModel.count()];
            case 5:
                cartItemsCount = _a.sent();
                if (!(clientsCount == 0 || productsCount == 0 || ordersCount == 0 || cartItemsCount == 0)) return [3 /*break*/, 13];
                _a.label = 6;
            case 6:
                _a.trys.push([6, 11, , 12]);
                return [4 /*yield*/, clientModel.bulkCreate([
                        { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
                        { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210' },
                        { name: 'Alice Johnson', email: 'alice@example.com', phone: '5555555555' }
                    ])];
            case 7:
                clients = _a.sent();
                return [4 /*yield*/, productModel.bulkCreate([
                        { name: 'Laptop', price: 999.99, stockStatus: 'inStock' },
                        { name: 'Smartphone', price: 599.99, stockStatus: 'inStock' },
                        { name: 'Headphones', price: 99.99, stockStatus: 'outOfStock' }
                    ])];
            case 8:
                products = _a.sent();
                return [4 /*yield*/, orderModel.bulkCreate([
                        { status: 'completed', totalPrice: 1999.97, clientId: clients[0].id },
                        { status: 'pending', totalPrice: 599.99, clientId: clients[1].id },
                        { status: 'cancelled', totalPrice: 99.99, clientId: clients[2].id }
                    ])];
            case 9:
                orders = _a.sent();
                return [4 /*yield*/, cartModel.bulkCreate([
                        { clientId: clients[0].id, productId: products[0].id },
                        { clientId: clients[1].id, productId: products[1].id },
                        { clientId: clients[2].id, productId: products[2].id }
                    ])];
            case 10:
                cartItems = _a.sent();
                console.log('Data inserted successfully!');
                return [3 /*break*/, 12];
            case 11:
                error_1 = _a.sent();
                console.error('Error inserting sample data:', error_1);
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                console.log('Data already inserted');
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); })();
app.get('/products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, productModel.findAll()];
            case 1:
                products = _a.sent();
                res.json(products);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching products:', error_2);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/products/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, productModel.findByPk(req.params.id)];
            case 1:
                product = _a.sent();
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching product:', error_3);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, productModel.create(req.body)];
            case 1:
                product = _a.sent();
                res.json(product);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error creating product:', error_4);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/products/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, productModel.findByPk(req.params.id)];
            case 1:
                product = _a.sent();
                if (!product) return [3 /*break*/, 3];
                return [4 /*yield*/, product.update(req.body)];
            case 2:
                _a.sent();
                res.json(product);
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ error: 'Product not found' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Error updating product:', error_5);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.delete('/products/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, productModel.findByPk(req.params.id)];
            case 1:
                product = _a.sent();
                if (!product) return [3 /*break*/, 3];
                return [4 /*yield*/, product.destroy()];
            case 2:
                _a.sent();
                res.json({ message: 'Product deleted successfully' });
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ error: 'Product not found' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.error('Error deleting product:', error_6);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/orders', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orderModel.create(req.body)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error creating order:', error_7);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/orders/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orderModel.findAll({ where: { clientId: req.params.userId } })];
            case 1:
                orders = _a.sent();
                res.json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error fetching orders:', error_8);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/cart/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItem, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, cartModel.create({ clientId: req.params.userId, productId: req.body.productId })];
            case 1:
                cartItem = _a.sent();
                res.json(cartItem);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error adding item to cart:', error_9);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/cart/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItems, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, cartModel.findAll({ where: { clientId: req.params.userId } })];
            case 1:
                cartItems = _a.sent();
                res.json(cartItems);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching cart items:', error_10);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/cart/:userId/item/:productId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItem, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, cartModel.findOne({ where: { clientId: req.params.userId, productId: req.params.productId } })];
            case 1:
                cartItem = _a.sent();
                if (!cartItem) return [3 /*break*/, 3];
                return [4 /*yield*/, cartItem.destroy()];
            case 2:
                _a.sent();
                res.json({ message: 'Item removed from cart successfully' });
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ error: 'Item not found in cart' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_11 = _a.sent();
                console.error('Error removing item from cart:', error_11);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
