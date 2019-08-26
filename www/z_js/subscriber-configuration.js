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

        document.getElementById("categories-container").appendChild(getCategoryDOMObject(null));
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

function getCategoryDOMObject(category){
    var cardContainer = document.createElement("div");
    cardContainer.classList.add("card");

    var categoryContainer = document.createElement("h4");
    categoryContainer.innerHTML = "Hamburgers";
    categoryContainer.style.textAlign = "left";
    categoryContainer.style.marginLeft = "16px";
    categoryContainer.style.marginTop = "8px";

    var removeCategoryButton = document.createElement("button");
    removeCategoryButton.innerHTML = "REMOVE";
    removeCategoryButton.style.float = "right";
    removeCategoryButton.style.marginRight = "16px";
    removeCategoryButton.style.backgroundColor = "#D47A1";
    removeCategoryButton.style.borderRadius = "10px";

    categoryContainer.appendChild(removeCategoryButton);
    cardContainer.appendChild(categoryContainer);

    return cardContainer;
}

function setBackButtonListener(){
    backButtonDOM.onclick = function(){
        webview.Close();
    }
}