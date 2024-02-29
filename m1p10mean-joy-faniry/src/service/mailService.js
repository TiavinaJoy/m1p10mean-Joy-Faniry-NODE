const { mongoose } = require("../configuration/database");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const { timezoneDateTime } = require("../helper/DateHelper");
const rendezVous = require("../model/rendezVous");

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
        <p>L'équipe de <strong>m1p11Mean-Joy-Faniry</strong> </p>
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

htmOffre = (prenom, nomOffre, debutOffre, finOffre, prixOffre) => `
    
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
<table style="width: 100%;">
    <tr style="background-color: #ffd54f; color: #333333; text-align: center;">
        <td colspan="2" style="padding: 20px;">
            <h1>Bonjour cher(e) `+ prenom +`,</h1>
            <p>Ne manquez pas notre dernière offre spéciale!</p>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="padding: 20px;">
            <h2 style="color: #ff5722;">Voici ce qui vous attend:</h2>
            <h2 style="color: #ff5722;">`+nomOffre+`</h2>
            <p>Seulement à `+ prixOffre +` Ariary !!!</p>
            <p>Valable du `+debutOffre+` au `+finOffre+`.</p>
            <p>C'est l'occasion parfaite de faire des économies sur votre service préféré!</p>
            <p>Dépêchez-vous, l'offre est limité!</p>
        </td>
    </tr>
    <tr style="background-color: #ffd54f; color: #333333; text-align: center;">
        <td colspan="2" style="padding: 20px;">
            <p>Restez informé(e)!</p>
        </td>
    </tr>
</table>
</div>
`

htmRdv = (prenom, daty, service) => `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
<div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #007bff;">Notification de rendez-vous</h1>
    <p>Bonjour `+prenom+`,</p>
    <p>Nous vous rappelons que vous avez un rendez-vous (`+service+`) prévu pour `+daty+`.</p>
    <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
    <p>Cordialement,<br>L'équipe de M1P11mean-Joy-Faniry</p>
</div>
</div>
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
// Type info {
    //    mail, 
    //    prenom, 
    //    montant?,
    //    datePaiement?, 
// }
async function sendMailToClient(info, type) {
    var subject = "";
    var htm = "";
    if(type === "Inscription") {
        subject = "Compte créé ✔";
        htm =  htmInscription(info.prenom);
    }
    if(type === "Paiement") {
        subject = "Paiement réussi";
        htm =htmPaiement(info.prenom, info.montant, info.datePaiement);
    }
    if(type === "Offre") {
        subject = "Nouvelle Offre";
        htm = htmOffre(info.prenom, info.nomOffre, info.debutOffre, info.finOffre, info.prixOffre);
    }
    if(type === "Rappel") {
        subject = "Rappel de rendez-vous";
    }
    const email = await transporter.sendMail({
        from: '"m1p11Mean-Joy-Faniry👻<noreply>" <noreply@gmail.com>', // sender address
        // to: ["joytiavina@gmail.com"], // list of receivers
        to: info.mail, // list of receivers
        subject: subject,
        // text: "Hello world?", // plain text body
        html: htmRdv(info.prenom, info.daty, info.service)
    });

    console.log("Message sent: %s", email.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

async function chercheRdv(){
    try {
        const today = new Date(Date.now());
        const dateFin =  new Date(today.getTime() + 15 * 60000);
        console.log(today,"....", dateFin);
        const rdvs = await rendezVous.find({
            dateRendezVous: {
                $gte: today.toISOString(), // Rendez-vous après la date et l'heure actuelles
                $lte: dateFin.toISOString() // Rendez-vous avant 30 minutes à partir de maintenant
            },
            "statut._id": new ObjectId('65d515a1dd12de809a87a47a')
        }).select('dateRendezVous client.mail client.nom service.nom').lean();
        console.log(rdvs);
        const promises = rdvs.map(async rdv => {
            console.log({
                prenom: rdv.client.prenom,
                mail: rdv.client.mail,
                nom: rdv.client.nom,
                service: rdv.service.nom,
                daty: rdv.dateRendezVous
            });
            await sendMailToClient({
                prenom: rdv.client.prenom,
                mail: rdv.client.mail,
                nom: rdv.client.nom,
                service: rdv.service.nom,
                daty: rdv.dateRendezVous
            }, "Rappel");
        });
        
        await Promise.all(promises); // Attendre l'exécution de toutes les promesses
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}
module.exports ={
    sendMailToClient, chercheRdv
}
// main().catch(console.error);