// ============================================================
// Dominion Chihuahua Club – join.js
// ============================================================

// ---- Sticky header shadow ----
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- Mobile nav ----
const toggle   = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
toggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// ============================================================
// MEMBERSHIP FEE — update to your actual annual fee e.g. 40
// ============================================================
const MEMBERSHIP_FEE = '20';

// ---- Auto-fill today's date ----
const dateField = document.getElementById('j-date');
if (dateField) {
  const t  = new Date();
  const yy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, '0');
  const dd = String(t.getDate()).padStart(2, '0');
  dateField.value = `${yy}-${mm}-${dd}`;
}

// ---- Update bank reference as name is typed ----
function updateBankReference() {
  const name = document.getElementById('j-name')?.value.trim() || '[Your Name]';
  const el   = document.getElementById('bank-reference');
  if (el) el.textContent = `MEMBERSHIP – ${name}`;
}
document.getElementById('j-name')?.addEventListener('input', updateBankReference);

// ============================================================
// DOG NAME REPEATER (max 10)
// ============================================================
let dogCount = 1;

document.getElementById('add-dog-btn')?.addEventListener('click', () => {
  if (dogCount >= 10) return;
  dogCount++;

  const entry = document.createElement('div');
  entry.className = 'dog-entry';
  entry.innerHTML = `
    <div class="form-group dog-entry__row">
      <label for="dog-name-${dogCount}">Dog ${dogCount} Name</label>
      <div class="dog-entry__input-wrap">
        <input type="text" id="dog-name-${dogCount}" name="dogName${dogCount}" placeholder="e.g. Max" />
        <button type="button" class="dog-remove-btn" aria-label="Remove">&#x2715;</button>
      </div>
    </div>`;

  entry.querySelector('.dog-remove-btn').addEventListener('click', () => {
    entry.remove();
    renumberDogs();
    if (dogCount >= 10) document.getElementById('add-dog-btn').style.display = '';
    dogCount = Math.max(1, document.querySelectorAll('.dog-entry').length);
  });

  document.getElementById('dog-entries').appendChild(entry);

  if (dogCount >= 10) document.getElementById('add-dog-btn').style.display = 'none';
});

function renumberDogs() {
  document.querySelectorAll('.dog-entry').forEach((entry, i) => {
    const n     = i + 1;
    const input = entry.querySelector('input');
    const label = entry.querySelector('label');
    if (input) { input.id = `dog-name-${n}`; input.name = `dogName${n}`; }
    if (label) { label.htmlFor = `dog-name-${n}`; label.firstChild.textContent = `Dog ${n} Name`; }
    if (n === 1 && input) input.required = true;
  });
}

// ============================================================
// PAYMENT METHOD TOGGLE
// ============================================================
document.querySelectorAll('.pmethod').forEach(pm => {
  pm.addEventListener('click', () => {
    document.querySelectorAll('.pmethod').forEach(p => p.classList.remove('selected'));
    pm.classList.add('selected');
    pm.querySelector('input[type="radio"]').checked = true;

    const method = pm.dataset.method;
    document.getElementById('qr-panel').classList.toggle('visible',  method === 'stripe');
    document.getElementById('bank-panel').classList.toggle('visible', method === 'bank');
  });
});

// ============================================================
// BUILD EMAIL BODY
// ============================================================
function buildEmailBody(form) {
  const v = name => form.elements[name]?.value.trim() || '—';

  const payMethod = form.querySelector('.pmethod.selected')?.dataset.method === 'bank'
    ? 'Bank Transfer'
    : 'Stripe';

  const dogNames = Array.from(document.querySelectorAll('.dog-entry input'))
    .map((inp, i) => `  Dog ${i + 1}: ${inp.value.trim() || '—'}`)
    .join('\n');

  const declarations = [
    ['Consent to Membership',  form.elements['declConsent']?.checked],
    ['Agreement to Rules',     form.elements['declRules']?.checked],
    ['Register of Members',    form.elements['declRegister']?.checked],
    ['Dogs NZ Compliance',     form.elements['declDogsNZ']?.checked],
  ].map(([label, checked]) => `  ${checked ? '[X]' : '[ ]'} ${label}`).join('\n');

  return `DOMINION CHIHUAHUA CLUB INC
Application for Membership
============================================================

APPLICANT DETAILS
  Full Name:        ${v('fullName')}
  Physical Address: ${v('physicalAddress')}
  Postal Address:   ${v('postalAddress')}
  Email Address:    ${v('email')}
  Phone Number:     ${v('phone')}
  Date of Application: ${v('dateOfApplication')}

DOG/S NAME/S
${dogNames}

MANDATORY CONSENT & DECLARATION
${declarations}

PAYMENT
  Method:    ${payMethod}
  Fee:       $${MEMBERSHIP_FEE}.00 NZD per year
  Confirmed: ${form.elements['paymentConfirmed']?.checked ? 'Yes – payment completed' : 'Not yet confirmed'}

============================================================
Submitted online via dominionchihuahuaclub website.

OFFICE USE ONLY
  Date Received:           ___ / ___ / 202__
  Committee Approval Date: ___ / ___ / 202__
  Date Added to Register:  ___ / ___ / 202__
  Membership Paid:         $_________ (Receipt #___________)
`;
}

// ============================================================
// FORM SUBMIT → MAILTO
// ============================================================
const form = document.getElementById('application-form');

form?.addEventListener('submit', e => {
  e.preventDefault();

  // Validate required fields
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.style.borderColor = '';
    const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    if (empty) { field.style.borderColor = '#CE1126'; valid = false; }
  });

  if (!valid) {
    const first = form.querySelector('[required][style*="CE1126"]');
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    first?.focus();
    return;
  }

  const name    = form.elements['fullName'].value.trim();
  const subject = `New Member Application – ${name}`;
  const body    = buildEmailBody(form);

  // EMAIL DESTINATION — update if the inbox address changes
  const TO     = 'membership@dominionchiclub.com';
  const mailto = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const link = document.createElement('a');
  link.href  = mailto;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show success
  document.getElementById('application-form-wrap').style.display = 'none';
  const success = document.getElementById('success-screen');
  success.classList.add('visible');
  success.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
