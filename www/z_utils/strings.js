var stringKeys = {
    exit : "EXIT",
    ok : "OK",
    unexpected_error : "UNEXPECTED_ERROR",
    unexpected_error_description : "UNEXPECTED_ERROR_DESCRIPTION",
    missing_internet_connection : "MISSING_INTERNET_CONNECTION",
    missing_internet_connection_description : "MISSING_INTERNET_CONNECTION_DESCRIPTION",
    google_authentication : "GOOGLE_AUTHENTICATION",
    google_authentication_required_description : "GOOGLE_AUTHENTICATION_REQUIRED_DESCRIPTION",
    server_authentication_error : "SERVER_AUTHENTICATION_ERROR",
    server_authentication_error_description : "SERVER_AUTHENTICATION_ERROR_DESCRIPTION"
}

String.prototype.replaceAll = function(searchStr, replaceStr) {
	var str = this;

    // no match exists in string?
    if(str.indexOf(searchStr) === -1) {
        // return string
        return str;
    }

    // replace and remove first match, and do another recursirve search/replace
    return (str.replace(searchStr, replaceStr)).replaceAll(searchStr, replaceStr);
}


function getStringsResources(names, retrievedCallback){
    if(names == null || names.length == 0){
        return successCallback([]);
    }
    var nameRequiredIndex = 0;
    var namesRetrieved = [];
    var resolveName = function(name){
        namesRetrieved[nameRequiredIndex] = name == null? "None" : name;
        nameRequiredIndex ++;
        namesResolver();
    }
    var namesResolver = function(){
        if(nameRequiredIndex >= names.length){
            retrievedCallback(namesRetrieved);
        }else{
            localization.get(
                names[nameRequiredIndex],
                function(_string) {resolveName(_string);}, function(){resolveName(null);}
            );
        }
    }
    namesResolver();
}