import request from 'supertest';
import server from '../../../../../server';

const randomId = () => Math.floor(Math.random() * 10000);

const user = {
  uid: 'UID-USER-UUUU',
  email: `api-test-${randomId()}@service-request.com`,
  firstName: 'John',
  lastName: 'Snow',
  password: '123456',
  tier: 'PREMIUM',
  avatar: 'avatarUrl',
  username: 'johnsnow'
};

const car = {
  uid: 'UID-CAR-CCCC',
  make: 'Porsche',
  year: '1987',
  model: '911',
};

describe('ServiceRequest GET_QUOTES @fast', () => {
  const options = {
    'Insurance': true,
    'Other': 'Only the small parts',
  };

  it('sends successfully', (done) => {
    request(server)
      .post('/api/v1/service-request')
      .send({ user, body: { car, options }, template: 'GET_QUOTES' })
      .expect(200, done);
  });
});

describe('ServiceRequest HELP_BUYING_CAR @fast', () => {
  const selected = '< 90 Days';

  it('sends successfully', (done) => {
    request(server)
      .post('/api/v1/service-request')
      .send({ user, body: { car, selected }, template: 'HELP_BUYING_CAR' })
      .expect(200, done);
  });
});

describe('ServiceRequest HELP_SELLING_CAR @fast', () => {
  const selected = '< 90 Days';

  it('sends successfully', (done) => {
    request(server)
      .post('/api/v1/service-request')
      .send({ user, body: { car, selected }, template: 'HELP_SELLING_CAR' })
      .expect(200, done);
  });
});

describe('ServiceRequest TALK_TO_EXPERT @fast', () => {
  const text = 'Please help me';

  it('sends successfully', (done) => {
    request(server)
      .post('/api/v1/service-request')
      .send({ user, body: { car, text }, template: 'TALK_TO_EXPERT' })
      .expect(200, done);
  });
});

describe('ServiceRequest SERVICE_REQUEST @fast', () => {
  const subject = 'Please help me';
  const text = 'This is a text';

  it('sends successfully', (done) => {
    request(server)
      .post('/api/v1/service-request')
      .send({ user, body: { subject, text}, template: 'SERVICE_REQUEST' })
      .expect(200, done);
  });
});
