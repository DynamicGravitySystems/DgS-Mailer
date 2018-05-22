const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: "2010-03-31", region: "us-west-2"});

exports.publish = function(topic, subject, message) {
    const params = {
        Subject: subject,
        Message: message,
        TopicArn: topic
    };
    return new Promise((resolve, reject) => {
        sns.publish(params, (err, data) => {
            if (err) return reject(err);
            else return resolve(data);
        })
    })
};
