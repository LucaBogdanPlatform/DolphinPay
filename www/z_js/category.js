
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
        setCartCounter();
        container = document.getElementById("container-category");
        //here the function on load
        var currentStand = JSON.parse(window.localStorage.getItem("currentCompany"));
        getStandCategories(function(data){loadCategory(data);},
            function(error){alert('Connection lost');},
            currentStand.id);
    },

    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();


function loadCategory(data){
    for(var i = 0 ; i < data.length ; i++){
        container.appendChild(elementFactory(data[i].name,data[i].positionMapping,data[i].id));
    }
}


function elementFactory(title,imgName,id){
    var div = document.createElement("div");
    div.className = "col-sm-16 col-md-8";
    div.innerHTML = '<div class="media flex-column" onClick="goToProducts(this);" id="'+id+'">'+
        '<span class="projectpic card"><img src="../z_img/'+imgName+'.jpg">'+
        '<div class="overlay category">'+
        '<h6 style="font-size: 1.8rem !important;">'+title+'</h6>'+
        '</div></span></div>';
    return div;
}

function goToProducts(event){
    window.localStorage.setItem("currentCategory",event.id);
    PGMultiView.loadView("products.html","", function(){}, function(){});
}

function goBack(){
    PGMultiView.dismissView("");
}

function setCartCounter(){
    var counter = 0;
    var Cart = JSON.parse(window.localStorage.getItem("Cart"));
    for(var elem in Cart){
        for(var prod in Cart[elem]) {
            counter = counter + Cart[elem][prod].quantity;
        }
    }
    document.getElementById("cart-counter").textContent = counter;
}

function goToCart(){
    PGMultiView.loadView("Cart.html", "", function(){}, function(){});
}