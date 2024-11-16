import 'reflect-metadata';

export function Command(commandName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('commandName', commandName, target, propertyKey);
    };
}