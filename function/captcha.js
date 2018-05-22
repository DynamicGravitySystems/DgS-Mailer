const https = require('https');
const querystring = require('querystring');
// const endpoint = "https://www.google.com/recaptcha/api/siteverify";

const options = {
    hostname: 'www.google.com',
    port: 443,
    method: 'POST',
    path: '/recaptcha/api/siteverify',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
exports.verify = function(token, secret) {
    return new Promise((resolve, reject) => {
        secret = secret || process.env.CAPTCHA_SECRET_KEY;
        const payload = {
            secret: secret,
            response: token
        };
        const request = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let content = JSON.parse(chunk);
                if(content.success === true) return resolve(true);
                else return reject("Captcha verification failed");
            });
            res.on('error', (err) => {
                return reject(err);
            })
        });
        request.write(querystring.stringify(payload));
        request.end();
    })
};
