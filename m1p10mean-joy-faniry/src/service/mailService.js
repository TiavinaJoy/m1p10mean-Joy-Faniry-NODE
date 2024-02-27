const nodemailer = require("nodemailer");
require("dotenv").config();

const htmInscription = (prenom) =>`
<table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
<tr>
    <td style="background-color: #009688; text-align: center; padding: 10px;">
        <h2 style="color: #ffffff;">Confirmation de création de compte</h2>
    </td>
</tr>
<tr>
    <td style="padding: 20px;">
        <p>Bonjour `+ prenom + `, </p>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter en utilisant les identifiants que vous avez fournis lors de l'inscription.</p>
        <p>Si vous n'avez pas créé de compte, veuillez ignorer ce message.</p>
        <p>Merci,</p>
        <p>L'équipe de <strong>M1P10Mean-Joy-Faniry</strong> </p>
    </td>
</tr>
</table>
`
const htmPaiement = (prenom, montant, datePaiement) =>`
<table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
<tr>
    <td style="background-color: #4CAF50; text-align: center; padding: 10px;">
        <h2 style="color: #ffffff;">Confirmation de Paiement</h2>
    </td>
</tr>
<tr>
    <td style="padding: 20px;">
        <p>Bonjour `+prenom+`,</p>
        <p>Nous tenons à vous informer que votre paiement a été reçu avec succès.</p>
        <p>Détails du paiement :</p>
        <ul>
            <li>Montant : `+ montant +`</li>
            <li>Date : `+ datePaiement +`</li>
        </ul>
        <p>Si vous avez des questions concernant ce paiement ou si vous remarquez une erreur, n'hésitez pas à nous contacter.</p>
        <p>Merci de votre confiance.</p>
        <p>L'équipe de [Votre entreprise]</p>
    </td>
</tr>
</table>
`
const transporter = nodemailer.createTransport({
    // service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        // user: process.env.mailUser,
        // pass: process.env.mailMDP,
        user: 'joyrajaofetra@gmail.com',
        pass: 'wssj rxkr pteu joof',
    },
});

// async..await is not allowed in global scope, must use a wrapper

// 
// Type infoClient {
    //    mail, 
    //    prenom, 
    //    montant?,
    //    datePaiement?, 
// }
async function sendMailToClient(infoClient, type) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"M1P10Mean-Joy-Faniry👻<noreply>" <noreply@gmail.com>', // sender address
        // to: ["joytiavina@gmail.com"], // list of receivers
        to: infoClient.mail, // list of receivers
        subject: type === 'Inscription' ? "Compte créé ✔" : "Paiement réussi", // Subject line
        // text: "Hello world?", // plain text body
        html: type === 'Inscription' ? htmInscription(infoClient.prenom) : htmPaiement(infoClient.prenom, infoClient.montant, infoClient.datePaiement), // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

module.exports ={
    sendMailToClient
}
// main().catch(console.error);