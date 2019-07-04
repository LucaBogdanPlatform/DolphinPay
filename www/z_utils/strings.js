var stringKeys = {
    exit : "EXIT",
    unexpected_error : "UNEXPECTED_ERROR",
    unexpected_error_description : "UNEXPECTED_ERROR_DESCRIPTION"
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