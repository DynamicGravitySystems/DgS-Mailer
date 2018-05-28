const captcha = require('./captcha');
const sns = require('./sns');
const sns_topic = process.env.AWS_SNS_TOPIC;
const CAPTCHA_ENABLED = process.env.CAPTCHA_ENABLED || false;

exports.execute = async (topic, body, captcha_secret) => {
    if(CAPTCHA_ENABLED){
        await captcha.verify(body.captcha, captcha_secret);
    } else {
        console.info("Skipping CAPTCHA Verification");
    }

    let subject = body.subject;
    let message = `Message from: ${body.name}  (${body.from})@${body.organization}\n\n`;
    message += `Telephone#: ${body.tel}\n\n`;
    message += `Message: \n${body.message}\n\nSent via DgS Public Web-Form`;
    try {
        await sns.publish(topic, subject, message);
        return true;
    } catch (e) {
        throw e;
    }
};

const headers = {
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN
};

exports.handler = async (event) => {
    let source = event['requestContext']['identity']['sourceIp'];
    console.log(`Received integration request from IP: ${source}`);
    try{
        let body;
        if (event.body !== null && event.body !== undefined) {
            body = JSON.parse(event.body);
            await this.execute(sns_topic, body);
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({result: "success"})
            }
        } else {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({result: "failure", message: "Event body is null or undefined."})
            }
        }
    } catch (e) {
        console.error("Error encountered: " + e);
        let res = {
            result: "failure"
        };
        if (e.name === 'CaptchaError'){
            res.reason = e.message;
        }
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify(res)
        }
    }
};
