const db = require('quick.db');
const phin = require('phin');

module.exports = (username) => new Promise(async (resolve, reject) => {
    username = username.toLowerCase();

    if (username.length === 32) {
        resolve(username.substr(0, 8) + "-" + username.substr(8, 4) + "-" + username.substr(12, 4) + "-" + username.substr(16, 4) + "-" + username.substr(20));
    }
    else if (username.length === 36) {
        resolve(username);
    }

    let type;

    if (!db.get(username))
        type = "new";
    else if ((1000 * 60 * 60 * 24 * 37) + db.get(`${username}.time`) < Date.now())
        type = "new";
    else type = "cache";

    if (type === "new") {
        const Request = await phin({
            url: "https://api.ashcon.app/mojang/v2/user/" + username,
            parse: 'json'
        })
        .catch(() => {
            if (db.get(username)) {
                return resolve(db.get(`${username}.uuid`));
            }
            else {
                return reject('Could not find any cache or that player.');
            }
        });
        if (!Request.body.uuid) {
            return reject("That player might not exist.");
        }
        db.set(username, { uuid: Request.body.uuid, time: Date.now()})
        return resolve(Request.body.uuid);
    }
    else if (type === "cache") {
        db.set(username, { uuid: db.get(`${username}.uuid`), time: Date.now()})
        return resolve(db.get(`${username}.uuid`));
    }

});