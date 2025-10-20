import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const lastUpdated = "January 17, 2025";

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>← Back to Home</Link>
          <div style={styles.navLinks}>
            <Link to="/privacy" style={styles.navLink}>Privacy Policy</Link>
            <Link to="/moderation" style={styles.navLink}>Content Moderation</Link>
          </div>
        </nav>

        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.lastUpdated}>Last Updated: {lastUpdated}</p>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Agreement to Terms</h2>
          <p style={styles.paragraph}>
            By accessing and using GemBooth ("Service"), operated by GemBooth Pty Ltd ("Company", "we", "us", or "our"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not
            access or use the Service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Description of Service</h2>
          <p style={styles.paragraph}>
            GemBooth is an AI-powered photo transformation service that allows users to:
          </p>
          <ul style={styles.list}>
            <li>Upload and transform photos using artificial intelligence</li>
            <li>Create animated GIFs from transformed photos</li>
            <li>Store and manage their photo library</li>
            <li>Share photos publicly or keep them private</li>
          </ul>
          <p style={styles.paragraph}>
            The Service uses Google Gemini AI technology to process and transform images according to user-selected styles.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. Account Registration and Security</h2>
          <p style={styles.paragraph}>
            To use certain features of the Service, you must register for an account. You agree to:
          </p>
          <ul style={styles.list}>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p style={styles.paragraph}>
            You must be at least 13 years of age to use the Service. Users under 18 must have parental or guardian consent.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. User Responsibilities and Conduct</h2>
          <p style={styles.paragraph}>
            You are solely responsible for all content you upload, create, or share through the Service. You agree not to:
          </p>
          <ul style={styles.list}>
            <li>Upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Upload content that infringes upon the intellectual property rights of others</li>
            <li>Upload content containing nudity, sexual content, or content inappropriate for minors</li>
            <li>Use the Service to harass, abuse, or harm another person</li>
            <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use automated systems (bots, scrapers) to access the Service without our express written permission</li>
            <li>Use the Service for any commercial purpose without our prior written consent</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Intellectual Property Rights</h2>

          <h3 style={styles.subheading}>5.1 Your Content</h3>
          <p style={styles.paragraph}>
            You retain all ownership rights to the photos you upload ("Your Content"). By uploading content to the Service,
            you grant us a worldwide, non-exclusive, royalty-free license to:
          </p>
          <ul style={styles.list}>
            <li>Store, process, and display Your Content as necessary to provide the Service</li>
            <li>Create derivative works (transformed images) based on Your Content</li>
            <li>Display publicly shared content on our platform and promotional materials</li>
          </ul>
          <p style={styles.paragraph}>
            This license terminates when you delete Your Content from the Service, except where content has been shared
            with others and they have not deleted it.
          </p>

          <h3 style={styles.subheading}>5.2 AI-Generated Content</h3>
          <p style={styles.paragraph}>
            Transformed images created by our AI technology are generated based on Your Content combined with our AI models.
            You own the output images, subject to our limited license to display them as part of the Service.
          </p>

          <h3 style={styles.subheading}>5.3 Our Intellectual Property</h3>
          <p style={styles.paragraph}>
            The Service, including its design, features, code, AI models, and trademarks, is owned by GemBooth Pty Ltd
            and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify,
            distribute, or reverse engineer any part of the Service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Subscription Plans and Billing</h2>

          <h3 style={styles.subheading}>6.1 Subscription Tiers</h3>
          <p style={styles.paragraph}>
            We offer the following subscription tiers:
          </p>
          <ul style={styles.list}>
            <li><strong>Free:</strong> Limited photos and GIFs per month, basic features</li>
            <li><strong>Pro ($9.99 AUD/month):</strong> Increased limits, priority processing</li>
            <li><strong>Premium ($19.99 AUD/month):</strong> Unlimited usage, advanced features</li>
          </ul>
          <p style={styles.paragraph}>
            Pricing and features are subject to change with 30 days notice to existing subscribers.
          </p>

          <h3 style={styles.subheading}>6.2 Billing and Payment</h3>
          <p style={styles.paragraph}>
            By subscribing to a paid plan, you authorize us to charge your payment method on a recurring monthly basis.
            You agree to:
          </p>
          <ul style={styles.list}>
            <li>Provide current, complete, and accurate payment information</li>
            <li>Promptly update payment information if it changes</li>
            <li>Pay all charges incurred under your account</li>
            <li>Pay any applicable taxes</li>
          </ul>
          <p style={styles.paragraph}>
            All payments are processed securely through Stripe. We do not store your complete payment information.
          </p>

          <h3 style={styles.subheading}>6.3 Cancellation and Refunds</h3>
          <p style={styles.paragraph}>
            You may cancel your subscription at any time through your account settings or the Stripe customer portal.
            Cancellation will take effect at the end of your current billing period. You will continue to have access
            to paid features until the end of the billing period.
          </p>
          <p style={styles.paragraph}>
            We do not offer refunds for partial months or unused services. If you believe you were charged in error,
            please contact us at support@gembooth.com within 14 days of the charge.
          </p>

          <h3 style={styles.subheading}>6.4 Free Trial</h3>
          <p style={styles.paragraph}>
            If we offer a free trial, you will be charged at the end of the trial period unless you cancel before the
            trial ends. We reserve the right to limit free trials to one per user.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Content Moderation and Enforcement</h2>
          <p style={styles.paragraph}>
            We reserve the right to review, monitor, and remove any content that violates these Terms or our
            <Link to="/moderation" style={styles.link}> Content Moderation Policy</Link>. We may use automated systems
            and human review to detect prohibited content.
          </p>
          <p style={styles.paragraph}>
            Violations may result in:
          </p>
          <ul style={styles.list}>
            <li>Content removal without notice</li>
            <li>Warning notices</li>
            <li>Temporary or permanent account suspension</li>
            <li>Termination of your account</li>
            <li>Legal action if required by law</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Data Retention and Account Deletion</h2>
          <p style={styles.paragraph}>
            We retain your photos and data for as long as your account is active. If you delete your account:
          </p>
          <ul style={styles.list}>
            <li>Your photos and GIFs will be permanently deleted within 30 days</li>
            <li>Your account information will be anonymized</li>
            <li>Content shared with others may remain visible until they delete it</li>
            <li>Backup copies may persist for up to 90 days for disaster recovery purposes</li>
          </ul>
          <p style={styles.paragraph}>
            We may retain certain information as required by law or for legitimate business purposes such as fraud prevention.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. Third-Party Services</h2>
          <p style={styles.paragraph}>
            The Service integrates with third-party services including:
          </p>
          <ul style={styles.list}>
            <li><strong>Google Gemini AI:</strong> For image processing and transformation</li>
            <li><strong>Supabase:</strong> For data storage and authentication</li>
            <li><strong>Stripe:</strong> For payment processing</li>
          </ul>
          <p style={styles.paragraph}>
            Your use of these services is subject to their respective terms and privacy policies. We are not responsible
            for the practices of these third-party services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Disclaimer of Warranties</h2>
          <p style={styles.paragraph}>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p style={styles.paragraph}>
            We do not warrant that:
          </p>
          <ul style={styles.list}>
            <li>The Service will be uninterrupted, secure, or error-free</li>
            <li>The results obtained from the Service will be accurate or reliable</li>
            <li>AI-generated content will meet your expectations</li>
            <li>Any errors in the Service will be corrected</li>
          </ul>
          <p style={styles.paragraph}>
            You use the Service at your own risk. We are not responsible for any loss or damage to your photos or data.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, GEMBOOTH PTY LTD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
            OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul style={styles.list}>
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of your data</li>
            <li>Any interruption or cessation of the Service</li>
            <li>Any bugs, viruses, or other harmful code transmitted through the Service</li>
            <li>Any errors or omissions in any content or for any loss or damage incurred from use of content</li>
            <li>Any conduct or content of any third party on the Service</li>
          </ul>
          <p style={styles.paragraph}>
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT
            YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100 AUD, WHICHEVER IS GREATER.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>12. Indemnification</h2>
          <p style={styles.paragraph}>
            You agree to indemnify, defend, and hold harmless GemBooth Pty Ltd, its officers, directors, employees, and
            agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal
            fees, arising out of or in any way connected with:
          </p>
          <ul style={styles.list}>
            <li>Your access to or use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights, including intellectual property rights</li>
            <li>Any content you upload to the Service</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>13. Modifications to Service and Terms</h2>
          <p style={styles.paragraph}>
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with
            or without notice. We will not be liable to you or any third party for any modification, suspension, or
            discontinuance of the Service.
          </p>
          <p style={styles.paragraph}>
            We may revise these Terms from time to time. We will notify you of material changes by posting the updated
            Terms on our website and updating the "Last Updated" date. Your continued use of the Service after changes
            become effective constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>14. Termination</h2>
          <p style={styles.paragraph}>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or
            liability, for any reason, including if you breach these Terms.
          </p>
          <p style={styles.paragraph}>
            Upon termination:
          </p>
          <ul style={styles.list}>
            <li>Your right to use the Service will immediately cease</li>
            <li>Any outstanding payments will become immediately due</li>
            <li>You must cease all use of the Service</li>
            <li>Provisions that by their nature should survive termination shall survive, including ownership provisions,
                warranty disclaimers, and limitations of liability</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>15. Governing Law and Dispute Resolution</h2>
          <p style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of New South Wales, Australia,
            without regard to its conflict of law provisions.
          </p>
          <p style={styles.paragraph}>
            Any dispute arising from or relating to these Terms or the Service shall be resolved through:
          </p>
          <ol style={styles.list}>
            <li><strong>Informal Resolution:</strong> We encourage you to contact us first to resolve any disputes informally</li>
            <li><strong>Mediation:</strong> If informal resolution fails, parties agree to attempt mediation before litigation</li>
            <li><strong>Jurisdiction:</strong> Any legal action must be brought exclusively in the courts of New South Wales, Australia</li>
          </ol>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>16. Miscellaneous</h2>

          <h3 style={styles.subheading}>16.1 Entire Agreement</h3>
          <p style={styles.paragraph}>
            These Terms, together with our Privacy Policy and Content Moderation Policy, constitute the entire agreement
            between you and GemBooth Pty Ltd regarding the Service.
          </p>

          <h3 style={styles.subheading}>16.2 Waiver and Severability</h3>
          <p style={styles.paragraph}>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain
            in full force and effect.
          </p>

          <h3 style={styles.subheading}>16.3 Assignment</h3>
          <p style={styles.paragraph}>
            You may not assign or transfer these Terms without our prior written consent. We may assign our rights and
            obligations under these Terms without restriction.
          </p>

          <h3 style={styles.subheading}>16.4 Force Majeure</h3>
          <p style={styles.paragraph}>
            We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable
            control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities,
            fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>17. Contact Information</h2>
          <p style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p style={styles.paragraph}>
            <strong>GemBooth Pty Ltd</strong><br />
            Email: legal@gembooth.com<br />
            Support: support@gembooth.com
          </p>
        </section>

        <footer style={styles.footer}>
          <p>© 2025 GemBooth Pty Ltd. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
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
  link: {
    color: '#60a5fa',
    textDecoration: 'underline',
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
