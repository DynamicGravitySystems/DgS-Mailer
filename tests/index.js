const assert = require('assert');
const app = require('../src/index');
const captcha = require('../src/captcha');

// See: https://developers.google.com/recaptcha/docs/faq  (Question 2)
const captcha_dev_secret = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
const topic = process.env.AWS_SNS_TEST;
const awsid = process.env.AWS_ACC_ID;


// Note SNS integration test functions are dependent on valid AWS credentials and an available SNS topic
describe('index', function () {
    const event = {
        name: 'Test Person',
        from: 'test@test.com',
        subject: 'Test Subject',
        message: 'Body of the test message'
    };
    it('Should fail to send a message when the captcha does not verify', async function(){
        try{
            await app.execute(topic, event, 'invalidsecret');
        } catch (e) {
            assert.equal(e.name, 'CaptchaError');
            return
        }
        assert.fail("Did not produce expected error");
    });
    it('Should throw an error if the SNS topic parameter is invalid', async function(){
        try {
            await app.execute(`arn:aws:sns:us-west-2:${awsid}:fake-topic`, event, captcha_dev_secret);
        } catch (e) {
            assert.equal(e.name, 'SNSError');
            return
        }
        assert.fail("Did not produce expected error");
    })
});

describe('captcha', function () {
    describe('#verify()', function() {
        it('Verification should succeed using the dev (test) secret', async function() {
            let res = await captcha.verify('mytoken', captcha_dev_secret);
            assert.ok(res, "Captcha verification should return true");
        });
        it('Verification should fail given an invalid secret', async function() {
            try {
                await captcha.verify('mytoken', 'invalidsecret');
            } catch (e) {
                console.log(e);
                return
            }
            assert.fail("Captcha verify did not fail as expected.");
        })
    })
});
