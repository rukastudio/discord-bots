const interactions = {}
const db = require('./db.js');

function getAmount(interaction) {
    const amount = interaction.options.get('amount').value;

    if (amount <= 0) {
        interaction.reply(`You have to gift atleast more than 0 Puppy Points.`);

        return;
    }

    if (amount % 1 !== 0) {
        interaction.reply(`Provide a whole number as the amount of Puppy Points.`);

        return;
    }

    return amount;
}

interactions.pp = async function (interaction) {
    const member = interaction.options.get('user');
    const user = member && member.user || interaction.user

    if (user.bot) {
        interaction.reply(`<@${user.id}> simply cannot have ANY Puppy Points wanwan :C`);

        return;
    }

    try {
        const pp = await db.getpp(user.id);
        const valueName = pp === 1 && 'Puppy Point' || 'Puppy Points'

        if (member === null || member.user === interaction.user) {
            interaction.reply(`You have ${pp} ${valueName}!`);
        } else {
            interaction.reply(`<@${user.id}> has ${pp} ${valueName}!`);
        }
    } catch (error) {
        if (member === null || member.user === interaction.user) {
            interaction.reply(`Something went wrong while trying to get your Puppy Points. Try again later`);
        } else {
            interaction.reply(`Something went wrong while trying to get <@${user.id}>'s Puppy Points. Try again later`);
        }
    }
}

interactions.gift = async function (interaction) {
    const user = interaction.user;
    const otherUser = interaction.options.get('user').user;
    const amount = getAmount(interaction);

    if (amount === null) return;

    if (user === otherUser) {
        interaction.reply('You cannot gift yourself Puppy Points.');

        return;
    }

    if (otherUser.bot) {
        interaction.reply(`<@${otherUser.id}> is not able to recieve Puppy Points.`);

        return;
    }

    try {
        const pp = await db.getpp(user.id);

        if (pp < amount) {
            interaction.reply(`You don't have enough Puppy Points to gift that amount.`);

            return;
        }

        await db.giftpp(user.id, otherUser.id, amount);

        const valueName = amount === 1 && 'Puppy Point' || 'Puppy Points'
        interaction.reply(`You have gifted <@${otherUser.id}> ${amount} ${valueName}!`);
    } catch (error) {
        interaction.reply(`Something went wrong while trying to gift <@${otherUser.id}> Puppy Points. Try again later`);
    }
}

interactions.gamble = async function(interaction) {
    const user = interaction.user;
    const amount = getAmount(interaction);

    if (amount === null) return;

    const outcome = Math.random() < 0.5;

    if (outcome === true)  {
        
    } else if(outcome === false) {

    }
}

module.exports = interactions