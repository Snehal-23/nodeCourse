const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({
    where: {
      id: prodId,
    },
  })
    .then((products) => {
      res.render("shop/product-detail", {
        product: products[0],
        path: "/products",
        pageTitle: products[0].title,
      });
      console.log(products);
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCarts()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartItems) => {
      res.render("shop/cart", {
        products: cartItems,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then((product) => {
    // Cart.addProduct(prodId, parseInt(product.price));
  });
  res.redirect("/cart");
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then((product) => {
    Cart.deleteProduct(prodId, parseInt(product.price));
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/orders", {
        prods: products[0],
        pageTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};
