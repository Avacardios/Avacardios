const client = require('./client');

const {
  fetchProducts,
  createProduct
} = require('./products');

const {
  createUser,
  authenticate,
  findUserByToken
} = require('./auth');

const {
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  fetchOrders
} = require('./cart');

const {
fetchAddress,
createAddress
} = require('./shipping')


const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS shipping;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE shipping(
      id UUID PRIMARY KEY,
      customer_name VARCHAR(100),
      address VARCHAR(200),
      phone VARCHAR(10)
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL,
      shipping_id UUID REFERENCES shipping(id)
    );

    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

  `;

  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: 'm_password', is_admin: false}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true})
  ]);
  const [foo, bar, bazz] = await Promise.all([
    createProduct({ name: 'foo' }),
    createProduct({ name: 'bar' }),
    createProduct({ name: 'bazz' }),
    createProduct({ name: 'quq' }),
  ]);
  const [addy] = await Promise.all([
    createAddress({ customer_name: 'Ethyl', address:'1234 Ethylville Drive', phone:'1234567890'})
  ])
  
  let orders = await fetchOrders(ethyl.id);
  let shippingAddress = addy;
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: foo.id});
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: bar.id});
  cart.is_cart = false;
  await updateOrder(cart);
};

module.exports = {
  fetchProducts,
  fetchOrders,
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  authenticate,
  findUserByToken,
  seed,
  client
};
