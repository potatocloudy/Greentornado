const Nodesu = require('nodesu');
const fs = require('fs');
const Canvas = require('canvas');
const api = new Nodesu.Client(process.env.osu, {
    parseData: true
 });

// ... see docs/Modules:Components - typical usage = api.<component>.<function>();
// most functions return Promise objects.
async function main(){
// eg: get beatmap data
const user = await api.user.get('aagaming')
console.log(user);
const canvas = Canvas.createCanvas(960, 540);
const ctx = canvas.getContext('2d');

// Since the image takes time to load, you should await it
const background = await Canvas.loadImage('./osu.png');
// This uses the canvas dimensions to stretch the image onto the entire canvas
ctx.drawImage(background, 0, 0, background.width, background.height);
ctx.strokeStyle = "rgb(255, 0, 0)";
ctx.fillStyle = "rgba(255, 255, 0, .5)";

// Select the font size and type from one of the natively available fonts
ctx.font = '40px sans-serif';
// Select the style that will be used to fill the text in
ctx.fillStyle = '#ffffff';
// Actually fill the text with a solid color
ctx.textAlign = "left"; 
ctx.fillText(`${user.username}`, canvas.width / 5, canvas.height / 6);
const flag = await Canvas.loadImage(`https://osu.ppy.sh/images/flags/${user.country}.png`)
ctx.drawImage(flag, canvas.width / 5, canvas.height / 5, flag.width, flag.height);
ctx.textAlign = "right"; 
ctx.fillText(`Rank: ${user.ppRank}`, canvas.width / 1.1, canvas.height / 6);
ctx.fillText(`pp: ${Math.round(user.ppRaw)}`, canvas.width / 1.1, canvas.height / 4);
ctx.textAlign = "center"; 
ctx.fillText(`${Math.round(user.level)}`, canvas.width / 1.155, canvas.height / 2.222);
const lvl = await Canvas.loadImage("./Artboard 1.png")
ctx.drawImage(lvl, canvas.width / 1.22, canvas.height / 3, lvl.width, lvl.height);
// // Pick up the pen
// ctx.beginPath();
// // Start the arc to form a circle
// ctx.arc(canvas.width / 2.04, canvas.height / 2.8, 70, 0, Math.PI * 2, true);
// // Put the pen down
// ctx.closePath();
// // Clip off the region you drew on
// ctx.clip();
let avatar;
try { avatar = await Canvas.loadImage(`https://a.ppy.sh/${user.id}?${Date.now()}`)} catch(e) { avatar = await Canvas.loadImage(`https://a.ppy.sh/?${Date.now()}`)};
ctx.drawImage(avatar, canvas.width / 50, canvas.height / 15, 150, 150);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./test.png', buffer);
}
main()