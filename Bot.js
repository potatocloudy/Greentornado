var express = require('express');
var app = express();app.get('/', function (req, res) {
  res.send('Hello World!');
});app.listen(80, function () {
  console.log('App listening on port 80');
});
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const welcomer = require('./actions/welcomeUser')
const statusRotator = require('./rotators/status')
const client = new commando.Client({
  owner: ['421883193969344524', '373833473091436546'],
  commandPrefix: 'g!'
});

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    statusRotator.startRotation(client);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'bot-spam');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    welcomer.welcomeAUser(member, channel);
  })
  .on('message', message => {
    if (message.content === '!join') {
      client.emit('guildMemberAdd', message.member);
    }
  });

client.setProvider(
  sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
  .registerGroups([
    ['administration', 'Administration'],
    ['math', 'Math'],
    ['test', 'Test'],
    ['coins', 'Coins'],
    ['annoyance', 'Annoyance'],
    ['how_to_win_an_arguement', 'how to win an argument'],
    ['github', 'GitHub'], 
    ['osu', 'osu!']
  ])
  .registerDefaults()
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.TOKEN);


