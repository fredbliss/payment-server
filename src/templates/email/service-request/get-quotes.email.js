import layout from '../layout';
import * as _ from 'lodash';

export const getQuotes = (user, body) => ({
  confirmation: {
    subject: 'Thanks for your Inquiry!',
    html: confirmation(user, body),
  },
  request: {
    subject: '[Service Request] GET QUOTES',
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
    <h1>GET QUOTES</h1>
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

    <h2>Car Info:</h2>

    ${ body.car.image ? `<img  style='max-width: 200px' src='${body.car.image}' />` : '' }

    <ul>
      ${info('Description', body.car.description)}
      ${info('Year', body.car.year)}
      ${info('Make', body.car.make)}
      ${info('Model', body.car.model)}
      ${info('Estimated Value', body.car.estimatedValue)}
      ${info('Photo credits', body.car.photoCredits)}
    </ul>

    <h2>Items Selected:</h2>

    <ul>
      ${_.map(body.options, option).join('')}
    </ul>
  </div>
`);

const info = (label, value) => {
  return value ? `<li>${label}: ${value}</li>` : '';
};

const option = (value, option) => {
  return option === 'Other' ? `<li>${option}: ${value}</li>`
                            : `<li>${option}</li>`;
};
