import { User } from "../models/user";

export class UserDatabase {
    constructor() {}

    public async getUser(userId: string): Promise<User> {
        let user = await User.findByPk(userId);

        if (!user) {
            user = await this.createUser(userId);
        }

        return user;
    }

    public async createUser(userId: string): Promise<User> {
        return await User.create({
            userId: userId,
            points: 0
        })
    }
}