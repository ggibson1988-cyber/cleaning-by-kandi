// tests/form.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RequestQuote from '../src/pages/RequestQuote';

// Note on corrections to the brief's guessed selectors (verified against the
// real src/pages/RequestQuote.tsx markup):
// - The step-advance button's accessible name is "Next Step", not "Next" —
//   the brief's exact-match /^next$/i never matches, so this uses /next step/i.
// - "How Often?" (frequency) is a row of toggle buttons, not a <select>, so
//   frequency is chosen via a button click ("Weekly") rather than
//   selectOptions/getByLabelText (there's no form control with id="frequency"
//   for getByLabelText to resolve to).
// - "City" is a <select id="city">, not a text <input>, so it's set with
//   selectOptions rather than user.type().
async function fillThroughStep3(user: ReturnType<typeof userEvent.setup>) {
  // Step 1: pick a service
  await user.click(screen.getByRole('button', { name: /residential cleaning/i }));
  await user.click(screen.getByRole('button', { name: /next step/i }));
  // Steps are swapped by framer-motion's AnimatePresence (mode="wait"), whose
  // exit/enter transition is async even under jsdom's rAF polyfill — the new
  // step's fields aren't in the DOM the instant the Next click's promise
  // resolves, so each step transition below is followed by a waitFor on that
  // step's first field before interacting with it.
  await waitFor(() => expect(screen.getByLabelText(/bedrooms/i)).toBeInTheDocument());
  // Step 2: home details
  await user.selectOptions(screen.getByLabelText(/bedrooms/i), '3');
  await user.selectOptions(screen.getByLabelText(/bathrooms/i), '2');
  await user.type(screen.getByLabelText(/square footage/i), '1800');
  await user.click(screen.getByRole('button', { name: 'Weekly' }));
  await user.click(screen.getByRole('button', { name: /next step/i }));
  await waitFor(() => expect(screen.getByLabelText(/first name/i)).toBeInTheDocument());
  // Step 3: contact
  await user.type(screen.getByLabelText(/first name/i), 'Jane');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/^email/i), 'jane@example.com');
  // Not just /phone/i: the SMS consent checkboxes' label copy also contains
  // "phone number" ("...at the phone number provided above..."), so a loose
  // /phone/i regex matches 3 elements. Anchor to the field label's own text.
  await user.type(screen.getByLabelText(/^phone number/i), '4805551234');
  await user.selectOptions(screen.getByLabelText(/^city/i), 'Surprise');
}

describe('RequestQuote form', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps Next disabled until a service is selected on step 1', () => {
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /next step/i })).toBeDisabled();
  });

  it('shows a success state only after a real 2xx response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    // Both the success h1 ("Quote Request Received!") and the body copy
    // ("Thank you, Jane! We'll follow up...") match this regex, so
    // getByText would throw on multiple matches — assert on the heading,
    // which uniquely identifies the success state.
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: /request received/i })).toBeInTheDocument()
    );
  });

  it('shows a retryable error on a non-2xx response, no success state', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'boom' }), { status: 500 }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(screen.getByText(/try again|call us/i)).toBeInTheDocument());
    expect(screen.queryByText(/thank you|request received/i)).not.toBeInTheDocument();
  });

  it('shows a retryable error on a network failure', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(screen.getByText(/network|try again|call us/i)).toBeInTheDocument());
  });

  it('sends the consent-capture contract fields in the request body', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [, requestInit] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(requestInit.body as string);

    // consentVersion: present and non-empty, but not hardcoded to a specific
    // string — the actual version value is expected to change over time.
    expect(typeof body.consentVersion).toBe('string');
    expect(body.consentVersion.length).toBeGreaterThan(0);

    // consentTimestamp: real ISO-8601 shape.
    expect(new Date(body.consentTimestamp).toISOString()).toBe(body.consentTimestamp);

    // fillThroughStep3 never interacts with the SMS consent checkboxes, so
    // both consent-text fields should reflect the default unchecked state —
    // gated to empty strings, not the underlying consent copy.
    expect(body.consentTextTransactional).toBe('');
    expect(body.consentTextMarketing).toBe('');
  });

  it('disables the submit button while a submission is in flight (duplicate-submit guard)', async () => {
    let resolveFetch: (v: Response) => void = () => {};
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(new Promise((resolve) => { resolveFetch = resolve; }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    const submitBtn = screen.getByRole('button', { name: /submit quote request|sending/i });
    await user.click(submitBtn);
    expect(submitBtn).toBeDisabled();
    resolveFetch(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
