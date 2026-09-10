import SEO from '../components/SEO.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'

const sections = [
  {
    title: '1. Acceptance of terms',
    body: `By accessing or using the ARX Infotech website ("Site") or engaging our IT services, product
    development, or academic automation solutions, you agree to be bound by these Terms and Conditions.
    If you do not agree, please do not use the Site or our services.`,
  },
  {
    title: '2. Our services',
    body: `ARX Infotech provides managed IT services, cloud and infrastructure support, cybersecurity,
    custom software and product development, and academic automation solutions for businesses and
    educational institutions. Specific engagements are governed by a separate signed agreement or
    statement of work between ARX Infotech and the client; these Terms cover use of the public website
    only, unless a services agreement says otherwise.`,
  },
  {
    title: '3. Use of the site',
    body: `You agree to use this Site only for lawful purposes. You may not attempt to gain unauthorized
    access to any part of the Site, interfere with its operation, or submit false, misleading, or
    malicious content through the contact form or blog submission form.`,
  },
  {
    title: '4. Blog submissions',
    body: `If you submit an article via our "Write for us" form, you confirm the content is your own
    original work, does not infringe any third party's rights, and grants ARX Infotech a non-exclusive
    license to review, edit, publish, and display it on the Site. Submitted content is reviewed before
    publication and may be edited, rejected, or removed at our discretion.`,
  },
  {
    title: '5. Intellectual property',
    body: `All content on this Site — including text, graphics, logos, and code — is the property of
    ARX Infotech or its licensors and is protected by applicable intellectual property laws, except for
    content you submit yourself (see Section 4). You may not reproduce, distribute, or create derivative
    works from Site content without our prior written consent.`,
  },
  {
    title: '6. Verification records',
    body: `Certificate, internship, and project verification records displayed via the /verify feature
    are provided for informational purposes to confirm records issued by ARX Infotech. We make reasonable
    efforts to keep these accurate but do not guarantee uninterrupted availability of the lookup service.`,
  },
  {
    title: '7. No warranty',
    body: `The Site and its content are provided "as is" without warranties of any kind, express or
    implied. ARX Infotech does not warrant that the Site will be uninterrupted, error-free, or free of
    harmful components.`,
  },
  {
    title: '8. Limitation of liability',
    body: `To the fullest extent permitted by law, ARX Infotech is not liable for any indirect,
    incidental, or consequential damages arising from your use of the Site. This does not limit liability
    that cannot be excluded under applicable law.`,
  },
  {
    title: '9. Changes to these terms',
    body: `We may update these Terms from time to time. Continued use of the Site after changes are
    posted constitutes acceptance of the revised Terms.`,
  },
  {
    title: '10. Contact',
    body: `Questions about these Terms can be sent to info@arxinfo.tech or by post to 1st Floor, 150,
    Panchita, Bongaon–Bagdh Rd. Street, Kolkata, India 743235.`,
  },
]

export default function Terms() {
  return (
    <>
      <SEO
        path="/terms"
        title="Terms and Conditions"
        description="Terms and conditions governing use of the ARX Infotech website and services."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <div className="mx-auto max-w-[900px] px-4 py-20">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
              Terms and Conditions
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
