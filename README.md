# Slackbot Project

## Build

* Stack
    * Built using a NodeJS server with the BotKit module
    * Leverages the Real Time Messaging API
    * Currently living in a micro EC2 instance on Amazon Web Services
* How to use
    * Two configuration files: configsvars.js, aws_config.json
    * configsvars.js stores api key for slack
    * aws_config.json stores secret-id, secret-key and region
    * After keys are inputted, run server with `node server.js`

## Features

### Vulnerability lookup based on CVE Codes

### Quicksearch /r/NetSec

### Amazon Web Services status ping

## Decisions

### Improvements that could be made

