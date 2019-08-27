var backButtonDOM;
var allStandCategoriesCached = null;
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
        setAddCategoryListener();
        setRemovePlatformButtonListener();

        getConfiguredCategories();
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
    categoryContainer.innerHTML = category.name;
    categoryContainer.style.textAlign = "left";
    categoryContainer.style.marginLeft = "16px";
    categoryContainer.style.marginTop = "8px";

    var removeCategoryButton = document.createElement("button");
    removeCategoryButton.innerHTML = "REMOVE";
    removeCategoryButton.style.float = "right";
    removeCategoryButton.style.marginRight = "16px";
    removeCategoryButton.style.backgroundColor = "#D47A1";
    removeCategoryButton.style.borderRadius = "10px";

    removeCategoryButton.onclick = function(){
        deleteCategoryFromRoom(function(){
            cardContainer.removeChild(categoryContainer);
        }, function(e){
            alert("Impossible to remove this category");
        }, category.id, getUserInfo().genericPlatform.roomId);
    }

    categoryContainer.appendChild(removeCategoryButton);
    cardContainer.appendChild(categoryContainer);

    return cardContainer;
}

function getConfiguredCategories(){
    var categoriesContainer = document.getElementById("categories-container");
    getRoomCategories(function(data){
        for(var i = 0; i<data.length; i++){
            categoriesContainer.appendChild(getCategoryDOMObject(data[i]));
        }
    }, function(e){
        alert("Impossible to load categories");
    }, getUserInfo().genericPlatform.roomId);
}

function setBackButtonListener(){
    backButtonDOM.onclick = function(){
        webview.Close();
    }
}

function setAddCategoryListener(){
    var addCategoryButton = document.getElementById("add-category-button");
    addCategoryButton.onclick = function(){
        if(allStandCategoriesCached != null){
            addCategorySuccess(allStandCategoriesCached);
            return;
        }

        getStandCategories(function(categories){
        this.allStandCategoriesCached = categories;
            addCategorySuccess(categories);
        },function(e){
            alert("Impossible to add new category");
        }, getUserInfo().genericPlatform.standId);
    }
}

function addCategorySuccess(categories){
    var itemsCategoriesList = [];
    for(var i = 0; i<categories.length; i++){
        itemsCategoriesList[i] = {
            text : categories[i].name,
            value : categories[i]
        };
    }

    var config = {
        title: "Select a Category",
        items: itemsCategoriesList,
        doneButtonLabel: "Done",
        cancelButtonLabel: "Cancel"
    };

    window.plugins.listpicker.showPicker(config,
        function(item) {
            requestAddCategoryHTTP(JSON.parse(item));
        },
        function() {
        }
    );
}

function requestAddCategoryHTTP(category){
    addCategoryToRoom(function(){
        var categoriesContainer = document.getElementById("categories-container");
        categoriesContainer.appendChild(getCategoryDOMObject(category));
    }, function (e){
        alert("Impossible to add new category");
    }, getUserInfo().genericPlatform.roomId, category.id);
}

function setRemovePlatformButtonListener(){
    var removePlatformButton = document.getElementById("remove-platform-button");
    removePlatformButton.onclick = function(){
        showDialogRequireConfirm(
            "The platform will be closed forever",
            "Delete platform",
            "BACK",
            "DELETE",
            function(){
            },
            function(){
                removePlatform();
            }
        );
    }
}

function removePlatform(){
    deletePlatformSubscriber(function(){
        PGMultiView.loadView("environments.html", "", function(){}, function(){});
    }, function(e){
        alert("Impossible to remove the platform");
    }, getUserInfo().genericPlatform.id);
}