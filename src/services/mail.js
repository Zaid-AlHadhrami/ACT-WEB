import axios from 'axios';

export function sendMail(mailData){ 



  axios.post('http://localhost:5005/send-mail', mailData)
    .then(response => {
      alert('Email sent successfully!');
      console.log(response);
    })
    .catch(error => {
      console.error('There was an error sending the email: ', error);
      alert('Failed to send email.');
    });

    }

