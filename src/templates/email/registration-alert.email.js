import layout from './layout';

export default (user) => layout(`
  <h1>New Registration</h1>

  ${ user.avatar ? `<img style='max-width: 200px' src='${user.avatar}' />` : '' }

  <ul>
    ${info('UID', user.uid)}
    ${info('Email', user.email)}
    ${info('Name', user.name)}
    ${info('Zip Code', user.postal)}
    ${info('State', user.State)}
    ${info('Country', user.country)}
    ${info('Tier', user.tier)}
    ${info('Stripe Customer Id', user.stripeCustomerId)}
    ${info('Providers', user.providers)}
    ${info('Active', user.active ? 'Yes' : 'No')}
  </ul>

  <h2>Owned Cars</h2>

  ${carsInfo(user.ownedCars)}

  <h2>Watched Cars</h2>

  ${carsInfo(user.watchedCars)}
`);

const info = (label, value) => {
  return value ? `<li>${label}: ${value}</li>` : '';
};

const carsInfo = (cars) => cars.map(car => carInfo(car)).join('');

const carInfo = (car) => `
  ${ car.image ? `<img  style='max-width: 200px' src='${car.image}' />` : '' }
  <ul>
    ${info('Description', car.description)}
    ${info('Year', car.year)}
    ${info('Make', car.make)}
    ${info('Model', car.model)}
    ${info('Estimated Value', car.estimatedValue)}
    ${info('Photo credits', car.photoCredits)}
  </ul>
`;
