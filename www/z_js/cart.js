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
        init();
    },

    onPause: function() {

    },
    onResume: function(event) {
        setCartCounter();
    }
}
app.initialize();

function init(){
    var cart = getCart();
    multipleStandCart(cart);
}

function multipleStandCart(Cart){
    var keyCartArray = Object.keys(Cart);
    if(keyCartArray.length == 0){
        document.getElementById("container-products").innerHTML = "Your chart is empty";
        return;
    }

    for(var i = 0; i< keyCartArray.length; i++){
        var standBlock = getStandBlock();
        var totalPrice = 0;
        for(var j=0; j<Cart[""+keyCartArray[i]].length; j++){
            var el = (Cart[""+keyCartArray[i]][j]);
            totalPrice += el.price * el.quantity;
            standBlock.append(createProductDOMObject(keyCartArray[i], el));
        }

        var bSpan = document.createElement("span");
        bSpan.style = "float:left;padding:16px;";
        bSpan.innerHTML = " TOTAL : ";

        var bA = document.createElement("a");
        bA.id = ""+keyCartArray[i]+"_total";
        bA.style = "float:right;padding:16px;";
        bA.innerHTML = totalPrice + "€";

        var bBuy = document.createElement("a");
        bBuy.style = "width:100%;padding:8px;color:white;";
        bBuy.classList.add("waves-effect");
        bBuy.classList.add("deep-orange");
        bBuy.classList.add("lighten-1");
        bBuy.innerHTML = "BUY";
        var standIdIndex = i;
        bBuy.onclick = function(e){
            sendNewOrder(getCart()[""+keyCartArray[standIdIndex]], ""+keyCartArray[standIdIndex], standBlock);
        };

        standBlock.append(bSpan);
        standBlock.append(bA);
        standBlock.append(document.createElement("br"));
        standBlock.append(document.createElement("br"));
        standBlock.append(bBuy);

        document.getElementById("container-products").append(standBlock);
    }
}

function sendNewOrder(elements, standId, standBlock){
    var requestData = [];
    for(var i = 0; i<elements.length; i++){
        requestData.push({
            productId : elements[i].id ,
            productQuantity : elements[i].quantity
        });
    }

    createOrder(function(data){
        initCart();
        standBlock.classList.remove("collapsible");
        standBlock.innerHTML = getConfirmOrder();
    }, function(error){
        alert("Impossible to make new order");
    }, standId, requestData);

}

function createProductDOMObject(standId, elem){
    var li = document.createElement("li");
    var divHeader = document.createElement("div");
    divHeader.classList.add("collapsible-header");

    var span = document.createElement("span");
    span.innerHTML = elem.name;
    span.style = "margin-left:10px;width:45%;";
    span.append(document.createElement("br"));

    var spanPrice = document.createElement("span");
    spanPrice.style = "float:center;";
    spanPrice.innerHTML = (elem.price + "€");
    span.append(spanPrice);

    var divValues = document.createElement("div");
    divValues.style = "text-align:right;width:45%;";

    var a1 = document.createElement("a");
    a1.style = "margin:16px;";
    a1.innerHTML = elem.quantity;

    var a = document.createElement("a");
    a.classList.add("waves-effect");
    a.classList.add("amber");
    a.classList.add("lighten-2");
    a.classList.add("btn");
    a.style = "width:30px;height:30px; padding-top:0px;";
    a.innerHTML = "-";
    a.onclick = function(){
        var removed = removeCartElement(standId, elem);
        if(removed){
            if(isCartEmptyForStand(standId)){
                document.getElementById("container-products").removeChild(li.parentNode);
            }else{
                li.parentNode.removeChild(li);
                updateStandTotal(standId, elem, false);
            }
        }else{
            a1.innerHTML = parseInt(a1.innerHTML) - 1
            updateStandTotal(standId, elem, false);
        }
    }

    var a2 = document.createElement("a");
    a2.classList.add("waves-effect");
    a2.classList.add("amber");
    a2.classList.add("lighten-2");
    a2.classList.add("btn");
    a2.style = "width:30px;height:30px; padding-top:0px;";
    a2.innerHTML = "+";
    a2.onclick = function(){
        addProductToCartStand(standId, elem);
        a1.innerHTML = parseInt(a1.innerHTML) + 1;
        updateStandTotal(standId, elem, true);
    }

    li.append(divHeader);
    divHeader.append(divValues);
    divHeader.append(span);
    divValues.append(a);
    divValues.append(a1);
    divValues.append(a2);
    return li;
}

function getConfirmOrder(){
    return '<div class="row"> <div class="col s12 m5"><div class="card-panel teal"><span class="white-text">New Order succeeded</span></div></div></div>';
}

function updateStandTotal(standId, elem, addToTotal){
    document.getElementById(standId + "_total").innerHTML =
    parseInt(document.getElementById(standId + "_total").innerHTML) + (addToTotal? elem.price : -elem.price) + "€";
}

function getStandBlock(){
    var standBlock = document.createElement("ul");
    standBlock.classList.add("collapsible");
    standBlock.style="width:100%;"
    return standBlock;
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