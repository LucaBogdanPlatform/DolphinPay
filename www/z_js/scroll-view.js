var elements = new Array();
var scrollWindowSize = 7;
var offset = 0.5;
var downloadingContent = false;

/**
* This function is used for intercept scroll event and implement a similar scroll view
*/
$(document).ready(function() {
	var win = $(window);
	// Each time the user scrolls
	win.scroll(function() {
        windowEffect();
		if ($(document).height() - win.height() <= win.scrollTop() && !downloadingContent) {
		    //here the code for call web service
			setTimeout(function(){
			downloadingContent = true;
                for(var i = 0 ; i<4 ;i++){
                    var elem = document.createElement("div");
                    elem.style.borderRadius = "15px";
                    elem.className = "media flex-column";
                    elem.style.visibility = "hidden";
                    elem.innerHTML = '<br>'+
                                     '<span class="message_userpic">'+
                                     '<img class="d-flex mr-3" src="../img/user-header.png" alt="Generic user image"'+
                                     '<span class="user-status bg-success "></span>'+
                                     '</span>'+
                                     '<div class="media-body">'+
                                     '<h6 class="mt-0 mb-1">Chiosco delfino</h6>'+
                                     'Bibione, IT'+
                                     '</div>'+
                                     '<br>';
                    $('#scrollable-content').append(elem);
                    elements.push(elem);
                    windowEffect();
                }
                downloadingContent = false;
            }, 2000);

		}
	});
});


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
                i <= middleElementIndex + (scrollWindowSize / 2) - offset){
                elements[i].style.visibility = "visible";
            }
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
    if (typeof jQuery === "function" && el instanceof jQuery) {
       el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= $(window).height() &&
        rect.right <= $(window).width()
    );
}


/**
* This function is used for load the initial elements
*/
function initialContent () {
    for(var i = 0 ; i < 4 ;i++){
        var elem = document.createElement("div");
        elem.style.borderRadius = "15px";
        elem.className = "media flex-column";
        elem.innerHTML = '<br>'+
                         '<span class="message_userpic">'+
                         '<img class="d-flex mr-3" src="../img/user-header.png" alt="Generic user image"'+
                         '<span class="user-status bg-success "></span>'+
                         '</span>'+
                         '<div class="media-body">'+
                         '<h6 class="mt-0 mb-1">Chiosco delfino</h6>'+
                         'Bibione, IT'+
                         '</div>'+
                         '<br>';
        $('#scrollable-content').append(elem);
        elements.push(elem);
    }
    windowEffect();
}
