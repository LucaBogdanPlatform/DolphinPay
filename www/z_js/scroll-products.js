var currentStand;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReady: function() {
        attachBaseMenuListeners();
        attachBaseLeftMenuListeners();
        setCartCounter();
        loadProducts();
    },

    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();

function loadProducts(){
    getProductsOfCategoryOfStand(
        function(data){
            populate(data);
        },
        function(error){
            alert('Impossible to load products');
        },
        getSelectedStand().id,
        getSelectedCategory().id
    );
}

function populate(data){
    for(var i= 0 ; i < data.length ; i++){
        document.getElementById('container-products').appendChild(elementFactoryProducts(data[i]));
    }
}

function elementFactoryProducts(product){
    var elem = document.createElement("div");
    elem.classList.add("card");
    elem.classList.add("transition");

    var elem1 = document.createElement("h3");
    elem1.id = "prod-title";
    elem1.setAttribute("style", "background:#f5f5f5; color:black; font-weight: 400;");
    elem1.classList.add("transition");
    elem1.innerHTML = product.name;

    var elem2 = document.createElement("div");
    elem2.setAttribute("style", "margin-top:150px;margin-left:16px;margin-right:16px;");

    var elem3 = document.createElement("h6");
    elem3.setAttribute("style", "text-align:left;");
    elem3.innerHTML = "Prodotto di ottima qualità, fornito con certificazione Italiana dal 2016";

    var elem4 = document.createElement("h5");
    elem4.setAttribute("style", "text-align:left;color:blue;");
    elem4.innerHTML = "PRICE " + product.price + "€";

    var elem5 = document.createElement("br");

    var elem6 = document.createElement("a");
    elem6.classList.add("cta");
    elem6.setAttribute("style", "float:center;margin-top:16px;");
    elem6.innerHTML = "+ ADD TO CART";

    elem6.onclick = function(){
        addProductToCart(product);
        setCartCounter();
    };

    var elem7 = document.createElement("div");
    elem7.classList.add("card_circle");
    elem7.classList.add("transition");

    elem.appendChild(elem1);
    elem.appendChild(elem2);
    elem2.appendChild(elem3);
    elem2.appendChild(elem4);
    elem4.appendChild(elem5);
    elem4.appendChild(elem6);
    elem.appendChild(elem7);
    return elem;
}

function setCartCounter(){
    document.getElementById("cart-counter").textContent = getCartProductsCount();;
}

function goBack(){
    PGMultiView.dismissView("");
}

function goToCart(){
    PGMultiView.loadView("Cart.html", "", function(){}, function(){});
}