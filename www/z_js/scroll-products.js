var categoryId;
var elements;
var scrollWindowSize;
var offset;
var downloadingContent;
var N_TOTAL_ELEM;
var INDEX_ELEM;

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
        elements = new Array();
        scrollWindowSize = parseInt($(window).height() / 146) + 4;
        offset = (scrollWindowSize % 2 == 0) ? 0 : 0.5;
        downloadingContent = false;
        N_TOTAL_ELEM = 0;
        INDEX_ELEM = 0;
        categoryId = getUrlVars()["category"];
        populate();
    },

    onPause: function() {

    },
    onResume: function(event) {

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
    var product = {};
    var chioscoId = '123456789';
    if(!localStorage.getItem('Cart')) localStorage.setItem('Cart',{});
    var nodes = elem.parentNode.parentNode.childNodes;
    product.imageSrc = nodes[0].childNodes[0].childNodes[0].src;
    product.name = nodes[1].childNodes[1].childNodes[0].innerText;
    product.cost = nodes[1].childNodes[2].childNodes[0].innerText;
    product.header = nodes[1].childNodes[2].childNodes[1].innerText;
    product.description = nodes[1].childNodes[2].childNodes[2].innerText;
    product.id = nodes[1].childNodes[2].childNodes[2].id;
    product.quantity = 1;
    var all = localStorage.getItem('Cart');
    if(!(chioscoId in all)){
        alert(JSON.stringify(product));
        var data = new Array();
        data.push(product);
        all[chioscoId] = data;
        localStorage.setItem('Cart',data);
    }
    else{
        alert(JSON.stringify(product));
        var item_data = localStorage.getItem('Cart')[chioscoId].filter(function(elem){
            return elem.id == product.id;
        });
        if(item_data == null) {
            item_data = new Array();
            item_data.push(product);
            localStorage.getItem('Cart')[chioscoId] = item_data;
        }
        else{
            //se il prodotto esiste già aumento la quantità
            //se il prodotto non esiste lo aggiungo con quantità 1
            item_data.push(product);
            localStorage.getItem('Cart')[chioscoId] = item_data;
        }
    }
    //prima di settare la quantità verifico se esiste già lo stesso prodotto (tramite id) nel carrello...product
    //se non c'è allora quantity = 1, se esiste già incremento la quantità esistente di 1 unità
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function goBack(){
    PGMultiView.dismissView("");
}