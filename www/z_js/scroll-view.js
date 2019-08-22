var elements = new Array();
var scrollWindowSize = parseInt($(window).height() / 146) + 4;
var offset = (scrollWindowSize % 2 == 0) ? 0 : 0.5;
var downloadingContent = false;
var N_TOTAL_ELEM = 0;
var INDEX_ELEM = 0;

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
        initialContent();
        setScrollListener();
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

/**
* Set's the scroll listener to the scrollview.
* New chunk of elements are loaded when the listView is scrolled to the end
*/
function setScrollListener(){
    var win = $(window);
	// Each time the user scrolls
	win.scroll(function() {
        windowEffect();
		if ($(document).height() - win.height() <= win.scrollTop() && !downloadingContent && INDEX_ELEM != N_TOTAL_ELEM) {
		    //here the code for call web service
			downloadingContent = true;
		    getStands(function(data){
                addChunk(data.list);
                downloadingContent = false;
		    }, function(error){
                alert("ERROR LOADING STANDS"); // FIXME mmanage it
                downloadingContent = false;
		    }, elements.length);
		}
	});
}

/**
* This function is used for make the scroll view light weight
*/
function windowEffect(){
    var middleElementIndex = middleVisibleElementIndex();
    if((middleElementIndex - (scrollWindowSize / 2) - offset) < 0 &&
        (middleElementIndex + (scrollWindowSize / 2) - offset) > elements.length -1){
           for( var i = 0 ; i < elements.length ; i++ ){elements[i].style.visibility = "visible";}
    }
    else if (middleElementIndex - (scrollWindowSize / 2) - offset < 0){
        //parto da 0 e rendo visibili scrollWindowSize elementi
        for( var i = 0 ; i < elements.length ; i++ ){
            if(i < scrollWindowSize) elements[i].style.visibility = "visible";
            else elements[i].style.visibility = "hidden";
        }
    }
    else{
        //parto da middleElementIndex - (scrollWindowSize / 2) - offset e rendo visibili scrollWindowSize elementi
        for( var i = 0 ; i < elements.length ; i++ ){
            if( i >= middleElementIndex - (scrollWindowSize / 2) - offset &&
                i <= middleElementIndex + (scrollWindowSize / 2) - offset) elements[i].style.visibility = "visible";
            else elements[i].style.visibility = "hidden";
        }
    }
}


/**
* This function return the middle visible element in the view
*/
function middleVisibleElementIndex(){
    var completed = false;
    var indexSum = 0;
    var elemNumber = 0;
    for(var i = 0 ; (i < elements.length && !completed); i++){
        if(isElementInViewport(elements[i])){
            indexSum+= elements.indexOf(elements[i]);
            elemNumber++;
        }
        else{
            if(elemNumber != 0) completed = true;
        }
    }
    return (elemNumber > 0) ? parseInt(indexSum/elemNumber) : 0;
}


/**
* This function is used for know if an element is out or in the current viewPort
*/
function isElementInViewport (el) {
    if (typeof jQuery === "function" && el instanceof jQuery) el = el[0];
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= $(window).height() && rect.right <= $(window).width()
    );
}


/**
* This function is used for load the initial elements
*/
function initialContent () {

    getStands(function(data){
        N_TOTAL_ELEM = data.total;
        addChunk(data.list, true);
    }, function(error){
        alert("ERROR LOADING"); // TODO fixed
    }, 0);

}

function addChunk(chunkArray, isFirstCall = false){
    var chunkSize = chunkArray.length;
    var checkElemIndex = 0;
    for(var i = 0 ; i < scrollWindowSize ;i++){
        if(INDEX_ELEM === N_TOTAL_ELEM){
            document.getElementById('spinner-container').style.display = "none";
            break;
        }else if((checkElemIndex = (chunkArray.length - chunkSize)) < chunkArray.length){
            var elem = elemFactory('Bibione, IT ' + chunkArray[checkElemIndex].id, 'Chiosco delfino','visible');
            $('#scrollable-content').append(elem);
            elements.push(elem);
            chunkSize --;
            INDEX_ELEM ++;
            if(!isFirstCall){
                windowEffect();
            }
        }
    }
    if(isFirstCall){
        windowEffect();
    }
}

function elemFactory(position,name,visibility){
    var elem = document.createElement("div");
    elem.style.borderRadius = "10px";
    elem.style.visibility = visibility;
    elem.style.background = "#FFFFFF"
    elem.className = "media flex-column";
    elem.innerHTML = '<br>'+
        '<span class="message_userpic">'+
        '<img class="d-flex mr-3" src="../img/user-header.png" alt="Generic user image"'+
        '<span class="user-status bg-success"></span>'+'</span>'+'<div class="media-body">'+
        '<h6 class="mt-0 mb-1">'+name+'</h6>'+position+'</div>'+'<br>';
    return elem;
}
