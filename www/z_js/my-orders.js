
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
        setBackButtonListener();
        loadOrders();
        attachFirebaseListeners();
    },

    onPause: function() {

    },
    onResume: function(event) {
        attachFirebaseListeners();
        setBackButtonListener();
    }
}
app.initialize();

function setBackButtonListener(){
    document.getElementById("back-button").onclick = function(){
        PGMultiView.dismissView("");
    }
}
function loadOrders(){
    getOrdersNotRetired(function (ords){
        buildOrdersList(ords);
    }, function(e){
        alert("Impossible to load your orders");
    });
}
function buildOrdersList(ords){
    if(ords.ordersProducts.length == 0){
        document.getElementById("container-orders").innerHTML = "0 pending orders";
        return;
    }

    for(i = 0; i<ords.ordersProducts.length; i++){
        var order = ords.ordersProducts[i];
        var existingOrderDOM = document.getElementById("order_" + order.id);
        if(existingOrderDOM !== null){
            existingOrderDOM.append(buildNewProduct(order, order.products));
        }else{
            var newOrderDOM = buildNewOrder(order);
            document.getElementById("container-orders").append(newOrderDOM);
            var newOrderRowDOM = buildNewProduct(order, order.products);
            newOrderDOM.append(newOrderRowDOM);
        }


    }

}
function buildNewOrder(order){
    var standBlock = document.createElement("ul");
    standBlock.classList.add("collapsible");
    standBlock.tag = "0";
    standBlock.id = "order_" + order.id;

    var orderNumber = document.createElement("p");
    orderNumber.innerHTML = "ORDER "+order.id;
    orderNumber.style.innerHTML = "padding-top:8px;";

    var orderExpireTime = document.createElement("p");
    orderExpireTime.id = "expire_time_order_"+order.id;
    orderExpireTime.style.innerHTML = "padding-top:8px;";

    var retireButton = document.createElement("a");
    retireButton.style = "width:100%;padding:16px;color:white;visibility:collapse;";
    retireButton.classList.add("waves-effect");
    retireButton.classList.add("cyan");
    retireButton.classList.add("accent-3");
    retireButton.id = "retire_button_" + order.id;
    retireButton.innerHTML = "PICK UP";
    retireButton.onclick = function(e){
        $('#qrCodeImage').attr("src", getQrCodeImageUrl(retireButton.tag));
        $('#qrCodeGenerator').modal('show');

    };

    standBlock.append(retireButton);
    standBlock.append(orderNumber);
    standBlock.append(orderExpireTime);

    return standBlock;
}
function buildNewProduct(order, product){
    var orderContainer = document.getElementById("order_" + order.id);
    var retireButton = document.getElementById("retire_button_" + order.id);
    if(order.state.id >= parseInt(orderContainer.tag)){
        orderContainer.tag = ""+order.state.id;
        var color;
        switch(order.state.id){
            case 1: color = "#f5f5f5";
            break;
            case 2: color = "orange";
            break;
            case 3: {
                color = "#00e5ff";
                retireButton.tag = order.retireCode;
                retireButton.style = "width:100%;padding:16px;color:white;visibility:visible;";
            }
            break;
            case 4: color = "blue";
            break;
        }
        orderContainer.style= "width:100%; background:" + color + ";";
    }

    var li = document.createElement("li");

    var divHeader = document.createElement("div");
    divHeader.classList.add("collapsible-header");

    var span = document.createElement("span");
    span.innerHTML = product.name + " X " + order.quantity;
    span.style = "margin-left:10px;width:75%;text-align:left;";
    span.append(document.createElement("br"));

    document.getElementById("expire_time_order_" + order.id).innerHTML =
        "READY AT: " + new Date(order.expectedEndTime).toLocaleTimeString('it-IT');

    divHeader.append(span);
    li.append(divHeader);
    return li;
}


function attachFirebaseListeners(){
    firebaseObserveNotification(onMessegeReceiveFBListener, handleSubscribeNotificationError);
}

function onMessegeReceiveFBListener(data){
    if(data.p_code == "1"){
        onOrderClosed(JSON.parse(data.order));
    }else if(data.p_code == "2"){
        onOrderReady(JSON.parse(data.order));
    }
}

function onOrderClosed(order){
    $('#qrCodeGenerator').modal('hide');
    var orderLayout = document.getElementById("order_" + order.id);
    if(orderLayout !== null){
        document.getElementById("container-orders").removeChild(orderLayout);
    }
}

function onOrderReady(order){
    var orderLayout = document.getElementById("order_" + order.id);
    if(orderLayout !== null){
        var retireButton = document.getElementById("retire_button_" + order.id);
        orderLayout.style= "width:100%; background:#00e5ff;";
        retireButton.tag = order.retireCode;
        retireButton.style = "width:100%;padding:16px;color:white;visibility:visible;";
    }
}

function handleSubscribeNotificationError(e){
    alert("Impossible to receive push notifications");
}