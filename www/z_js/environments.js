var environmentsContainerDOM;
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
        environmentsContainerDOM = document.getElementById("environments-container");
        backButtonDOM = document.getElementById("back-button");
        setBackButtonListener();
        setAddSubscriptionButtonListener();
        getUserEnvironments();
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

function getUserEnvironments(){
    getUserPlatforms(function(data){
        buildEnvironmentsList(data);
    }, function(e){
        alert(JSON.stringify(e));
    });
}

function buildEnvironmentsList(environmentsArray){
    for(var i = 0; i < environmentsArray.length; i++){
        environmentsContainerDOM.appendChild(getEnvironmentHTMLObject(environmentsArray[i]));
    }
}

function getEnvironmentHTMLObject(environment){
    var card = document.createElement("div");
    card.classList.add("card");
    if(isStandardPlatform(environment)){
        card.classList.add("card-green-indicator");
    }else if(isSubscriberPlatform(environment)){
        card.classList.add("card-orange-indicator");
    }else if(isPartnershipPlatform(environment)){
        card.classList.add("card-red-indicator");
    }else{
        return null;
    }

    if(isCurrentPlatform(environment)){
        card.classList.add("card-current");
    }


    var cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    var roleName = document.createElement("h6");
    roleName.setAttribute("align", "left");
    roleName.innerHTML = environment.role.name.replaceAll("_", " ");

    var name = document.createElement("h4");
    name.setAttribute("align", "left");
    name.innerHTML = environment.name;

    var creationDate = document.createElement("p");
    creationDate.setAttribute("align", "left");

    var date = Date.parse(environment.creationDate);

    creationDate.innerHTML = environment.creationDate.substring(0, 10);

    cardContainer.appendChild(roleName);
    cardContainer.appendChild(name);
    cardContainer.appendChild(creationDate);
    card.appendChild(cardContainer);

    card.onclick = function(){

        if(isCurrentPlatform(environment)){
            webview.Close();
            return;
        }

        onClickEnvironmentListener(environment);
    };

    return card;
}

function onClickEnvironmentListener(environment){
    var dashboardPath;
    if(isStandardPlatform(environment)){
        dashboardPath = "dashboard.html";
    }else if(isSubscriberPlatform(environment)){
        dashboardPath = "dashboard-subscriber.html";
    }else if(isPartnershipPlatform(environment)){
        dashboardPath = "dashboard-partnership.html";
    }else{
        return;
    }
    updatePlatform(environment);
    PGMultiView.loadView(dashboardPath,"", function(){PGMultiView.dismissView("")});
}

function setBackButtonListener(){
    backButtonDOM.onclick = function(){
        PGMultiView.dismissView("");
    }
}

function setAddSubscriptionButtonListener(){
    var addSubscriptionButton = document.getElementById("add-subscription-button");
    var scannedCodeLabel = document.getElementById("scannedCodeLabel");
    addSubscriptionButton.onclick = function (){
        scan(function (codeScanned){
            scannedCodeLabel.innerHTML = "Scanned: " + codeScanned;
            $('#newSubscriptionModal').modal('show');
            document.getElementById("create-subscription-button").onclick = function(){
                createSubscriptionPlatform(function(platform){
                    onClickEnvironmentListener(platform);
                }, function(e){
                    alert("Impossible to create platform")
                }, document.getElementById("platformNameInput").value, codeScanned);
                $('#newSubscriptionModal').modal('hide');
            }

        }, function(){
            alert("Impossible to access this function");
        });
    }

}