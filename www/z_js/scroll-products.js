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
        setCartCounter();
        currentStand = JSON.parse(window.localStorage.getItem("currentCompany"));
        getProductsOfCategoryOfStand(function(data){populate();},
            function(error){alert('Connection refused by the server');},
            currentStand.id, window.localStorage.getItem("currentCategory"))
    },

    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();

//populate();

function populate(){
    for(var i= 0 ; i < 20 ; i++){
        document.getElementById('scrollable-content').appendChild(elementFactoryProducts('name',10,
        'header','description',i,'../img/product1.jpg'));
    }
}

function elementFactoryProducts(name,cost,header,description,id,urlImg){
    var div = document.createElement("div");
    div.innerHTML = '<div class="card" style="overflow: hidden;"><div class="product bg-success text-white">'+
           '<figure class="product_img  align-items-center justify-content-between d-flex"><a href="#">'+
           '<img class="" src="'+urlImg+'" alt=""></a></figure>'+
           '<div class="card-block" style="background:#F07260 !important;" > <a href="#">'+
           '<h5  class="card-title text-white">'+name+'<i class="fa fa-heart-o pull-right"></i></h5></a>'+
           '<div  data-toggle="collapse" data-target="#'+id+'" aria-expanded="false">'+
           '<h3 >$ '+cost+'<small class="text-danger"></small></h3><p class="card-text">'+header+'</p>'+
           '<div class="collapse" id="'+id+'" name="description"><center>'+ description+
           '</center></div></div></div>'+
           '<div class="card-block justify-content-between d-flex" style="background:#F07260 !important;">'+
           '<a onclick="addToCart(this);" class="btn btn-primary">Add to cart</a></div></div></div>';
    return div;
}

function addToCart(elem){
    var Cart = JSON.parse(window.localStorage.getItem("Cart"));
    if(Cart[currentStand.id] === undefined) {
        Cart[currentStand.id] = new Array();
        window.localStorage.setItem("Cart",JSON.stringify(Cart));
    }
    var product = {};
    var nodes = elem.parentNode.parentNode.childNodes;
    product.imageSrc = nodes[0].childNodes[0].childNodes[0].src;
    product.name = nodes[1].childNodes[1].childNodes[0].innerText;
    product.cost = nodes[1].childNodes[2].childNodes[0].innerText;
    product.header = nodes[1].childNodes[2].childNodes[1].innerText;
    product.description = nodes[1].childNodes[2].childNodes[2].innerText;
    product.id = nodes[1].childNodes[2].childNodes[2].id;
    product.quantity = 1;
    var content = Cart[currentStand.id].filter(function(elem){
        return elem.id === product.id;
    });
    if(content.length == 0) Cart[currentStand.id].push(product);
    else content[0].quantity = content[0].quantity + 1;
    window.localStorage.setItem("Cart",JSON.stringify(Cart));
    setCartCounter();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
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

function goBack(){
    PGMultiView.dismissView("");
}