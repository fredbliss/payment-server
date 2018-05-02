import layout from '../layout';

export const serviceRequest = (user, body) => ({
  confirmation: {
    subject: 'Thanks for your Inquiry!',
    html: confirmation(user, body),
  },
  request: {
    subject: '[Service Request] SERVICE REQUEST',
    html: request(user, body),
  },
});


const confirmation = (user, _body) => layout(`
  <div style="padding: 15px">
    <p>Hello ${user.firstName},</p>

    <p>thank you for your inquiry.</p>

    <p>We have received your service request and will reply as soon as possible.</p>
  </div>
`);

const request = (user, body) => layout(`
  <div style="padding: 15px">
    <h1>SERVICE REQUEST</h1>
    <h2>Service Request</h2>

    <h2>User info:</h2>

    ${ user.avatar ? `<img style='max-width: 200px' src='${user.avatar}' />` : '' }

    <ul>
      ${info('Name', user.name)}
      ${info('Email', user.email)}
      ${info('Country', user.country)}
      ${info('State', user.state)}
      ${info('Postal', user.postal)}
    </ul>

    <h2>Content: </h2>

    <p><b>Subject: ${body.subject}</b></p>

    ${body.text.replace(/\r?\n/g, '<br />')}
  </div>
`);

const info = (label, value) => {
  return value ? `<li>${label}: ${value}</li>` : '';
};
