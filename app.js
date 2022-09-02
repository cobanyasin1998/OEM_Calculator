//Storage Controller
const StorageController = (function () {})();

//Product Controller
const ProductController = (function () {
  //private
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: [],
    selectedProduct: null,
    totalPrice: 0,
  };

  //public
  return {
    getProducts: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });

      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    addProduct: function (name, price) {
      let id;

      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    GetTotal: function () {
      let total = 0;
      data.products.forEach(function (item) {
        total += item.price;
      });

      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();

//UI Controller
const UIController = (function () {
  const Selectors = {
    productList: "#item-list",
    addButton: ".addBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTl: "#total-tl",
    totalDollar: "#total-dollar",
  };

  return {
    createProductList: function (products) {
      let html = ``;

      products.forEach((prd) => {
        html += `
          <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price}$</td>
            <td class="text-right">
            <i class="fa fa-edit edit-product"></i>
          </td>
        </tr>
      `;
      });

      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    clearInputs: function () {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },
    hideCard: function () {
      document.querySelector(Selectors.productCard).style.display = "none";
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDollar).textContent = parseInt(
        total / 18
      );
      document.querySelector(Selectors.totalTl).textContent = total;
    },
    addProductToForm:function(){

      const selectedProduct =ProductController.getCurrentProduct();

      document.querySelector(Selectors.productName).textContent = selectedProduct.name;
      document.querySelector(Selectors.productPrice).textContent = selectedProduct.price;
    },

    addProduct: function (prd) {
      document.querySelector(Selectors.productCard).style.display = "block";

      var item = `
      <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price}$</td>
            <td class="text-right">
          
              <i class="fa fa-edit edit-product"></i>
         
          </td>
        </tr>
      
      `;

      document.querySelector(Selectors.productList).innerHTML += item;
    },
  };
})();

//App Controller
const App = (function (ProductCtrl, UICtrl) {
  const UISelectors = UIController.getSelectors();

  //Load Event Listeners

  const loadEventListeners = function () {
    //Add Product Event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener("click", productAddSubmit);

    //Edit Product Event

    document
      .querySelector(UISelectors.productList)
      .addEventListener("click", productEditSubmit);
  };

  const productAddSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      //Add product
      const newProduct = ProductCtrl.addProduct(productName, productPrice);
      //Add item to list
      UIController.addProduct(newProduct);

      //get Total
      const total = ProductCtrl.GetTotal();

      //show total
      UICtrl.showTotal(total);

      //clear Inputs
      UIController.clearInputs();
    }

    e.preventDefault();
  };

  const productEditSubmit = function (e) {
    if (e.target.classList.contains("edit-product")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      //get SelectedProduct

      const product = ProductController.getProductById(id);
      //set current product
      ProductCtrl.setCurrentProduct(product);

      //add product to UI
      UICtrl.addProductToForm();
    }

    e.preventDefault();
  };

  return {
    init: function () {
      console.log("Starting App");
      const products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }

      loadEventListeners();
    },
  };
})(ProductController, UIController);

App.init();
