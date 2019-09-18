
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
        container = document.getElementById("container-category");

        getStandCategories(
            function(data){ loadCategory(data);},
            function(error){alert('Connection lost');},
            getSelectedStand().id
        );
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
    var elem = document.createElement("div");
    elem.classList.add("card");
    elem.id = id;

    var elemImage = document.createElement("div");
    elemImage.classList.add("card-image");
    elemImage.classList.add("waves-effect");
    elemImage.classList.add("waves-block");
    elemImage.classList.add("waves-light");

    var elemImageOBJ = document.createElement("img");
    elemImageOBJ.classList.add("activator");
    elemImageOBJ.style="height:160px;"
    elemImageOBJ.src = "../z_img/" + imgName.toString() +".jpg";

    var cardContent = document.createElement("div");
    cardContent.classList.add("card-content");


    var span = document.createElement("span");
    span.classList.add("card-title");
    span.classList.add("activator");
    span.classList.add("grey-text");
    span.classList.add("text-darken-4");
    span.innerHTML = title;

    elemImage.appendChild(elemImageOBJ);
    cardContent.appendChild(span);
    elem.appendChild(elemImage);
    elem.appendChild(cardContent);

    elem.onclick = function(e){
        saveCategorySelected(id);
        goToProducts(e);
    };

    return elem;
}

function goToProducts(event){
    PGMultiView.loadView("products.html","", function(){}, function(){});
}

function goBack(){
    PGMultiView.dismissView("");
}

function setCartCounter(){
    document.getElementById("cart-counter").textContent = getCartProductsCount();
}

function goToCart(){
    PGMultiView.loadView("Cart.html", "", function(){}, function(){});
}