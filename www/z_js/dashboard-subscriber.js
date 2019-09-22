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
        firebaseObserveNotification(handleNewNotification, handleSubscribeNotificationError);
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
//    onBackKeyDown: function(){
//        alert("A");
//        navigator.app.exitApp();
//        return false;
//    }
}
app.initialize();

function handleNewNotification(n){
    var order = JSON.parse(n.order);
    var existingOrderDOM = document.getElementById("order_" + order.id);
    if(existingOrderDOM !== null){
        existingOrderDOM.append(buildNewProduct(order.products));
    }else{
        var newOrderDOM = buildNewOrder(order);
        var newOrderRowDOM = buildNewProduct(order, order.products);

        newOrderDOM.append(newOrderRowDOM);
        document.getElementById("scrollable-content").append(newOrderDOM);
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
    span.innerHTML = product.name;
    span.style = "float:left;margin-left:10px;width:100%;text-align:left;";
    span.append(document.createElement("br"));

    var spanEndPrepare = document.createElement("span");
    spanEndPrepare.style = "float:left;";
    spanEndPrepare.innerHTML = "EXPIRE TIME: " + new Date(order.expectedEndTime).toLocaleTimeString('it-IT');
    span.append(spanEndPrepare);

    divHeader.append(span);
    li.append(divHeader);
    return li;
}

function handleSubscribeNotificationError(n){
    alert("Impossible to receive push notifications");
}

function attachMenuListeners(){
    var userNameAndSurname = document.getElementById('menu-configuration-button');
    userNameAndSurname.onclick = menuConfigurationButtonOnClickListener;
}

function menuConfigurationButtonOnClickListener(){
    PGMultiView.loadView("subscriber-configuration.html","", function(){});
}