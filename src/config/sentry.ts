import * as Sentry from '@sentry/node';
import { envSentry } from './environment';
Sentry.init({ dsn: envSentry.dsn });

export default Sentry;
