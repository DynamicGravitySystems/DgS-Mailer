DgS-Mailer
==========

DgS-Mailer is a simple NodeJS module designed to be executed as an AWS Lambda function, which handles a form-based
email submission from our public website, and publishes it to an AWS SNS Topic - which is then delivered to all subscribers.

The function verifies that a valid ReCaptcha challenge response has been provided before formatting and publishing incoming messages.


Installation
------------

To install for local development run:
.. code:: bash
    npm install

Run package unit tests:
.. code:: bash
    npm run test

Run SNS integration tests:
.. code:: bash
    npm run integration

Note: Valid AWS credentials and an SNS Topic ARN must be configured for the SNS integration test functions.
Specify the Topic ARN with the environment variable: AWS_SNS_TEST
