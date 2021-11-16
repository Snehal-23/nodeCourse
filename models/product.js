const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

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
    readFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (products) => products.id == this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
          console.log(error);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (error) => {
          console.log(error);
        });
      }
    });
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
    readFromFile(cb);
  }

  static findProductById(id, cb) {
    readFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
