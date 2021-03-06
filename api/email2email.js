// Email to Email
const util = require('util');
const multer = require('multer');
const addrs = require("email-addresses");
const sgMail = require('@sendgrid/mail');
const sgParser = require('@sendgrid/inbound-mail-parser');

module.exports = async (req, res) => { 
    await util.promisify(multer().any())(req, res);

    const from = req.body.from;
    const subject = req.body.subject;
    const body = req.body.text;
    const html = req.body.html;

    console.log(req.body);

    // Strip for email 
    const fromAddress = addrs.parseOneAddress(from);

    // SendGrid API
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Create Email
    const email = {
        to: process.env.TO_EMAIL_ADDRESS,
        from: process.env.FROM_EMAIL_ADDRESS,
        subject: `[`+ fromAddress + `] ${subject}`,
        text: `${body}`,
        html: `${html}`,
        attachments: sgParser.attachments()
    };

    //Send Email
    sgResp = sgMail.send(email)
        .then(response => {
            res.status(200).send(`Sent Email`);
        })
        .catch(error => {
            res.status(500);
        });
    // res.status(200).send(`Sent Email`);
};