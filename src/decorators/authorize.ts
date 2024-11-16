export function AuthorizeRole(...roles: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('authorizeRoles', roles, target, propertyKey);
    };
}

export function AuthorizeUsers(...userIds: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('authorizeUsers', userIds, target, propertyKey);
    };
}