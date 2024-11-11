const { ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'pp',
        description: 'Tells you how much Puppy Points you or another user has!',
        options: [
            {
                name: 'user',
                description: 'The user that you will see the pp of.',
                type: ApplicationCommandOptionType.User
            }
        ]
    },
    {
        name: 'gift',
        description: 'Gifts another user some of your Puppy Points.',
        options: [
            {
                name: 'user',
                description: 'The user that will recieve the Puppy Points.',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'amount',
                description: 'The amount of Puppy Points that you will gift.',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: 'gamble',
        description: 'Gamble your Puppy Points with a 50% chance to double the amount.',
        options: [
            {
                name: 'amount',
                description: 'The amount of Puppy Points that you will gamble with.',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    }
];

module.exports = commands;