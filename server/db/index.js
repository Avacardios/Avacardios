const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;
const path = require('path')
const fs = require('fs')

const {
  fetchProducts,
  createProduct,
  updateProduct
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
  fetchOrders,
  fetchAllOrders,
} = require('./cart');

const {
  fetchAddress,
  createAddress,
  deleteAddress,
  fetchAllAddress
} = require('./shipping');

const { flushSync } = require('react-dom');

const {
  createWishList,
  fetchWishList,
  deleteWishList
} = require('./wishList')

const loadImage = (filePath)=> {
  return new Promise((resolve, reject)=>{
    const fullPath = path.join(__dirname + filePath)
    fs.readFile(fullPath, 'base64', (err, result)=>{
      if(err){
        reject(err)
      } else {
        resolve(`data:image/png;base64,${result}`)
      }
    })
  })
}
const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS wishlist;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS shipping;
    DROP TABLE IF EXISTS users;
   

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL,
      image TEXT,
      vip BOOLEAN DEFAULT false
    );
    
    CREATE TABLE shipping(
      id UUID PRIMARY KEY,
      data JSON DEFAULT '{}',
      user_id UUID REFERENCES users(id) NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      price INT,
      description TEXT,
      amount VARCHAR(100),
      image TEXT,
      vip BOOLEAN DEFAULT false,
      category VARCHAR(20)
    );
    
    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id),
      user_name VARCHAR(20),
      shipping_id UUID REFERENCES shipping(id)
    );
    
    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1
      --CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

    CREATE TABLE wishlist(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT product_and_user_key UNIQUE(product_id, user_id)
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      username VARCHAR(100) REFERENCES users(username),
      product_id UUID REFERENCES products(id),
      stars INT,
      body TEXT
      );
      `;
      
      await client.query(SQL);
      
  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: '1', is_admin: false, vip: true}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true})
  ]);
  
   await createAddress({ 
      customer_name: 'Ethyl', 
      data: { formatted_address: 'USA'},
      user_id: ethyl.id
      });
    

  const cookiesImage = await loadImage('/images/chocolate-chip-cookies.png');
  const muffinsImage = await loadImage('/images/blue-muffin.png');
  const brownieImage = await loadImage('/images/brownie.png');
  const avocadoImage = await loadImage('/images/avocadoprod.png');
  const carrotImage = await loadImage('/images/carrotsnew.png');
  const tomatoImage = await loadImage('/images/tomato.png');
  const spinachImage = await loadImage('/images/spinachleaf.png');
  const blueberriesImage = await loadImage('/images/blueberries.png');
  const asparagusImage = await loadImage('/images/asparagus.png');
  const pitayaImage = await loadImage('/images/pitaya.png');
  const cauliflowerImage = await loadImage('/images/cauliflower.png');
  const lemonImage = await loadImage('/images/lemon.png');
  const bananasImage = await loadImage('/images/bananas.png');
  const potatoesImage = await loadImage('/images/potatoes.png');
  const lettuceImage = await loadImage('/images/lettuce.png');
  const mushroomsImage = await loadImage('/images/mushrooms.png');
  const raspberriesImage = await loadImage('/images/raspberries.png');
  const peachImage = await loadImage('/images/peach.png');
  const watermelonImage = await loadImage('/images/watermelon.png');
  const grapesImage = await loadImage('/images/greengrapes.png');
  const strawberriesImage = await loadImage('/images/strawberries.png');
  const broccoliImage = await loadImage('/images/broccoli.png');
  const zucchiniImage = await loadImage('/images/zucchini.png');
  const oatsImage = await loadImage('/images/oats.png');
  const almondsImage = await loadImage('/images/almonds.png');
  const chiaseedsImage = await loadImage('/images/chiaseeds.png');
  const eggsImage = await loadImage('/images/eggs.png');
  const walnutsImage = await loadImage('/images/walnuts.png');
  const salmonImage = await loadImage('/images/salmon.png');
  const chickenImage = await loadImage('/images/chicken.png');
  const quinoaImage = await loadImage('/images/quinoa.png');
  const pistachioImage = await loadImage('/images/pistachio.png')
  const beansImage = await loadImage('/images/blackbeans.png')
  // vegetable, protien, fruit, sweets 
  await Promise.all([
    createProduct({ 
      name: 'Chocolate Chip Cookies', 
      price: 7, 
      description: 'A sweet soft baked treat, loaded with chocolate chips, and ready for snack time',
      amount: '6 count',
      image: cookiesImage,
      vip: true,
      category: 'sweets'
    }),
    createProduct({
      name: 'Blueberry Muffins',
      price: 8,
      description: 'Soft and buttery muffins bursting with blueberries',
      amount: '6 count',
      image: muffinsImage,
      vip: true,
      category: 'sweets'
    }),
    createProduct({
      name: 'Brownies',
      price: 6,
      description: 'These brownies are gooey and fudgy in all the right spots with a perfect crispy crackly top',
      amount: '3 count',
      image: brownieImage,
      vip: true,
      category: 'sweets'
    }),
    createProduct({ 
      name: 'Avocados', 
      price: 5, 
      description: 'A bright green fruit with a buttery, creamy, and slightly nutty taste',
      amount: '4 count bag',
      image: avocadoImage,
      category: 'fruit'
    }),
    createProduct({ 
      name: 'Carrots',
      price: 3,
      description: 'An orange root vegetable with a earthy and sweet flavor',
      amount: '2 lb bag',
      image: carrotImage,
      category: 'vegetable'
    }),
    createProduct({ 
      name: 'Tomato',
      price: 2,
      description: 'A scarlet colored fruit with a taste that ranges from sour to sweet',
      amount: 'Single',
      image: tomatoImage,
      category: 'fruit'
    }),
    createProduct({ 
      name: 'Spinach',
      price: 2,
      description: 'A leafy green veggie that is slightly sweet raw that becomes more acidic and robust when cooked',
      amount: '10 oz bag',
      image: spinachImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Blueberries',
      price: 4,
      description: 'This small blue fruit has flavor described as sweet and slightly tart',
      amount: '11 oz container',
      image: blueberriesImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Asparagus',
      price: 5,
      description: 'A bright green vegetable that is tendery, buttery, and sweet with a hint of earthy bitterness when cooked',
      amount: 'Pack of 12',
      image: asparagusImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Pitaya',
      price: 7,
      description: 'Also known as dragon fruit. Has been characterized as a combination of pear and kiwi with a touch of citrus',
      amount: 'Single',
      image: pitayaImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Cauliflower',
      price: 3,
      description: 'A white vegetable that resembles broccoli and has a mild flavor with a slightly nutty and sweet taste',
      amount: 'Single',
      image: cauliflowerImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Lemon',
      price: 1,
      description: 'Yellow citrus fruit that is slightly acidic and sour',
      amount: 'Single',
      image: lemonImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Bananas',
      price: 2,
      description: 'Yellow curved fruit with a slightly creamy and custard-like flavor',
      amount: 'Bunch',
      image: bananasImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Potatoes',
      price: 3,
      description: 'Russets with a mild earthy flavor',
      amount: '5 lb bag',
      image: potatoesImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Lettuce',
      price: 1,
      description: 'Green veggie that has a mild and refreshing taste',
      amount: 'Single',
      image: lettuceImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Mushrooms',
      price: 2,
      description: 'White buttons that feature a classic umami flavor',
      amount: '8 oz pack',
      image: mushroomsImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Raspberries',
      price: 5,
      description: 'Vibrant red fruit that have a fresh sweet taste with undertones of tartness',
      amount: '12 oz container',
      image: raspberriesImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Peach',
      price: 1,
      description: 'Fruit with a a delicate, floral sweetness',
      amount: 'Single',
      image: peachImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Watermelon',
      price: 6,
      description: 'Green stripped fruit witha juicy, sweet, and red center',
      amount: 'Single',
      image: watermelonImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Grapes',
      price: 4,
      description: 'Green grapes are known for being sour and citrusy',
      amount: '2.25 lb bag',
      image: grapesImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Strawberries',
      price: 3,
      description: 'Bright red fruit that is juicy and sweet with a little bit of acidity',
      amount: '1 lb package',
      image: strawberriesImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Broccoli',
      price: 3,
      description: 'Green veggie with a grassy, earthy flavor with a mildy bitter undertone',
      amount: 'Single',
      image: broccoliImage,
      category: 'vegetable'
    }),
    createProduct({
      name: 'Zucchini',
      price: 1,
      description: 'Long green vegetable that is slightly sweet and slightly bitter',
      amount: 'Single',
      image: zucchiniImage,
      category: 'fruit'
    }),
    createProduct({
      name: 'Oats',
      price: 7,
      description: 'Old fashioned whole grain rolled oats',
      amount: '32 oz bag',
      image: oatsImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Almonds',
      price: 9,
      description: 'Whole raw, natural almonds',
      amount: '25 oz bag',
      image: almondsImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Chia Seeds',
      price: 8,
      description: 'seeds with a mild nutty flavor that complement both savory and sweet dishes',
      amount: '20 oz bag',
      image: chiaseedsImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Eggs',
      price: 5,
      description: 'organic free range large brown eggs',
      amount: '12 count',
      image: eggsImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Walnuts',
      price: 13,
      description: 'unsalted raw walnut halves and pieces',
      amount: '16 oz bag',
      image: walnutsImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Salmon',
      price: 11,
      description: 'Fresh skinless Atlantic salmon fillets',
      amount: '0.95 lb to 1 lb',
      image: salmonImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Chicken',
      price: 15,
      description: 'Boneless, skinless, and fresh chicken breasts',
      amount: '4 lb',
      image: chickenImage,
      category: 'protien'
    }),
    
  ]);
  // --- these are seperated to make default wishlists
  const [quinoa, pistachios, blackbeans] = await Promise.all([
    createProduct({
      name: 'Quinoa',
      price: 9,
      description: 'Organic gluten free grain that has a nutty undertone',
      amount: '24 oz container',
      image: quinoaImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Pistachios',
      price: 7,
      description: 'Unsalted raw shelled pistachios',
      amount: '16 oz bag',
      image: pistachioImage,
      category: 'protien'
    }),
    createProduct({
      name: 'Black Beans',
      price: 3,
      description: 'These beans have an earthy and nutty flavor with an undertone that is subtly sweet',
      amount: '16 oz bag',
      image: beansImage,
      category: 'protien'
    })
  ])
  


  await Promise.all([
    createWishList({
      user_id: ethyl.id,
      product_id: quinoa.id
    }),
    createWishList({
      user_id: ethyl.id,
      product_id: pistachios.id
    }),
    createWishList({
      user_id: moe.id,
      product_id: blackbeans.id
    })
  ])
  
  // let orders = await fetchOrders(ethyl.id);
  // let shippingAddress = addy;
  // let cart = orders.find(order => order.is_cart);
  // let lineItem = await createLineItem({ order_id: cart.id, product_id: Avocado.id});
  // lineItem.quantity++;
  // await updateLineItem(lineItem);
  // lineItem = await createLineItem({ order_id: cart.id, product_id: Tomato.id});
  // cart.is_cart = false;
  // await updateOrder(cart);
  
};


module.exports = {
  fetchProducts,
  createProduct,
  updateProduct,
  fetchOrders,
  fetchLineItems,
  fetchWishList,
  createLineItem,
  updateLineItem,
  createWishList,
  deleteLineItem,
  deleteWishList,
  updateOrder,
  fetchAllOrders,
  authenticate,
  findUserByToken,
  createAddress,
  fetchAddress,
  deleteAddress,
  fetchAllAddress,
  seed,
  client
};
