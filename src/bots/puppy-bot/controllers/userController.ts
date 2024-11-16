import { AuthorizeUsers } from "../../../decorators/authorize";
import { Command } from "../../../decorators/command";
import { User } from "../data/models/user";

export class UserController {
    constructor() {}

    @Command('pp')
    public async getPoints(botUser: User, user: User, otherUser: User | null) {
        let reply: string;

        if (!otherUser || user.userId === otherUser.userId) {
            reply = `You have ${user.formatPoints()}`
        } else if(botUser.userId === otherUser.userId) {
            reply = `I have ${botUser.formatPoints()}`;
        } else {
            reply = `<@${otherUser.userId}> has ${otherUser.formatPoints()}`;
        }

        return reply;
    }

    @Command('gift')
    public async giftPoints(botUser: User, user: User, otherUser: User, amount: number) {
        if (!otherUser || user.userId === otherUser.userId) {
            return "You can't gift points to yourself";
        }

        if (user.points < amount) {
            return `You only have ${user.formatPoints()} to gift`;
        }

        user.points -= amount;
        otherUser.points += amount;

        await user.save();
        await otherUser.save();

        return `You have successfully gifted ${user.formatPoints(amount)} to <@${otherUser.userId}>`;
    }

    @Command("setpp")
    @AuthorizeUsers('741311572940685313')
    public async setPuppyPoints(
        botUser: User, 
        user: User, 
        targetUser: User, 
        amount: number
    ): Promise<string> {
        targetUser.points = amount;

        await targetUser.save();

        if (targetUser.userId === user.userId) {
            return `Successfully set your Puppy Points to ${amount}`;
        } else {
            return `Successfully set <@${targetUser.userId}>'s Puppy Points to ${amount}`;
        }
    }

    @Command('gamble')
    public async gamblePoints(botUser: User, user: User, amount: number): Promise<string> {
        const userPoints = user.points;

        if (userPoints < amount) {
            return `You don't have enough Puppy Points to gamble.`;
        }

        const outcome = Math.random() < 0.5 ? 'lost' : 'won';

        let newPoints = userPoints;

        if (outcome === 'won') {
            newPoints += amount; // Double the points if they win
        } else {
            newPoints -= amount; // Subtract the amount if they lose
        }

        user.points = newPoints;

        await user.save();

        return `You ${outcome} the gamble! You have ${user.formatPoints()} now`;
    }
}