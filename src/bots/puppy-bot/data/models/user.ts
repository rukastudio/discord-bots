// src/bots/bot1/models/User.ts
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    schema: "puppy-bot",              // The schema within the database for Bot 1
    tableName: "users",          // Table name within the schema
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    points!: number;
}
