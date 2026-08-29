import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo path="/privacy" />
      <Breadcrumbs items={[{ label: 'Privacy Policy', path: '/privacy' }]} />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-10">Last updated: August 9, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
          <p className="text-slate-600 leading-relaxed">
            Cleaning By Kandi ("we," "our," or "us") is committed to protecting the privacy of our clients and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at cleaningbykandi.com or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed mb-3">We may collect the following types of information:</p>
          <ul className="space-y-2">
            {[
              'Personal identification information (name, email address, phone number, mailing address)',
              'Service preferences and home details (square footage, number of bedrooms/bathrooms)',
              'Payment information (processed securely through third-party processors — we do not store card numbers)',
              'Communications you send us via contact forms, email, or phone',
              'Technical data such as IP address, browser type, and pages visited (via cookies)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
          <p className="text-slate-600 leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="space-y-2">
            {[
              'Provide, operate, and improve our cleaning services',
              'Respond to your quote requests, inquiries, and communications',
              'Schedule and manage cleaning appointments',
              'Process payments and send invoices',
              'Send you service-related notifications and reminders',
              'Send promotional communications (you may opt out at any time)',
              'Comply with legal obligations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. SMS / Text Messaging Terms</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            If you provide your mobile phone number and opt in through our website forms, you may receive text messages from Cleaning By Kandi related to your quote request or appointment, or — if you separately opt in — marketing and promotional offers.
          </p>
          <ul className="space-y-2 mb-3">
            {[
              'Message frequency varies.',
              'Message and data rates may apply.',
              <>You can opt out at any time by replying <strong>STOP</strong> to any message. You will receive one final message confirming your opt-out.</>,
              <>Reply <strong>HELP</strong> for assistance, or contact us directly at{' '}
                <a href="tel:4803097607" className="text-brand-primary hover:underline cursor-pointer">(480) 309-7607</a> or{' '}
                <a href="mailto:cleaningbykandi@yahoo.com" className="text-brand-primary hover:underline cursor-pointer">cleaningbykandi@yahoo.com</a>.
              </>,
              'Carriers are not liable for delayed or undelivered messages.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 leading-relaxed mb-3">
            No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Consent to receive text messages is not a condition of purchasing any goods or services. Transactional and marketing message consent are collected separately, and you may opt into either, both, or neither.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Information Sharing</h2>
          <p className="text-slate-600 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business (e.g., scheduling software, payment processors), provided those parties agree to keep this information confidential. We may also disclose your information if required by law or to protect the rights and safety of our company and clients.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            Our website may use cookies to enhance your browsing experience. Cookies are small data files stored on your device. You may disable cookies through your browser settings; however, some features of the website may not function properly as a result.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Data Security</h2>
          <p className="text-slate-600 leading-relaxed">
            We implement commercially reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. Your Rights</h2>
          <p className="text-slate-600 leading-relaxed">
            You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us at{' '}
            <a href="mailto:cleaningbykandi@yahoo.com" className="text-brand-primary hover:underline cursor-pointer">
              cleaningbykandi@yahoo.com
            </a>{' '}
            or call us at{' '}
            <a href="tel:4803097607" className="text-brand-primary hover:underline cursor-pointer">
              (480) 309-7607
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">9. Children's Privacy</h2>
          <p className="text-slate-600 leading-relaxed">
            Our services are not directed to individuals under the age of 13, and we do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">10. Changes to This Policy</h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">11. Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-900">Cleaning By Kandi</p>
            <p className="text-slate-600 text-sm">West Valley, Arizona</p>
            <a href="mailto:cleaningbykandi@yahoo.com" className="text-brand-primary text-sm hover:underline cursor-pointer block">
              cleaningbykandi@yahoo.com
            </a>
            <a href="tel:4803097607" className="text-brand-primary text-sm hover:underline cursor-pointer block">
              (480) 309-7607
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
