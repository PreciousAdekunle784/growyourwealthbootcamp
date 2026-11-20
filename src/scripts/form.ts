/**
 * Waitlist form: validation, accessible error messages and submission.
 *
 * INTEGRATION: submissions POST as JSON to `data-endpoint` (PUBLIC_WAITLIST_ENDPOINT),
 * e.g. a GoHighLevel inbound webhook. With no endpoint configured, the visitor's
 * email app opens with their details pre-filled to the support address, so the
 * form never pretends to work when it isn't connected.
 */

type FieldName = 'first_name' | 'last_name' | 'email' | 'phone' | 'consent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function phoneDigits(v: string) {
  return v.replace(/\D/g, '');
}

function validate(name: FieldName, input: HTMLInputElement): string {
  const v = input.value.trim();
  switch (name) {
    case 'first_name':
      return v ? '' : 'Please enter your first name.';
    case 'last_name':
      return v ? '' : 'Please enter your last name.';
    case 'email':
      if (!v) return 'Please enter your email address.';
      return EMAIL_RE.test(v) ? '' : 'That email doesn’t look right. Check for typos.';
    case 'phone': {
      if (!v) return 'Please enter a phone number for event reminders.';
      const d = phoneDigits(v);
      return d.length >= 10 && d.length <= 15 ? '' : 'Please enter a full phone number, including area code.';
    }
    case 'consent':
      return input.checked ? '' : 'Please tick the box to agree before joining.';
  }
}

export function initWaitlistForm(form: HTMLFormElement) {
  const endpoint = form.dataset.endpoint?.trim() ?? '';
  const fallbackEmail = form.dataset.fallbackEmail ?? '';
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const names: FieldName[] = ['first_name', 'last_name', 'email', 'phone', 'consent'];

  const field = (n: FieldName) => form.elements.namedItem(n) as HTMLInputElement;
  const errEl = (input: HTMLInputElement) =>
    document.getElementById(input.getAttribute('aria-describedby') ?? '') as HTMLElement | null;

  const show = (input: HTMLInputElement, msg: string) => {
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const e = errEl(input);
    if (e) e.textContent = msg;
  };

  // Validate on blur, then live once a field has been flagged.
  names.forEach((n) => {
    const input = field(n);
    const evt = input.type === 'checkbox' ? 'change' : 'blur';
    input.addEventListener(evt, () => show(input, validate(n, input)));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') show(input, validate(n, input));
    });
  });

  const setStatus = (msg: string, isError = false) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('is-error', isError);
  };

  const setBusy = (busy: boolean) => {
    if (!submit || !submitLabel) return;
    submit.disabled = busy;
    submitLabel.textContent = busy ? 'Adding you…' : 'Join the waitlist';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    let firstInvalid: HTMLInputElement | null = null;
    for (const n of names) {
      const input = field(n);
      const msg = validate(n, input);
      show(input, msg);
      if (msg && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) {
      setStatus('Please fix the highlighted fields.', true);
      firstInvalid.focus();
      return;
    }

    // Honeypot: silently accept and drop bot submissions.
    const hp = form.elements.namedItem('website') as HTMLInputElement | null;
    if (hp && hp.value) {
      window.location.assign('/thank-you');
      return;
    }

    const data = {
      first_name: field('first_name').value.trim(),
      last_name: field('last_name').value.trim(),
      email: field('email').value.trim(),
      phone: field('phone').value.trim(),
      consent: true,
      source: window.location.hostname || 'growyourwealthbootcamp.com',
      page: window.location.pathname,
      tags: ['GYWB - Waitlist'],
      submitted_at: new Date().toISOString(),
    };

    if (!endpoint) {
      const body = [
        'Please add me to the Grow Your Wealth Bootcamp waitlist.',
        '',
        `Name: ${data.first_name} ${data.last_name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        'I agree to receive emails, calls and texts about Grow Your Wealth Bootcamp events.',
      ].join('\n');
      const href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
        'Grow Your Wealth Bootcamp waitlist',
      )}&body=${encodeURIComponent(body)}`;
      setStatus('Your email app is opening with your details filled in. Press send to join the waitlist.');
      window.location.href = href;
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.('track', 'Lead');
      window.location.assign('/thank-you');
    } catch {
      setBusy(false);
      setStatus(
        `Sorry, that didn’t go through. Please try again, or email ${fallbackEmail} and we’ll add you.`,
        true,
      );
    }
  });
}
