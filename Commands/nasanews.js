const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const fetch = require('node-fetch');
module.exports = {
    name: 'nasanews',
    description: `Looks up an astronomy-related term on NASA's Website and returns a fact about it.`,
    usage: 'nasanews `term`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let term = [];
        for (i = 0; i < args.length; i++)
            term = term + args[i] + ' ';
        if (!args[0])
            message.channel.send(`Proper command usage: ${prefix}nasanews [term]`);
        else {
            let data = await fetch(`https://images-api.nasa.gov/search?q=${term}`)
                .then(res => res.json());
            if (!data.collection.items[0].data[0].description)
                message.channel.send(`Couldn't find any results for ${term}`);
            else {
                let nasasearchembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle(data.collection.items[0].data[0].title)
                    .setDescription(data.collection.items[0].data[0].description)
                    .setImage(data.collection.items[0].links[0].href)
                    .setTimestamp();
                message.channel.send(nasasearchembed);
            }
        }
    }
}