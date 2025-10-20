import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const lastUpdated = "January 17, 2025";

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>← Back to Home</Link>
          <div style={styles.navLinks}>
            <Link to="/terms" style={styles.navLink}>Terms of Service</Link>
            <Link to="/moderation" style={styles.navLink}>Content Moderation</Link>
          </div>
        </nav>

        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: {lastUpdated}</p>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Introduction</h2>
          <p style={styles.paragraph}>
            GemBooth Pty Ltd ("we", "us", "our") respects your privacy and is committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            AI-powered photo transformation service ("Service").
          </p>
          <p style={styles.paragraph}>
            By using GemBooth, you agree to the collection and use of information in accordance with this policy. If you
            do not agree with our policies and practices, do not use the Service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Information We Collect</h2>

          <h3 style={styles.subheading}>2.1 Information You Provide Directly</h3>
          <p style={styles.paragraph}>We collect information that you voluntarily provide when you:</p>
          <ul style={styles.list}>
            <li><strong>Create an Account:</strong> Email address, username, password (encrypted)</li>
            <li><strong>Subscribe:</strong> Billing information (processed by Stripe), subscription tier preference</li>
            <li><strong>Upload Photos:</strong> Images you upload for transformation, including any metadata (EXIF data)</li>
            <li><strong>Create Content:</strong> GIFs, custom AI prompts, captions, tags</li>
            <li><strong>Contact Us:</strong> Name, email, message content when you reach out for support</li>
          </ul>

          <h3 style={styles.subheading}>2.2 Information We Collect Automatically</h3>
          <p style={styles.paragraph}>When you use the Service, we automatically collect:</p>
          <ul style={styles.list}>
            <li><strong>Usage Data:</strong> Features used, photos created, GIFs generated, time spent, interactions</li>
            <li><strong>Device Information:</strong> IP address, browser type and version, device type, operating system</li>
            <li><strong>Log Data:</strong> Access times, pages viewed, error logs, referring URLs</li>
            <li><strong>Cookies and Tracking:</strong> See Section 8 for details on cookies</li>
          </ul>

          <h3 style={styles.subheading}>2.3 Information from Third Parties</h3>
          <p style={styles.paragraph}>We receive information from:</p>
          <ul style={styles.list}>
            <li><strong>Supabase:</strong> Authentication and database services</li>
            <li><strong>Stripe:</strong> Payment processing and subscription status</li>
            <li><strong>Google Gemini:</strong> AI processing metadata (no direct data sharing)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. How We Use Your Information</h2>
          <p style={styles.paragraph}>We use your information for the following purposes:</p>

          <h3 style={styles.subheading}>3.1 To Provide the Service</h3>
          <ul style={styles.list}>
            <li>Process and transform your photos using AI</li>
            <li>Generate GIFs from your images</li>
            <li>Store and manage your photo library</li>
            <li>Enable you to share content (when you choose to)</li>
            <li>Manage your account and authentication</li>
          </ul>

          <h3 style={styles.subheading}>3.2 To Process Payments</h3>
          <ul style={styles.list}>
            <li>Process subscription payments via Stripe</li>
            <li>Send billing confirmations and invoices</li>
            <li>Manage subscription status and upgrades/downgrades</li>
            <li>Detect and prevent fraud</li>
          </ul>

          <h3 style={styles.subheading}>3.3 To Improve the Service</h3>
          <ul style={styles.list}>
            <li>Analyze usage patterns to enhance features</li>
            <li>Train and improve AI models (using anonymized data)</li>
            <li>Identify and fix bugs and technical issues</li>
            <li>Conduct research and development</li>
          </ul>

          <h3 style={styles.subheading}>3.4 To Communicate With You</h3>
          <ul style={styles.list}>
            <li>Send service updates and security alerts</li>
            <li>Respond to your support requests</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Notify you of changes to our policies</li>
          </ul>

          <h3 style={styles.subheading}>3.5 For Legal and Safety Purposes</h3>
          <ul style={styles.list}>
            <li>Enforce our Terms of Service and Content Moderation Policy</li>
            <li>Comply with legal obligations and respond to legal requests</li>
            <li>Protect against fraud, abuse, and security threats</li>
            <li>Resolve disputes and enforce agreements</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. How We Share Your Information</h2>
          <p style={styles.paragraph}>We do not sell your personal information. We share your information only in the following circumstances:</p>

          <h3 style={styles.subheading}>4.1 Service Providers</h3>
          <p style={styles.paragraph}>We share data with trusted third-party service providers who assist us in operating the Service:</p>
          <ul style={styles.list}>
            <li><strong>Supabase:</strong> Cloud hosting, database, authentication, and file storage</li>
            <li><strong>Google Gemini AI:</strong> Image processing and transformation (images sent for processing only)</li>
            <li><strong>Stripe:</strong> Payment processing and subscription management</li>
            <li><strong>Vercel:</strong> Web hosting and content delivery</li>
          </ul>
          <p style={styles.paragraph}>
            These providers are contractually obligated to protect your data and use it only for the purposes we specify.
          </p>

          <h3 style={styles.subheading}>4.2 Public Sharing</h3>
          <p style={styles.paragraph}>
            When you choose to make photos or GIFs public, they may be visible to other users and appear in public
            galleries. You control the visibility of your content through privacy settings.
          </p>

          <h3 style={styles.subheading}>4.3 Legal Requirements</h3>
          <p style={styles.paragraph}>We may disclose your information if required by law or in response to:</p>
          <ul style={styles.list}>
            <li>Court orders, subpoenas, or other legal processes</li>
            <li>Government or regulatory inquiries</li>
            <li>Legal claims or disputes</li>
            <li>Emergencies involving danger to persons or property</li>
          </ul>

          <h3 style={styles.subheading}>4.4 Business Transfers</h3>
          <p style={styles.paragraph}>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part
            of that transaction. We will notify you of any such change in ownership or control of your personal data.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Data Retention</h2>
          <p style={styles.paragraph}>We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy:</p>
          <ul style={styles.list}>
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Photos and GIFs:</strong> Retained until you delete them or close your account</li>
            <li><strong>Usage Data:</strong> Retained for 24 months for analytics</li>
            <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
            <li><strong>Legal Obligations:</strong> Some data retained as required by law</li>
          </ul>
          <p style={styles.paragraph}>
            When you delete your account, your photos and personal data are permanently deleted within 30 days, except
            for data we must retain for legal compliance. Backup copies may persist for up to 90 days for disaster recovery.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Your Privacy Rights</h2>
          <p style={styles.paragraph}>You have the following rights regarding your personal data:</p>

          <h3 style={styles.subheading}>6.1 Access and Portability</h3>
          <ul style={styles.list}>
            <li>Request a copy of your personal data</li>
            <li>Export your photos and GIFs</li>
            <li>Access your account information at any time</li>
          </ul>

          <h3 style={styles.subheading}>6.2 Correction</h3>
          <ul style={styles.list}>
            <li>Update your email, username, and profile information</li>
            <li>Correct inaccurate or incomplete data</li>
          </ul>

          <h3 style={styles.subheading}>6.3 Deletion</h3>
          <ul style={styles.list}>
            <li>Delete individual photos or GIFs</li>
            <li>Delete your entire account and all associated data</li>
            <li>Request deletion of specific data categories</li>
          </ul>

          <h3 style={styles.subheading}>6.4 Objection and Restriction</h3>
          <ul style={styles.list}>
            <li>Opt out of marketing communications</li>
            <li>Disable non-essential cookies</li>
            <li>Object to certain data processing activities</li>
          </ul>

          <h3 style={styles.subheading}>6.5 How to Exercise Your Rights</h3>
          <p style={styles.paragraph}>
            To exercise any of these rights, please:
          </p>
          <ul style={styles.list}>
            <li>Use your account settings for most requests</li>
            <li>Email us at privacy@gembooth.com for complex requests</li>
            <li>We will respond within 30 days of verification</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Data Security</h2>
          <p style={styles.paragraph}>We implement industry-standard security measures to protect your data:</p>
          <ul style={styles.list}>
            <li><strong>Encryption:</strong> All data transmitted over HTTPS/TLS; passwords hashed with bcrypt</li>
            <li><strong>Access Controls:</strong> Role-based access to databases and storage</li>
            <li><strong>Authentication:</strong> Secure authentication via Supabase Auth with JWT tokens</li>
            <li><strong>Monitoring:</strong> Continuous monitoring for security threats and anomalies</li>
            <li><strong>Regular Audits:</strong> Periodic security assessments and penetration testing</li>
            <li><strong>Data Isolation:</strong> Row-level security ensures users only access their own data</li>
          </ul>
          <p style={styles.paragraph}>
            While we strive to protect your data, no method of transmission over the internet or electronic storage is
            100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Cookies and Tracking Technologies</h2>
          <p style={styles.paragraph}>We use cookies and similar tracking technologies to enhance your experience:</p>

          <h3 style={styles.subheading}>8.1 Essential Cookies</h3>
          <p style={styles.paragraph}>Required for the Service to function:</p>
          <ul style={styles.list}>
            <li>Authentication tokens (Supabase session)</li>
            <li>Security tokens (CSRF protection)</li>
            <li>User preferences (cannot be disabled)</li>
          </ul>

          <h3 style={styles.subheading}>8.2 Analytics Cookies</h3>
          <p style={styles.paragraph}>Help us understand how you use the Service:</p>
          <ul style={styles.list}>
            <li>Page views and user flows</li>
            <li>Feature usage statistics</li>
            <li>Performance metrics</li>
          </ul>

          <h3 style={styles.subheading}>8.3 Your Cookie Choices</h3>
          <p style={styles.paragraph}>
            You can manage cookie preferences through our Cookie Consent banner (appears on first visit) or your browser
            settings. Disabling essential cookies may affect Service functionality.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. International Data Transfers</h2>
          <p style={styles.paragraph}>
            GemBooth is based in Australia, but our service providers may process data in other countries, including the
            United States. When we transfer your data internationally, we ensure appropriate safeguards are in place,
            such as:
          </p>
          <ul style={styles.list}>
            <li>Standard contractual clauses approved by the European Commission</li>
            <li>Service providers with adequate data protection certifications</li>
            <li>Compliance with applicable data protection laws (GDPR, CCPA, Australian Privacy Act)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Children's Privacy</h2>
          <p style={styles.paragraph}>
            The Service is not intended for users under the age of 13. We do not knowingly collect personal information
            from children under 13. If you are a parent or guardian and believe your child has provided us with personal
            information, please contact us at privacy@gembooth.com, and we will delete the information.
          </p>
          <p style={styles.paragraph}>
            Users aged 13-17 must have parental or guardian consent to use the Service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. GDPR Compliance (European Users)</h2>
          <p style={styles.paragraph}>
            If you are in the European Economic Area (EEA), you have additional rights under the General Data Protection
            Regulation (GDPR):
          </p>
          <ul style={styles.list}>
            <li><strong>Legal Basis:</strong> We process your data based on consent, contract performance, legal obligations, and legitimate interests</li>
            <li><strong>Data Protection Officer:</strong> Contact dpo@gembooth.com for GDPR-related inquiries</li>
            <li><strong>Right to Lodge a Complaint:</strong> You may file a complaint with your local data protection authority</li>
            <li><strong>Automated Decision-Making:</strong> We do not use automated decision-making or profiling that significantly affects you</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>12. CCPA Compliance (California Residents)</h2>
          <p style={styles.paragraph}>
            If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul style={styles.list}>
            <li><strong>Right to Know:</strong> Request disclosure of personal information collected, used, and shared</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
            <li><strong>Right to Opt-Out:</strong> We do not sell personal information (no opt-out needed)</li>
            <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
          </ul>
          <p style={styles.paragraph}>
            To exercise these rights, email privacy@gembooth.com or use your account settings.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>13. Australian Privacy Act Compliance</h2>
          <p style={styles.paragraph}>
            As an Australian company, we comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988:
          </p>
          <ul style={styles.list}>
            <li>We collect personal information only for lawful purposes related to the Service</li>
            <li>We handle personal information in accordance with the APPs</li>
            <li>You may access and correct your personal information</li>
            <li>You may complain to the Office of the Australian Information Commissioner (OAIC) if you believe we have breached the Privacy Act</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>14. Changes to This Privacy Policy</h2>
          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
            operational, or regulatory reasons. We will notify you of any material changes by:
          </p>
          <ul style={styles.list}>
            <li>Posting the updated policy on our website with a new "Last Updated" date</li>
            <li>Sending an email notification to your registered email address</li>
            <li>Displaying a prominent notice on the Service</li>
          </ul>
          <p style={styles.paragraph}>
            Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>15. Contact Us</h2>
          <p style={styles.paragraph}>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <p style={styles.paragraph}>
            <strong>GemBooth Pty Ltd</strong><br />
            Email: privacy@gembooth.com<br />
            Support: support@gembooth.com<br />
            Data Protection Officer: dpo@gembooth.com<br />
            <br />
            For GDPR inquiries: dpo@gembooth.com<br />
            For CCPA inquiries: privacy@gembooth.com
          </p>
        </section>

        <footer style={styles.footer}>
          <p>© 2025 GemBooth Pty Ltd. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
            <span style={styles.separator}>•</span>
            <Link to="/moderation" style={styles.footerLink}>Content Moderation</Link>
            <span style={styles.separator}>•</span>
            <Link to="/" style={styles.footerLink}>Home</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #2a2a2a',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  lastUpdated: {
    color: '#9ca3af',
    fontSize: '14px',
    marginBottom: '40px',
  },
  section: {
    marginBottom: '40px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: '16px',
    marginTop: '32px',
  },
  subheading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: '12px',
    marginTop: '24px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#d1d5db',
    marginBottom: '16px',
  },
  list: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#d1d5db',
    marginBottom: '16px',
    paddingLeft: '30px',
  },
  footer: {
    marginTop: '80px',
    paddingTop: '40px',
    borderTop: '1px solid #2a2a2a',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
  footerLinks: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
  },
  footerLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '14px',
  },
  separator: {
    color: '#4b5563',
  },
};
