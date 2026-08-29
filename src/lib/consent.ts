/**
 * Single source of truth for SMS consent copy.
 *
 * The quote form renders these strings and the API stores the exact wording that
 * was on screen when the box was ticked. Keeping one copy means the evidence we
 * retain can never drift from what the customer actually agreed to.
 *
 * If you change any wording below, bump CONSENT_VERSION. Existing records keep
 * their old version so you can always tell which language a given contact saw.
 */

export const CONSENT_VERSION = '2026-08-09';

export const TRANSACTIONAL_CONSENT_TEXT =
  'By checking this box, I consent to receive transactional messages from Cleaning By Kandi at the phone ' +
  'number provided above, related to my quote request, appointment, or services I have requested. These ' +
  'messages may include appointment reminders, scheduling confirmations, and service updates among others. ' +
  'Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.';

export const MARKETING_CONSENT_TEXT =
  'By checking this box, I consent to receive marketing and promotional messages from Cleaning By Kandi at ' +
  'the phone number provided above, including special offers, discounts, and service updates among others. ' +
  'Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.';
