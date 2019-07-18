var elements = new Array();

/**
* This function is used for implement a similar scroll view
*/
$(document).ready(function() {
	var win = $(window);
	// Each time the user scrolls
	win.scroll(function() {
        windowEffect();
		if ($(document).height() - win.height() <= win.scrollTop()) {
		    //here the code for call web service
			setTimeout(function(){
                for(var i = 0 ; i<5 ;i++){
                    var elem = document.createElement("div");
                    elem.style.borderRadius = "15px";
                    elem.className = "media flex-column";
                    if(i != 0) elem.style.visibility = "hidden";
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
            }, 2000);

		}
	});
});


/**
* This function is used for make the scroll view light weight
*/
function windowEffect(){
    for(var i = 0 ; i < elements.length ; i++){
        if(!isElementInViewport(elements[i])){
            elements[i].style.visibility = "hidden";
        }
        else{
            elements[i].style.visibility = "visible";
        }
    }
    var onlyVisible = elements.filter(function(elem){
        return elem.style.visibility === "visible";
    });
    console.log(elements.indexOf(onlyVisible[0]))
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
    for(var i = 0 ; i < 5 ;i++){
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
}
