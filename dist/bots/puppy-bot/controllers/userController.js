"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const authorize_1 = require("../../../decorators/authorize");
const command_1 = require("../../../decorators/command");
const user_1 = require("../data/models/user");
class UserController {
    constructor() { }
    getPoints(botUser, user, otherUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let reply;
            if (!otherUser || user.userId === otherUser.userId) {
                reply = `You have ${user.formatPoints()}`;
            }
            else if (botUser.userId === otherUser.userId) {
                reply = `I have ${botUser.formatPoints()}`;
            }
            else {
                reply = `<@${otherUser.userId}> has ${otherUser.formatPoints()}`;
            }
            return reply;
        });
    }
    giftPoints(botUser, user, otherUser, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!otherUser || user.userId === otherUser.userId) {
                return "You can't gift points to yourself";
            }
            if (user.points < amount) {
                return `You only have ${user.formatPoints()} to gift`;
            }
            user.points -= amount;
            otherUser.points += amount;
            yield user.save();
            yield otherUser.save();
            return `You have successfully gifted ${user.formatPoints(amount)} to <@${otherUser.userId}>`;
        });
    }
    setPuppyPoints(botUser, user, targetUser, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            targetUser.points = amount;
            yield targetUser.save();
            if (targetUser.userId === user.userId) {
                return `Successfully set your Puppy Points to ${amount}`;
            }
            else {
                return `Successfully set <@${targetUser.userId}>'s Puppy Points to ${amount}`;
            }
        });
    }
    gamblePoints(botUser, user, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPoints = user.points;
            if (userPoints < amount) {
                return `You don't have enough Puppy Points to gamble.`;
            }
            const outcome = Math.random() < 0.5 ? 'lost' : 'won';
            let newPoints = userPoints;
            if (outcome === 'won') {
                newPoints += amount; // Double the points if they win
            }
            else {
                newPoints -= amount; // Subtract the amount if they lose
            }
            user.points = newPoints;
            yield user.save();
            return `You ${outcome} the gamble! You have ${user.formatPoints()} now`;
        });
    }
}
exports.UserController = UserController;
__decorate([
    (0, command_1.Command)('pp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, user_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPoints", null);
__decorate([
    (0, command_1.Command)('gift'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, user_1.User, user_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "giftPoints", null);
__decorate([
    (0, command_1.Command)("setpp"),
    (0, authorize_1.AuthorizeUsers)('741311572940685313'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User,
        user_1.User,
        user_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPuppyPoints", null);
__decorate([
    (0, command_1.Command)('gamble'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, user_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "gamblePoints", null);
