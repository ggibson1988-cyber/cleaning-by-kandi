import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo
        path="/terms"
        title="Terms of Service | Cleaning By Kandi"
        description="The terms and conditions governing use of the Cleaning By Kandi website and cleaning services in the West Valley, Arizona."
      />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-slate-500 text-sm mb-10">Last updated: August 9, 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            By accessing or using the website at cleaningbykandi.com or engaging with Cleaning By Kandi's cleaning services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services</h2>
          <p className="text-slate-600 leading-relaxed">
            Cleaning By Kandi provides residential, commercial, and specialty cleaning services in the West Valley, Arizona. The scope of each service will be agreed upon before commencement. We reserve the right to refuse service to anyone for any reason at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. Scheduling and Cancellation</h2>
          <ul className="space-y-2">
            {[
              'Appointments must be scheduled at least 48 hours in advance.',
              'Cancellations must be made at least 24 hours before the scheduled service.',
              'Cancellations made with less than 24 hours\' notice may be subject to a cancellation fee.',
              'We reserve the right to reschedule due to staff illness, severe weather, or other unforeseen circumstances.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Payment Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            Payment is due upon completion of service unless otherwise agreed in writing. We accept cash, check, and major credit/debit cards. Late payments may be subject to a fee. All prices are subject to change with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Satisfaction Guarantee</h2>
          <p className="text-slate-600 leading-relaxed">
            We stand behind the quality of our work. If you are not satisfied with a cleaning, please notify us within 24 hours of the service and we will return to address any areas of concern at no additional charge. This guarantee does not apply to repeated or excessive dissatisfaction deemed outside the agreed scope of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Client Responsibilities</h2>
          <ul className="space-y-2">
            {[
              'Ensure safe access to the property at the scheduled time.',
              'Secure valuables, jewelry, and fragile items before our team arrives.',
              'Inform us of any hazardous materials, allergens, or sensitive areas in advance.',
              'Ensure pets are secured during the cleaning session.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            Cleaning By Kandi is fully insured. In the unlikely event of damage caused by our team, please report it within 24 hours of the service. Our liability is limited to the cost of repair or replacement of the damaged item(s), not to exceed the value of the cleaning service provided. We are not responsible for pre-existing damage, items left unsecured, or normal wear and tear.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. Intellectual Property</h2>
          <p className="text-slate-600 leading-relaxed">
            All content on this website, including text, graphics, logos, and images, is the property of Cleaning By Kandi and is protected by applicable intellectual property laws. You may not use, reproduce, or distribute any content without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">9. SMS / Text Messaging Program Terms</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            By submitting your mobile phone number and checking the applicable consent box on our website, you agree to receive text messages from Cleaning By Kandi as described below.
          </p>
          <ul className="space-y-2 mb-3">
            {[
              <><strong>Transactional messages</strong> — related to a quote request, appointment, or service you have requested (e.g., scheduling confirmations, reminders).</>,
              <><strong>Marketing messages</strong> — promotional offers, discounts, and service updates, sent only if you separately opt in.</>,
              'Message frequency varies. Message and data rates may apply.',
              <>Reply <strong>STOP</strong> at any time to cancel. Reply <strong>HELP</strong> for assistance. After opting out, you may rejoin by submitting our website form again and providing SMS consent.</>,
              'Supported carriers are not liable for delayed or undelivered messages.',
              'Consent to receive text messages is not required as a condition of purchasing any service, and you may opt out at any time without affecting your ability to request or receive services from us.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary-light rounded-full shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 leading-relaxed">
            For details on how we handle information collected through our SMS program, see our{' '}
            <Link to="/privacy" className="text-brand-primary hover:underline cursor-pointer">Privacy Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">10. Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            To the fullest extent permitted by law, Cleaning By Kandi shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or website. Our total liability shall not exceed the amount paid for the specific service in question.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">11. Governing Law</h2>
          <p className="text-slate-600 leading-relaxed">
            These Terms of Service are governed by the laws of the State of Arizona, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Maricopa County, Arizona.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">12. Changes to These Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">13. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have questions about these Terms of Service, please contact us:
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
