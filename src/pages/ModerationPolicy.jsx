import React from 'react';
import { Link } from 'react-router-dom';

export default function ModerationPolicy() {
  const lastUpdated = "January 17, 2025";

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>← Back to Home</Link>
          <div style={styles.navLinks}>
            <Link to="/terms" style={styles.navLink}>Terms of Service</Link>
            <Link to="/privacy" style={styles.navLink}>Privacy Policy</Link>
          </div>
        </nav>

        <h1 style={styles.title}>Content Moderation Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: {lastUpdated}</p>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Our Commitment</h2>
          <p style={styles.paragraph}>
            GemBooth is committed to fostering a safe, respectful, and creative community. This Content Moderation
            Policy outlines what content is prohibited on our platform, how we detect and enforce violations, and how
            users can report concerns or appeal moderation decisions.
          </p>
          <p style={styles.paragraph}>
            By using GemBooth, you agree to create and share content that complies with this policy, our
            <Link to="/terms" style={styles.link}> Terms of Service</Link>, and applicable laws.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Prohibited Content</h2>
          <p style={styles.paragraph}>
            The following types of content are strictly prohibited on GemBooth:
          </p>

          <h3 style={styles.subheading}>2.1 Illegal Content</h3>
          <ul style={styles.list}>
            <li>Content that violates any local, state, national, or international law</li>
            <li>Child sexual abuse material (CSAM) or any content exploiting minors</li>
            <li>Content that promotes or facilitates terrorism, violent extremism, or organized crime</li>
            <li>Content that violates intellectual property rights (copyright, trademark, etc.)</li>
            <li>Content that facilitates illegal activities (drug sales, fraud, etc.)</li>
          </ul>

          <h3 style={styles.subheading}>2.2 Adult Content and Nudity</h3>
          <ul style={styles.list}>
            <li>Nudity, sexual content, or sexually suggestive material</li>
            <li>Pornographic or explicit sexual content</li>
            <li>Content depicting sexual acts or sexual services</li>
            <li>Non-consensual intimate images (revenge porn)</li>
          </ul>
          <p style={styles.paragraph}>
            <em>Exception:</em> Artistic, educational, or medical content may be permitted if clearly marked and not
            gratuitous. Context matters, and such content will be reviewed on a case-by-case basis.
          </p>

          <h3 style={styles.subheading}>2.3 Violence and Harm</h3>
          <ul style={styles.list}>
            <li>Graphic violence, gore, or disturbing imagery</li>
            <li>Content promoting self-harm, suicide, or eating disorders</li>
            <li>Content glorifying or encouraging violence against individuals or groups</li>
            <li>Threats of violence or physical harm</li>
            <li>Content depicting animal abuse or cruelty</li>
          </ul>

          <h3 style={styles.subheading}>2.4 Hate Speech and Harassment</h3>
          <ul style={styles.list}>
            <li>Content that attacks, demeans, or dehumanizes individuals or groups based on race, ethnicity, national
                origin, religion, gender, gender identity, sexual orientation, disability, or other protected characteristics</li>
            <li>Slurs, hate symbols, or hate group imagery</li>
            <li>Harassment, bullying, or targeted abuse of individuals</li>
            <li>Doxxing (sharing private personal information without consent)</li>
            <li>Content encouraging or organizing hate speech or harassment</li>
          </ul>

          <h3 style={styles.subheading}>2.5 Spam and Manipulation</h3>
          <ul style={styles.list}>
            <li>Spam content, including excessive promotional material</li>
            <li>Misleading, deceptive, or fraudulent content</li>
            <li>Content designed to manipulate engagement metrics (fake likes, views, etc.)</li>
            <li>Malware, phishing attempts, or other malicious content</li>
            <li>Impersonation of others or creation of fake accounts</li>
          </ul>

          <h3 style={styles.subheading}>2.6 Misinformation</h3>
          <ul style={styles.list}>
            <li>Demonstrably false information that could cause significant harm (health, safety, elections, etc.)</li>
            <li>Manipulated media (deepfakes) intended to deceive or mislead</li>
            <li>Conspiracy theories that incite violence or harassment</li>
          </ul>
          <p style={styles.paragraph}>
            <em>Note:</em> We respect freedom of expression and do not fact-check opinions or satire. We focus on harmful
            misinformation with real-world consequences.
          </p>

          <h3 style={styles.subheading}>2.7 Other Prohibited Content</h3>
          <ul style={styles.list}>
            <li>Content featuring identifiable individuals without their consent (privacy violations)</li>
            <li>Content that violates someone's right of publicity</li>
            <li>Content that contains personally identifiable information (PII) of others</li>
            <li>Content that interferes with the platform's security or functionality</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. Detection and Moderation</h2>
          <p style={styles.paragraph}>
            We use a combination of methods to identify and remove prohibited content:
          </p>

          <h3 style={styles.subheading}>3.1 Automated Detection</h3>
          <ul style={styles.list}>
            <li><strong>AI Content Analysis:</strong> Machine learning models scan uploaded images for prohibited content
                (NSFW detection, violence detection, hate symbols, etc.)</li>
            <li><strong>PhotoDNA:</strong> Technology to detect known child sexual abuse material</li>
            <li><strong>Metadata Analysis:</strong> Detection of suspicious patterns, spam, or manipulation</li>
            <li><strong>Real-Time Blocking:</strong> High-confidence violations are blocked immediately before upload completes</li>
          </ul>

          <h3 style={styles.subheading}>3.2 User Reports</h3>
          <p style={styles.paragraph}>
            Users can report content they believe violates this policy. To report content:
          </p>
          <ol style={styles.list}>
            <li>Click the "Report" button on the content</li>
            <li>Select the violation type (e.g., "Hate speech", "NSFW content", "Spam")</li>
            <li>Provide additional context if needed</li>
            <li>Submit the report</li>
          </ol>
          <p style={styles.paragraph}>
            All reports are reviewed by our moderation team. False or abusive reports may result in action against the
            reporting user.
          </p>

          <h3 style={styles.subheading}>3.3 Human Review</h3>
          <p style={styles.paragraph}>
            Our trained moderation team reviews:
          </p>
          <ul style={styles.list}>
            <li>User-reported content</li>
            <li>Content flagged by automated systems but requiring human judgment</li>
            <li>Appeals of moderation decisions</li>
            <li>Edge cases and content in gray areas</li>
          </ul>
          <p style={styles.paragraph}>
            Reviewers follow detailed guidelines and receive ongoing training on content policy and cultural sensitivity.
          </p>

          <h3 style={styles.subheading}>3.4 Proactive Monitoring</h3>
          <p style={styles.paragraph}>
            We may proactively review:
          </p>
          <ul style={styles.list}>
            <li>Content from accounts with prior violations</li>
            <li>Trending or viral content</li>
            <li>Public galleries and featured content</li>
            <li>Random samples for quality assurance</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Enforcement Actions</h2>
          <p style={styles.paragraph}>
            When content violates this policy, we may take the following actions:
          </p>

          <h3 style={styles.subheading}>4.1 Content Removal</h3>
          <ul style={styles.list}>
            <li>Immediate removal of prohibited content</li>
            <li>No notification for severe violations (CSAM, terrorism, etc.)</li>
            <li>Notification with explanation for most other violations</li>
          </ul>

          <h3 style={styles.subheading}>4.2 Account Warnings</h3>
          <ul style={styles.list}>
            <li>First-time or minor violations typically result in a warning</li>
            <li>Warning includes explanation of violation and policy guidance</li>
            <li>Multiple warnings may lead to suspension or termination</li>
          </ul>

          <h3 style={styles.subheading}>4.3 Temporary Suspension</h3>
          <ul style={styles.list}>
            <li>Temporary loss of account access (typically 7-30 days)</li>
            <li>Applied for repeated violations or moderate severity violations</li>
            <li>During suspension, content is hidden but not deleted</li>
          </ul>

          <h3 style={styles.subheading}>4.4 Permanent Ban</h3>
          <ul style={styles.list}>
            <li>Permanent termination of account and deletion of all content</li>
            <li>Applied for severe violations (CSAM, terrorism, severe harassment, etc.)</li>
            <li>Applied for repeated violations after warnings and suspensions</li>
            <li>Ban evasion (creating new accounts) results in immediate permanent ban</li>
          </ul>

          <h3 style={styles.subheading}>4.5 Reporting to Authorities</h3>
          <p style={styles.paragraph}>
            For certain violations (CSAM, credible threats of violence, terrorism), we will:
          </p>
          <ul style={styles.list}>
            <li>Report content to the National Center for Missing and Exploited Children (NCMEC)</li>
            <li>Report to law enforcement when required by law</li>
            <li>Preserve evidence for legal proceedings</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Context Matters</h2>
          <p style={styles.paragraph}>
            We understand that context is important. Content that might otherwise be prohibited may be allowed if:
          </p>
          <ul style={styles.list}>
            <li>It has clear educational, artistic, or documentary value</li>
            <li>It's shared to raise awareness or condemn the behavior depicted</li>
            <li>It's newsworthy or of legitimate public interest</li>
            <li>It's satire or parody (clearly marked as such)</li>
          </ul>
          <p style={styles.paragraph}>
            However, even in these cases, we may add warnings, age restrictions, or limit distribution to protect users.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Appeals Process</h2>
          <p style={styles.paragraph}>
            If you believe your content was removed or your account was suspended in error, you may appeal:
          </p>

          <h3 style={styles.subheading}>6.1 How to Appeal</h3>
          <ol style={styles.list}>
            <li>Click the "Appeal" button in the notification email or account page</li>
            <li>Explain why you believe the decision was incorrect</li>
            <li>Provide any relevant context or evidence</li>
            <li>Submit your appeal within 30 days of the moderation action</li>
          </ol>

          <h3 style={styles.subheading}>6.2 Appeal Review</h3>
          <ul style={styles.list}>
            <li>Appeals are reviewed by a different moderator than the one who made the original decision</li>
            <li>We aim to respond to appeals within 7 business days</li>
            <li>You will receive a notification with the appeal decision and reasoning</li>
            <li>Appeal decisions are final and not subject to further review</li>
          </ul>

          <h3 style={styles.subheading}>6.3 Outcomes</h3>
          <ul style={styles.list}>
            <li><strong>Appeal Granted:</strong> Content restored or account reinstated; any penalties removed</li>
            <li><strong>Appeal Partially Granted:</strong> Some content restored or reduced penalty</li>
            <li><strong>Appeal Denied:</strong> Original decision stands</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Transparency and Accountability</h2>
          <p style={styles.paragraph}>
            We are committed to transparency in our content moderation practices:
          </p>

          <h3 style={styles.subheading}>7.1 Transparency Reports</h3>
          <p style={styles.paragraph}>
            We publish quarterly transparency reports that include:
          </p>
          <ul style={styles.list}>
            <li>Number of content removals by violation type</li>
            <li>Number of account suspensions and bans</li>
            <li>Number of user reports received and actioned</li>
            <li>Appeal statistics (submitted, granted, denied)</li>
            <li>Response to legal requests for content removal</li>
          </ul>

          <h3 style={styles.subheading}>7.2 Policy Updates</h3>
          <p style={styles.paragraph}>
            We regularly review and update this policy based on:
          </p>
          <ul style={styles.list}>
            <li>User feedback and community input</li>
            <li>Emerging trends and new types of harmful content</li>
            <li>Changes in laws and regulations</li>
            <li>Best practices in content moderation</li>
          </ul>
          <p style={styles.paragraph}>
            Material changes to this policy will be announced via email and in-app notifications.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. User Responsibilities</h2>
          <p style={styles.paragraph}>
            As a member of the GemBooth community, you are responsible for:
          </p>
          <ul style={styles.list}>
            <li><strong>Reviewing This Policy:</strong> Familiarize yourself with what content is prohibited</li>
            <li><strong>Thinking Before Uploading:</strong> Consider whether your content complies with this policy</li>
            <li><strong>Reporting Violations:</strong> Report content that violates this policy when you encounter it</li>
            <li><strong>Respecting Decisions:</strong> Accept moderation decisions, or use the appeals process if you disagree</li>
            <li><strong>Supporting a Safe Community:</strong> Treat others with respect and contribute positively</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. Limitations and Disclaimers</h2>
          <p style={styles.paragraph}>
            While we strive to enforce this policy consistently and fairly:
          </p>
          <ul style={styles.list}>
            <li>We cannot review all content before it is posted</li>
            <li>Automated systems are not perfect and may make mistakes</li>
            <li>We rely on user reports to identify violations</li>
            <li>Moderation decisions involve human judgment and may be subjective</li>
            <li>We do not guarantee a specific response time for reports or appeals</li>
            <li>We are not responsible for user-generated content, even if it violates this policy</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Questions and Feedback</h2>
          <p style={styles.paragraph}>
            If you have questions about this Content Moderation Policy or want to provide feedback:
          </p>
          <p style={styles.paragraph}>
            <strong>Contact Us:</strong><br />
            Email: moderation@gembooth.com<br />
            Support: support@gembooth.com<br />
            <br />
            For urgent safety concerns (imminent harm, CSAM, etc.), please email: safety@gembooth.com
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. Policy Updates</h2>
          <p style={styles.paragraph}>
            This policy may be updated from time to time. When we make material changes, we will notify users via:
          </p>
          <ul style={styles.list}>
            <li>Email to registered users</li>
            <li>In-app notification</li>
            <li>Prominent notice on our website</li>
          </ul>
          <p style={styles.paragraph}>
            Continued use of the Service after policy changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <footer style={styles.footer}>
          <p>© 2025 GemBooth Pty Ltd. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
            <span style={styles.separator}>•</span>
            <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
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
