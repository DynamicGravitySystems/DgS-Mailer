const assert = require('assert');
const app = require('../function/index');
const sns = require('../function/sns');
const captcha_dev_secret = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
const topic = process.env.AWS_SNS_TEST;


describe('sns-integration', function() {
    const event = {
        name: 'Test Person',
        from: 'test@test.com',
        subject: 'Test Subject',
        message: 'Body of the test message'
    };
    it('Should publish a message to an SNS topic if captcha verification succeeds', async function(){
        let res = await app.execute(topic, event, captcha_dev_secret);
        assert.equal(res, true);
    });
    describe('sns', function() {
        describe('#publish()', function(){
            it('Should publish a message to an SNS topic', async function(){
                let rv = await sns.publish(topic, 'Test Subject', 'Test Message Body Here');
                assert.ok('ResponseMetadata' in rv);
                assert.ok('MessageId' in rv);
            })
        })
    });
});
