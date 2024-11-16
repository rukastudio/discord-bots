// src/bots/bot1/models/User.ts
import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
    schema: 'puppy-bot',              // The schema within the database for Bot 1
    tableName: 'users',          // Table name within the schema
})
export class User extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
    })
    userId!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    points!: number;

    formatPoints(points?: number): string {
        points = points || this.points;

        return `${points} Puppy Point${points !== 1 ? 's' : ''}`;
    }
}
