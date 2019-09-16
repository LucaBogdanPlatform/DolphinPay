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
        var Cart = JSON.parse(windows.localStorage.get("Cart"));
        if(Cart.length == 1) oneStandCart(Cart);
        else if (Cart.length == 0){}
        else multipleStandCart(Cart);
    },

    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();

function oneStandCart(Cart){
    var products = Cart[Object.keys(Cart)[0]];
    //bottom fixed bar with total and submit button insertion
    for(var prod in products){
        //elem factory insertion
    }
}

function multipleStandCart(Cart){
    for(var stand in Cart){
        //create Stand section with name on the header and submit payment button in the footer
        for(var prod in Cart[stand]){
            //elem Factory...first 3 visible...the other invisible
        }
    }
}

function elementFactory(name,img,cost,quantity,visible){

}

function goBack(){
    PGMultiView.dismissView("");
}

function addQuantity(elem){
    elem.parentElement[1].value = parseInt(elem.parentElement[1].value) + 1;
}

function removeQuantity(elem){
    if(parseInt(elem.parentElement[1].value) != 1)elem.parentElement[1].value = parseInt(elem.parentElement[1].value) - 1;
}