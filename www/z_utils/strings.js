var stringKeys = {
    exit : "EXIT",
    ok : "OK",
    unexpected_error : "UNEXPECTED_ERROR",
    unexpected_error_description : "UNEXPECTED_ERROR_DESCRIPTION",
    missing_internet_connection : "MISSING_INTERNET_CONNECTION",
    missing_internet_connection_description : "MISSING_INTERNET_CONNECTION_DESCRIPTION",
    google_authentication : "GOOGLE_AUTHENTICATION",
    google_authentication_required_description : "GOOGLE_AUTHENTICATION_REQUIRED_DESCRIPTION"
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