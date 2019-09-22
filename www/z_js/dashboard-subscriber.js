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
        attachMenuListeners();
        attachRetirementButtonListener();
        firebaseObserveNotification(handleNewNotification, handleSubscribeNotificationError);
    },

    onPause: function() {

    },
    onResume: function(event) {
        firebaseObserveNotification(handleNewNotification, handleSubscribeNotificationError);
    }
//    onBackKeyDown: function(){
//        alert("A");
//        navigator.app.exitApp();
//        return false;
//    }
}
app.initialize();

var ordersPendingSize = [];

function handleNewNotification(n){
    var order = JSON.parse(n.order);
    var existingOrderDOM = document.getElementById("order_" + order.id);
    if(existingOrderDOM !== null){
        existingOrderDOM.append(buildNewProduct(order, order.products));
        ordersPendingSize["order_" + order.id] ++;;
    }else{
        var newOrderDOM = buildNewOrder(order);
        var newOrderRowDOM = buildNewProduct(order, order.products);

        newOrderDOM.append(newOrderRowDOM);
        document.getElementById("scrollable-content").append(newOrderDOM);
        ordersPendingSize["order_" + order.id] = 1;
    }
}

function buildNewOrder(order){
    var standBlock = document.createElement("ul");
    standBlock.classList.add("collapsible");
    standBlock.style="width:100%; background:#f5f5f5;"
    standBlock.id = "order_" + order.id;

    var orderNumber = document.createElement("p");
    orderNumber.innerHTML = "ORDER N° "+order.id;
    orderNumber.style.innerHTML = "padding-top:8px;";

    standBlock.append(orderNumber);

    return standBlock;
}

function buildNewProduct(order, product){
    var li = document.createElement("li");

    var divHeader = document.createElement("div");
    divHeader.classList.add("collapsible-header");

    var span = document.createElement("span");
    span.innerHTML = product.name + " X " + order.quantity;
    span.style = "margin-left:10px;width:75%;text-align:left;";
    span.append(document.createElement("br"));

    var spanEndPrepare = document.createElement("span");
    spanEndPrepare.style = "text-align:left;";
    spanEndPrepare.innerHTML = "EXPIRE TIME: " + new Date(order.expectedEndTime).toLocaleTimeString('it-IT');
    span.append(spanEndPrepare);


    var a = document.createElement("a");
    a.classList.add("waves-effect");
    a.classList.add("red");
    a.classList.add("lighten-2");
    a.classList.add("btn");
    a.style = "width:60px;height:30px; padding-top:0px; margin-right:0dp;";
    a.innerHTML = "DONE";

    a.onclick = function(){
        a.classList.add("disabled");
        setProductsOfOrderReady(function(da){
            a.classList.remove("disabled");
            ordersPendingSize["order_" + order.id] --;
            a.classList.remove("red");
            a.classList.add("green");
            a.innerHTML = "READY";
            a.onclick = function(){};

            if(ordersPendingSize["order_" + order.id] == 0){
                document.getElementById("scrollable-content").removeChild(li.parentNode);
            }
        }, function(e){
            a.classList.remove("disabled");
           alert("Impossible to set product ready")
        }, order.id, product.id, Date.now());
    }


    divHeader.append(span);
    divHeader.append(a);
    li.append(divHeader);
    return li;
}

function handleSubscribeNotificationError(n){
    alert("Impossible to receive push notifications");
}

function attachRetirementButtonListener(){
    var retirementButton = document.getElementById("menu-retirement-button");
    retirementButton.onclick = scanRetirement;

}

function scanRetirement(){
    scan(function (codeScanned){
        // TODO scanned request
        scanRetirement();
    }, function(){
        alert("Impossible to access this function");
    });
}




function attachMenuListeners(){
    var userNameAndSurname = document.getElementById('menu-configuration-button');
    userNameAndSurname.onclick = menuConfigurationButtonOnClickListener;
}

function menuConfigurationButtonOnClickListener(){
    PGMultiView.loadView("subscriber-configuration.html","", function(){});
}