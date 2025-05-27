const fs = require('fs');
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('bson');

faker.locale = 'fr';

const generateObjectId = () => new ObjectId().toString();
const generateDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// ---- USERS ----
const users = Array.from({ length: 20 }, () => ({
  _id: { $oid: generateObjectId() },
  name: faker.person.fullName(),
  email: faker.internet.email(),
  passwordHash: `hashedpwd${faker.number.int({ min: 100, max: 999 })}`,
  isAdmin: faker.datatype.boolean(0.15),
  createdAt: { $date: generateDate(faker.number.int({ min: 1, max: 30 })) }
}));

// ---- CATEGORIES ----
const categoryNames = ['Vêtements', 'Électronique', 'Maison', 'Livres', 'Beauté'];
const categories = categoryNames.map(name => {
  const id = generateObjectId();
  return {
    _id: { $oid: id },
    name
  };
});
const categoryIds = categories.map(cat => cat._id.$oid);

// ---- PRODUCTS ----
const products = Array.from({ length: 50 }, () => {
  const id = generateObjectId();
  return {
    _id: { $oid: id },
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
    stock: faker.number.int({ min: 0, max: 200 }),
    category: { $oid: faker.helpers.arrayElement(categoryIds) },
    images: [faker.image.url()],
    createdAt: { $date: generateDate(faker.number.int({ min: 1, max: 30 })) }
  };
});
const productIds = products.map(p => p._id.$oid);

// ---- ORDERS ----
const orders = Array.from({ length: 30 }, () => {
  const user = faker.helpers.arrayElement(users);
  const numItems = faker.number.int({ min: 1, max: 3 });
  const orderedProducts = [];
  let total = 0;

  for (let i = 0; i < numItems; i++) {
    const product = faker.helpers.arrayElement(products);
    const quantity = faker.number.int({ min: 1, max: 3 });
    orderedProducts.push({
      productId: product._id,
      quantity
    });
    total += product.price * quantity;
  }

  return {
    _id: { $oid: generateObjectId() },
    userId: user._id,
    products: orderedProducts,
    total: parseFloat(total.toFixed(2)),
    status: faker.helpers.arrayElement(['paid', 'shipped', 'pending']),
    createdAt: { $date: generateDate(faker.number.int({ min: 1, max: 20 })) },
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      country: 'France'
    }
  };
});

// ---- REVIEWS ----
const reviews = Array.from({ length: 40 }, () => ({
  _id: { $oid: generateObjectId() },
  productId: { $oid: faker.helpers.arrayElement(productIds) },
  userId: { $oid: faker.helpers.arrayElement(users). _id.$oid },
  rating: faker.number.int({ min: 1, max: 5 }),
  comment: faker.lorem.sentence(10),
  createdAt: { $date: generateDate(faker.number.int({ min: 1, max: 30 })) }
}));

// ---- SAVE TO FILES ----
const save = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
};

save('users.json', users);
save('categories.json', categories);
save('products.json', products);
save('orders.json', orders);
save('reviews.json', reviews);

console.log('Données générées avec succès !');