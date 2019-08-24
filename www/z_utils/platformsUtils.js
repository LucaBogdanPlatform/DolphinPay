
var platformsTypes = ["ROLE_STANDARD_USER", "ROLE_ADMIN_GUEST", "ROLE_ADMIN"];

function isStandardPlatform(platform){
    return platform.role.name == platformsTypes[0];
}

function isSubscriberPlatform(platform){
    return platform.role.name == platformsTypes[1];
}

function isPartnershipPlatform(platform){
    return platform.role.name == platformsTypes[2];
}