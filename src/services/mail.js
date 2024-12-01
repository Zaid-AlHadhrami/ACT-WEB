import axios from 'axios';

export function sendMail(mail, name){ 

  
    var temporaryPassword = '1231234';

    var mailData = {
    recipient: mail,
    name: name,
    subject: 'welcome',
    message: `
    Your Account Details:
    - Username: ${mail}
    - Temporary Password: ${temporaryPassword}
    `

  }
  axios.post('https://actweb-7fe7b7402375.herokuapp.com/send-mail', mailData)
    .then(response => {
      alert('Email sent successfully!');
      console.log(response);
    })
    .catch(error => {
      console.error('There was an error sending the email: ', error);
      alert('Failed to send email.');
    });

    }

