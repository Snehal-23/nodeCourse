const fs = require("fs");
const path = require("path");

const Cart = require("./cart");
const db = require("../util/database");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const readFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};
module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    //method to save product in file
    return db.execute(
      "INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteProductById(id) {
    readFromFile((products) => {
      const productToDel = products.find((prod) => prod.id === id);
      const prodPrice = productToDel.price;
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, productToDel.price);
        }
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    //method to fetch product list
    return db.execute("SELECT * FROM products");
  }

  static findProductById(prodId) {
    return db.execute("SELECT * FROM products where products.id=?", [prodId]);
  }
};
