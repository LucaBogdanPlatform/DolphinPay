var backButtonDOM;

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
        backButtonDOM = document.getElementById("back-button");
        setBackButtonListener();
        setOnNewRoomListener();
        loadStandRooms();

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

function getRoomDOMObject(room){
    var cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    cardContainer.classList.add("card-bottom-blue-top-red-indicator");

    var categoryContainer = document.createElement("h4");
    categoryContainer.innerHTML = room.name;
    categoryContainer.style.textAlign = "left";
    categoryContainer.style.marginLeft = "16px";
    categoryContainer.style.marginTop = "8px";

    var publishButton = document.createElement("button");
    publishButton.innerHTML = "PUBLISH";
    publishButton.style.float = "right";
    publishButton.style.marginRight = "16px";
    publishButton.style.backgroundColor = "#D47A1";
    publishButton.style.borderRadius = "10px";
    publishButton.onclick = function(){
        getRoomSubscriptionCode(function(data){
            $('#qrCodeImage').attr("src", getQrCodeImageUrl(data.url));
            $('#qrCodeGenerator').modal('show');
        },function(e){
            alert("Impossible to publish this room now");
        }, room.id);
    }

    categoryContainer.appendChild(publishButton);
    cardContainer.appendChild(categoryContainer);

    return cardContainer;
}

function setBackButtonListener(){
    backButtonDOM.onclick = function(){
        PGMultiView.dismissView();
    }
}

function setOnNewRoomListener(){
    var submitRoomCreationDOM = document.getElementById("create-room-button-modal");
    var roomNameDOM = document.getElementById("room-name");
    submitRoomCreationDOM.onclick = function(){
        var roomName = roomNameDOM.value;
        if(roomName.length === 0 || !roomName.trim()){
           alert("Invalid room name");
           return;
        }
        var roomsContainer = document.getElementById("rooms-container");
        createRoomForStand(function(room){
            roomsContainer.appendChild(getRoomDOMObject(room));
            $('#newRoomModal').modal('hide')
        },function(e){
            alert("Impossible to create a new room");
        }, roomName.trim(), getUserInfo().genericPlatform.standId);
    }
}

function loadStandRooms(room){
    getStandRooms(function(rooms){
        var roomsContainer = document.getElementById("rooms-container");
        for(var i = 0; i < rooms.length; i++){
            roomsContainer.appendChild(getRoomDOMObject(rooms[i]));
        }
    },function(e){
        alert("Impossible to load rooms");
    }, getUserInfo().genericPlatform.standId);


}