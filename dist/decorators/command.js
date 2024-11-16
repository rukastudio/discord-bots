"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = Command;
require("reflect-metadata");
function Command(commandName) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('commandName', commandName, target, propertyKey);
    };
}
