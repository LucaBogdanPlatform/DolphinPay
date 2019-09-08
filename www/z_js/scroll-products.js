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

function populate(){
    for(var i= 0 ; i < 100 ; i++){
        document.getElementById('scrollable-content').appendChild(elementFactoryProducts('name','cost',
        'header','description',i,'../img/product1.jpg'));
    }
}

function elementFactoryProducts(name,cost,header,description,id,urlImg){
    var div = document.createElement("div");
    div.innerHTML = '<div class="card" style="overflow: hidden;"><div class="product bg-success text-white">'+
           '<figure class="product_img  align-items-center justify-content-between d-flex"><a href="#">'+
           '<img class="" src="'+urlImg+'" alt=""></a></figure>'+
           '<div class="card-block" style="background:#F07260 !important;" > <a href="#">'+
           '<h5 class="card-title text-white">'+name+'<i class="fa fa-heart-o pull-right"></i></h5></a>'+
           '<div  data-toggle="collapse" data-target="#'+id+'" aria-expanded="false">'+
           '<h3>$ '+cost+'<small class="text-danger"></small></h3><p class="card-text">'+header+'</p>'+
           '<div class="collapse" id="'+id+'"><center>'+ description+
           '</center></div></div></div>'+
           '<div class="card-block justify-content-between d-flex" style="background:#F07260 !important;">'+
           '<a onclick="addToCart(this);" class="btn btn-primary">Add to cart</a></div></div></div>';
    return div;
}

function addToCart(event){

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