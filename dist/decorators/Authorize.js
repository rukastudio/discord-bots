"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeRole = AuthorizeRole;
exports.AuthorizeUsers = AuthorizeUsers;
function AuthorizeRole(...roles) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('authorizeRoles', roles, target, propertyKey);
    };
}
function AuthorizeUsers(...userIds) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('authorizeUsers', userIds, target, propertyKey);
    };
}
