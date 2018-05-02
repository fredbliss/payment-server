import { getQuotes } from './get-quotes.email';
import { helpBuyingCar } from './help-buying-car.email';
import { helpSellingCar } from './help-selling-car.email';
import { talkToExpert } from './talk-to-expert.email';
import { serviceRequest } from './service-request.email';

export default {
  'GET_QUOTES': getQuotes,
  'HELP_BUYING_CAR': helpBuyingCar,
  'HELP_SELLING_CAR': helpSellingCar,
  'TALK_TO_EXPERT': talkToExpert,
  'SERVICE_REQUEST': serviceRequest,
};
