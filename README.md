# Slackbot Project

## Features
### Commands
* `vuln "arg"` : Descibes common vulnerability/ exposure and (if relevent) vulnerable products based on code
* `netsec "arg"` : Returns top (at most) three recent, relevent posts from reddit/r/netsec based on argument provided
* `aws` : Returns 10 most recent events on AWS System along with time, user, ip etc.

### Vulnerability lookup based on CVE Codes
* Quick lookup for CVE
* CVE _only for 2017_, data obtained from CVE-2017 JSON Feed
* Argument should be cve ID of the form: `CVE-2017-xxxxx`
* __Justification:__ Common Vulnerabilities and Exposures act as the standard for vulnerabilities. As a result, those working in security should constantly interact with CVEs. Having a quick-lookup feature built into their primary communication app should prove to be helpful.

### Quicksearch /r/NetSec
* Accessible search for security related articles posted onto reddit's NetSec subreddit
* Results are filtered such that no flagged (eg. Monthly discussion thread), nsfw or non-NetSec posts are returned
* Argument should be a singl word, or a collection of terms stringed `such as this`
* __Justification__: Staying up to date on relevant events is a key to the security industry. /r/NetSec is a great source of obtaining a variety information. Therefore, when something new pops up (eg. Bad Rabbit, Reaper), one could query the bot to quickly get any relevant articles that are posted onto /r/NetSec.

### Amazon Web Services status ping
* Use Amazon's Cloudtrail to be able to get a feed of the 10 most recent events occurring in one's AWS system.
* _This depends on providing AWS credentials (ie. AccessKeyID, SecretAccessKey)_
* Created an IAM user role specifically for bot for security precautions:
    * User role has _read only_ access for CloudWatch and CloudTrail
    * By minimizing the rights that the slackbot has minimizes the risk that the slackbot could be leveraged as an attack vector
* __Justification__: Cloud systems must be constantly monitored to ensure security. By having a method to ping an AWS system through Slack encourages constant checkups while also providing a quick to check AWS after a suspected incident.

## Build

* Stack
    * Built using a NodeJS server with the BotKit module
    * Leverages the Real Time Messaging API
    * Currently living in a micro EC2 instance on Amazon Web Services
* How to use
    * Two configuration files: configsvars.js, aws_config.json
    * configsvars.js stores api key for slack
    * aws_config.json stores secret-id, secret-key and region (Only necessary for AWS Status ping)
    * After keys are inputted, run server with `node server.js`
* Stack Justification
    * NodeJS allows for easy way to spin up a server, useful, accessible modules
    * Already had a simple boilerplate for NodeJS webapp
    * Botkit provides a simple way to create listeners for my Slackbot
    * I have previous experience with Amazon Web Services, so this the RTM API is not only more familiar to implement for my, but also allowed me to showcase my experience with AWS
* Improvements that could be made

