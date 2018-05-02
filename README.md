# Blockchaser Payment Server

Server that interfaces with Stripe subscriptions.

## Config

Add Stripe settings in .env (see .env.example) in development or in environment variables in production/staging

```
 $ cp .env.example .env
```

## Run in development

```
$ npm start
```

Server listen at http://localhost:3001

## Public API

#### POST /api/v1/registrations/free

* Creates a new free tier user

USER attributes:

|  Attribute     | Type         | Required | Constraints         |
|----------------|--------------|----------|---------------------|
| email          | String       | true     | Valid email         |
| password       | String       | true     | Min length: 6       |
| firstName      | String       | true     |                     |
| tier           | String       | true     | 'FREE' or 'PREMIUM' |
| lastName       | String       |          |                     |
| username       | String       |          |                     |
| avatar         | String (url) |          |                     |
| ownedCars      | Array (Cars) |          |                     |
| watchedCars    | Array (Cars) |          |                     |

CAR attributes:

|  Attribute   | Type       | Required |
|--------------|------------|----------|
| description  | String     |          |
| year         | String     | true     |
| make         | String     | true     |
| model        | String     | true     |
| photoCredits | String     |          |
| image        | String     |          |


CARD attributes:

* IMPORTANT: Card must be present when user tier is `PREMIUM` and it must be absent when user tier is `FREE`

|  Attribute   | Type       | Required |
|--------------|------------|----------|
| number       | String     | true     |
| expMonth     | String     | true     |
| expYear      | String     | true     |
| cvc          | String     | true     |

COUPON:

|  Attribute   | Type       | Required |
|--------------|------------|----------|
| couponId     | String     |          |


Example JSON request:

```JSON
{
  "user": {
    "email": "user@mail.com",
    "password": "123456secret",
    "firstName": "John",
    "tier": "PREMIUM",
    "ownedCars": [
      {
        "year": "1987",
        "make": "PORSCHE",
        "model": "911"
      }
    ],
    "watchedCars": [
      {
        "year": "1960",
        "make": "PORSCHE",
        "model": "912"
      }
    ]
  },
  "card": {
    "number": "4242424242424242",
    "expMonth": "10",
    "expYear": "20",
    "cvc": "123"
  },
  "coupon": "50_OFF"
}
```

Response example

```
{
  "status": "SUCCESS",
  "user": {
    "uid": "TpgH3q0RheS5jvuvwoanQN1Y8Sq2",
    "firstName": "John",
    "email": "user@mail.com",
    "active": true,
    "tier": "PREMIUM",
    "stripeCustomerId": "cus_9uE9KUA1FphrLM",
    "ownedCars": [
      {
        "uid": "e40a76b5-0047-4088-a038-a959ea26d76f",
        "year": "1987",
        "make": "PORSCHE",
        "model": "911"
      }
    ],
    "watchedCars": [
      {
        "uid": "c592c8f3-7885-4476-a0fc-30ada09b4e45",
        "year": "1960",
        "make": "PORSCHE",
        "model": "912"
      }
    ]
  }
}
```

Example ERROR response

```JSON
// Email already exists:

{
  "status": "ERROR",
  "code": "auth/email-already-exists",
  "message": "The email address is already in use by another account."
}

// User invalid:

{
  "status": "ERROR",
  "code": "auth/user-invalid",
  "message": "User is invalid",
  "errors": [
    {
      "field": "email",
      "message": "Email should not be blank"
    },
    {
      "field": "firstName",
      "message": "First Name should not be blank"
    },
    {
      "ownedCars": [
        {
          "field": "year",
          "message": "Year should not be blank"
        }
      ]
    },
    {
      "watchedCars": [
        {
          "field": "make",
          "message": "Make should not be blank"
        }
      ]
    },
    {
      "field": "password",
      "message": "Password should contain at least 6 characters"
    }
  ]
}
```

## Deployment

### Heroku

To deploy the app to Heroku do the following:

1. Install heroku command line
2. Clone the app `git clone https://github.com/blockchaserinc/payment-server`
3. Create new Heroku app `heroku app:create <app-name>`
4. Add heroku remote `git remote add heroku <heroku-remote-url>`
5. Push app using `git push heroku master`

### Stripe

To configure the Stripe integration:

1. Create Stripe account and log into it ([https://dashboard.stripe.com](https://dashboard.stripe.com))
2. Create a new subscription plan (Go to menu Subscriptions)
3. Get API keys (Go to Account Settings > API Keys > Test/Live Secret Key)
4. On the application folder, run the following using the command line:

```
  heroku config:set \
    STRIPE_PLAN_ID=<subscription id on Stripe> \
    STRIPE_PRIVATE_KEY=<secret key from Stripe>
```

### Mailchimp

To configure Mailchimp integration:

1. Get the API key from Mailchimp
2. Get the list ID which new users will automatically be subscribed
3. On the application folder, run the following using the command line:

```
  heroku config:set \
    MAILCHIMP_API_KEY=<api key from Mailchimp> \
    MAILCHIMP_LIST_ID=<list ID from Mailchimp>
```

### Mailgun

To configure Mailgun integration:

1. Get the API key from Mailgun
2. Get the Mailgun domain
3. On the application folder, run the following using the command line:

```
  heroku config:set \
    MAILGUN_API_KEY=<api key from Mailgun> \
    MAILGUN_DOMAIN=<domain from Mailgun>
```

### Firebase

To configure Firebase:

1. Get the API key from Mailgun
2. Get the Mailgun domain
3. On the application folder, run the following using the command line:

```
  heroku config:set \
    FIREBASE_PROJECT_ID=<project ID> \
    FIREBASE_DATABASE_URL=<database URL> \
    FIREBASE_CLIENT_EMAIL=<client email>
```

* Firebase private key must be uploaded manually

- 1. Save the private key in a file (e.g. `private-key.pem`)
- 2. Run the code below:

```
  heroku config:set FIREBASE_PRIVATE_KEY="$(cat ./private-key.pem)"
```