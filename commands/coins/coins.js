const { Command } = require('discord.js-commando');
const { GoogleSpreadsheet } = require('google-spreadsheet');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coins',
            group: 'coins',
            memberName: 'coins',
            description: 'Check your coins.',
            examples: ['repeat'],
            
            args: [
				{
					key: 'user',
                    label: 'user',
                    prompt: 'ghjfghg',
                    type: 'string',
                    default: ''
				}
			]
        });
    }

    async run(msg, { user }){
        const doc = new GoogleSpreadsheet(process.env.SHEET);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
          });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        var rows = await sheet.getRows();
        var msguserid = msg.author.id;
        var i;
        //var user = user.substring("<",">");
        user = user.replace(/[\\<>@#&!]/g, "");
        user = user.replace(/\D/g,'');
        var rowy = 0;
        if (user === "") {
            for (i = 0; i < rows.length; i++) {
                if (rows[i].id === msguserid) {
                    //var rownum = i;
                    rowy = 1;
                    break;
                }
            } 
            if (rowy === 1) {
                return msg.reply("You have " + rows[i].coins + " coins.");
            } else {
                return msg.reply("You're broke, idiot.");
            }
        } else {
            for (i = 0; i < rows.length; i++) {
                if (rows[i].id === user) {
                    //var rownum = i;
                    rowy = 1;
                    break;
                }
            }
            if (rowy === 1) {
                return msg.reply("They have " + rows[i].coins + " coins.");
            } else {
                return msg.reply("They're broke, you idiot.");
            }
        }
    }
};