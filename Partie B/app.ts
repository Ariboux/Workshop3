import * as express from 'express';
import {Request, Response} from 'express';
import * as cors from 'cors';

import sequelize from './sequelize';
import {DataTypes} from "sequelize";
const app = express();

const port = 3000;
app.use(cors({ origin: 'http://localhost:3001' }));

app.listen(port, () => {
    console.log('Ok, started on port: ' + port);
});
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

const clientModel = sequelize.define('client', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

const productModel = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stockStatus: {
        type: DataTypes.ENUM('inStock', 'outOfStock'),
        allowNull: false
    }
}, {
    freezeTableName: true
});

const orderModel = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'completed', 'cancelled']]
        }
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const cartModel = sequelize.define('cart', {
    id: {
        type: DataTypes.INTEGER,
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

(async () => {
    await sequelize.sync();

    const clientsCount = await clientModel.count();
    const productsCount = await productModel.count();
    const ordersCount = await orderModel.count();
    const cartItemsCount = await cartModel.count();

    if (clientsCount == 0 || productsCount == 0 || ordersCount == 0 || cartItemsCount == 0) {
        try {
            const clients = await clientModel.bulkCreate([
                {name: 'John Doe', email: 'john@example.com', phone: '1234567890'},
                {name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210'},
                {name: 'Alice Johnson', email: 'alice@example.com', phone: '5555555555'}
            ]) as any;

            const products = await productModel.bulkCreate([
                {name: 'Laptop', price: 999.99, stockStatus: 'inStock'},
                {name: 'Smartphone', price: 599.99, stockStatus: 'inStock'},
                {name: 'Headphones', price: 99.99, stockStatus: 'outOfStock'}
            ]) as any;

            const orders = await orderModel.bulkCreate([
                {status: 'completed', totalPrice: 1999.97, clientId: clients[0].id},
                {status: 'pending', totalPrice: 599.99, clientId: clients[1].id},
                {status: 'cancelled', totalPrice: 99.99, clientId: clients[2].id}
            ]);

            const cartItems = await cartModel.bulkCreate([
                {clientId: clients[0].id, productId: products[0].id},
                {clientId: clients[1].id, productId: products[1].id},
                {clientId: clients[2].id, productId: products[2].id}
            ]);

            console.log('Data inserted successfully!');
        } catch (error) {
            console.error('Error inserting sample data:', error);
        }
    } else {
        console.log('Data already inserted');
    }
})();


app.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await productModel.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const product = await productModel.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        const product = await productModel.create(req.body);
        res.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const product = await productModel.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const product = await productModel.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/orders', async (req: Request, res: Response) => {
    try {
        const order = await orderModel.create(req.body);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/orders/:userId', async (req: Request, res: Response) => {
    try {
        const orders = await orderModel.findAll({ where: { clientId: req.params.userId } });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/cart/:userId', async (req: Request, res: Response) => {
    try {
        const cartItem = await cartModel.create({ clientId: req.params.userId, productId: req.body.productId });
        res.json(cartItem);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/cart/:userId', async (req: Request, res: Response) => {
    try {
        const cartItems = await cartModel.findAll({ where: { clientId: req.params.userId } });
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/cart/:userId/item/:productId', async (req: Request, res: Response) => {
    try {
        const cartItem = await cartModel.findOne({ where: { clientId: req.params.userId, productId: req.params.productId } });
        if (cartItem) {
            await cartItem.destroy();
            res.json({ message: 'Item removed from cart successfully' });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

