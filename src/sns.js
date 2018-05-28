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
            if (err){
                let message ;
                if (err.code === 'NotFound'){
                    message = "Specified SNS Topic does not exist"
                } else if (err.code === 'InvalidClientTokenId'){
                    message = "Specified AWS Account ID is Invalid"
                } else {
                    message = "Unhandled SNS error";
                }
                return reject({
                    name: "SNSError",
                    message: message
                });
            }
            else return resolve(data);
        })
    })
};
