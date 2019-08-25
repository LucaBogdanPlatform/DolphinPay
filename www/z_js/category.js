
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
        container = document.getElementById("container-category");
        //here the function on load
        loadCategory();
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

//loadCategory();
function loadCategory(){
    var sample = {'Sandwich':'Description1','Coffee':'Description2','Drink':'Description3','Ice Cream':'Description4'};
    for(var elem in sample){
        var imgName = elem.replace(' ','');
        container.appendChild(elementFactory(elem,imgName,sample[elem],1));
    }
}


function elementFactory(title,imgName,description,id){
    var div = document.createElement("div");
    div.className = "col-sm-16 col-md-8";
    div.innerHTML = '<div class="media flex-column" onClick="goToProducts(this);" name="'+id+'">'+
        '<span class="projectpic card"><img src="../z_img/'+imgName+'.jpg">'+
        '<div class="overlay category">'+
        '<h6 style="font-size: 1.8rem !important;">'+title+'</h6>'+
        '<h6 style="font-size: 1.0rem !important;">'+description+'</h6>'+
        '</div></span></div>';
    return div;
}

function goToProducts(event){
    webview.Show("z_pages/products.html?category="+event.getAttribute("name"));
}

function goBack(){
    webview.Close();
}
