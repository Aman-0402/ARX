import SEO from '../components/SEO.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'

const sections = [
  {
    title: '1. What information we collect',
    body: `When you use our contact form, we collect your name, email address, phone number, and message.
    When you submit a blog post via "Write for us", we collect your name, email address, and the content
    you submit. When you log in to the admin dashboard, we use a session cookie to keep you signed in —
    this is only used by staff accounts, not public visitors.`,
  },
  {
    title: '2. How we use it',
    body: `We use contact form submissions to respond to your inquiry and, if you agree to further
    contact, to follow up about our services. Blog submissions are used to review and, if approved,
    publish your article with attribution to the name you provided. We do not sell or rent your
    information to third parties.`,
  },
  {
    title: '3. Cookies',
    body: `This Site uses a small number of strictly necessary cookies: a CSRF-protection cookie and,
    for admin users only, a session cookie. We do not use third-party advertising or analytics cookies
    at this time. If that changes, this policy will be updated accordingly.`,
  },
  {
    title: '4. Data storage and security',
    body: `Submitted data is stored in our database and accessible only to authorized ARX Infotech staff
    through the admin dashboard, which requires a login. We take reasonable technical measures (HTTPS,
    session-based authentication, access controls) to protect your information, but no system can be
    guaranteed 100% secure.`,
  },
  {
    title: '5. Data retention',
    body: `Contact submissions and blog inquiries are retained as long as needed to respond to you and
    for our internal records, and can be deleted on request (see Section 7).`,
  },
  {
    title: '6. Third parties',
    body: `We do not share personal information with third parties except where required by law, or
    with service providers who help us operate the Site (for example, our hosting provider) under
    obligations to keep it confidential.`,
  },
  {
    title: '7. Your rights',
    body: `You can ask us to access, correct, or delete personal information we hold about you by
    emailing info@arxinfo.tech. We will respond within a reasonable timeframe.`,
  },
  {
    title: '8. Children’s privacy',
    body: `This Site is intended for businesses and educational institutions and is not directed at
    children. We do not knowingly collect personal information from children.`,
  },
  {
    title: '9. Changes to this policy',
    body: `We may update this Privacy Policy from time to time. The "last updated" date at the top of
    this page reflects the most recent revision.`,
  },
  {
    title: '10. Contact',
    body: `Questions about this Privacy Policy can be sent to info@arxinfo.tech or by post to 1st Floor,
    150, Panchita, Bongaon–Bagdh Rd. Street, Kolkata, India 743235.`,
  },
]

export default function Privacy() {
  return (
    <>
      <SEO
        path="/privacy"
        title="Privacy Policy"
        description="How ARX Infotech collects, uses, and protects your information."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <div className="mx-auto max-w-[900px] px-4 py-20">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-slate">Last updated: September 2026</p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] space-y-10 px-4 py-16">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-semibold text-graphite">{s.title}</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
