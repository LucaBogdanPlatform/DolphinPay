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
        initialContent();
        setScrollListener();
        setCartCounter();
    },
    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();

document.addEventListener("backbutton", function (e) {
      PGMultiView.dismissView("");
});

function setCartCounter(){
    var cartProductsCount = getCartProductsCount();

    document.getElementById("cart-counter").textContent = cartProductsCount;
    document.getElementById("cart-counter1").textContent = cartProductsCount;
}

function goToCart(){
    PGMultiView.loadView("Cart.html", "", function(){}, function(){});
}