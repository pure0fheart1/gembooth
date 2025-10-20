import React from 'react';
import { Link } from 'react-router-dom';

export default function ContentModeration() {
  const lastUpdated = "January 2025";

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
          <h2 style={styles.heading}>1. Our Commitment to Safe Content</h2>
          <p style={styles.paragraph}>
            GemBooth is committed to maintaining a safe, respectful, and creative community for all users. This
            Content Moderation Policy outlines the standards for acceptable content, our enforcement mechanisms,
            and the processes for reporting violations and appealing decisions.
          </p>
          <p style={styles.paragraph}>
            By using GemBooth's AI photo transformation service, you agree to comply with this policy, our{' '}
            <Link to="/terms" style={styles.link}>Terms of Service</Link>, and all applicable laws. We reserve
            the right to remove content and take action against accounts that violate these standards.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Prohibited Content</h2>
          <p style={styles.paragraph}>
            The following types of content are strictly prohibited on GemBooth and will result in immediate
            removal and potential account action:
          </p>

          <h3 style={styles.subheading}>2.1 Illegal Content</h3>
          <ul style={styles.list}>
            <li><strong>Child Sexual Abuse Material (CSAM):</strong> Any content depicting, promoting, or
                facilitating child sexual exploitation or abuse. We report all CSAM to the National Center for
                Missing and Exploited Children (NCMEC) and law enforcement.</li>
            <li><strong>Illegal Activities:</strong> Content that promotes, facilitates, or depicts illegal
                activities including drug trafficking, weapons sales, human trafficking, fraud, or theft.</li>
            <li><strong>Terrorism and Violent Extremism:</strong> Content that promotes, supports, or glorifies
                terrorist organizations, violent extremism, or mass violence.</li>
            <li><strong>Copyright Infringement:</strong> Unauthorized use of copyrighted material including
                images, logos, trademarks, or other intellectual property without proper permission or fair use
                justification.</li>
          </ul>

          <h3 style={styles.subheading}>2.2 Harmful Content</h3>
          <ul style={styles.list}>
            <li><strong>Violence and Gore:</strong> Graphic depictions of violence, injury, death, or gore that
                serve no educational or documentary purpose.</li>
            <li><strong>Self-Harm and Suicide:</strong> Content that promotes, glorifies, or provides instructions
                for self-harm, suicide, or eating disorders.</li>
            <li><strong>Animal Cruelty:</strong> Content depicting abuse, torture, or killing of animals.</li>
            <li><strong>Dangerous Activities:</strong> Content that encourages dangerous challenges, stunts, or
                activities likely to result in serious injury.</li>
          </ul>

          <h3 style={styles.subheading}>2.3 Explicit and Adult Content</h3>
          <ul style={styles.list}>
            <li><strong>Nudity and Sexual Content:</strong> Explicit nudity, pornography, sexual acts, or sexually
                suggestive content. Artistic nudity may be permitted in limited contexts with clear artistic merit.</li>
            <li><strong>Non-Consensual Content:</strong> Intimate images shared without consent, including revenge
                porn, upskirt photos, or hidden camera content.</li>
            <li><strong>Sexual Solicitation:</strong> Content offering or requesting sexual services, adult
                entertainment, or sexual encounters.</li>
            <li><strong>Sexual Exploitation:</strong> Any content that sexualizes, grooms, or exploits individuals,
                particularly minors.</li>
          </ul>

          <h3 style={styles.subheading}>2.4 Hate Speech and Harassment</h3>
          <ul style={styles.list}>
            <li><strong>Hate Speech:</strong> Content that attacks, demeans, dehumanizes, or incites violence
                against individuals or groups based on race, ethnicity, national origin, religion, caste, gender,
                gender identity, sexual orientation, disability, age, or other protected characteristics.</li>
            <li><strong>Hate Symbols:</strong> Display of hate group imagery, symbols, flags, uniforms, or gestures
                associated with hate organizations.</li>
            <li><strong>Harassment and Bullying:</strong> Targeted harassment, cyberbullying, doxxing (sharing
                private information), threats, or coordinated attacks against individuals.</li>
            <li><strong>Slurs and Degrading Content:</strong> Use of racial, ethnic, religious, or other slurs,
                or content designed to demean or degrade individuals or groups.</li>
          </ul>

          <h3 style={styles.subheading}>2.5 Misinformation and Manipulation</h3>
          <ul style={styles.list}>
            <li><strong>Harmful Misinformation:</strong> Demonstrably false information about health, safety,
                elections, or emergencies that could cause significant real-world harm.</li>
            <li><strong>Deepfakes and Manipulated Media:</strong> Deceptive AI-generated or manipulated content
                intended to mislead, impersonate, or spread false information without clear disclosure.</li>
            <li><strong>Impersonation:</strong> Pretending to be another person, organization, or entity to deceive
                or mislead users.</li>
            <li><strong>Coordinated Inauthentic Behavior:</strong> Using multiple accounts, bots, or coordinated
                groups to artificially amplify content or manipulate platform metrics.</li>
          </ul>

          <h3 style={styles.subheading}>2.6 Spam and Abuse</h3>
          <ul style={styles.list}>
            <li><strong>Spam:</strong> Repetitive, unsolicited, or irrelevant content; excessive promotional
                material; or content designed to manipulate engagement.</li>
            <li><strong>Scams and Fraud:</strong> Phishing attempts, pyramid schemes, get-rich-quick schemes, or
                other fraudulent content.</li>
            <li><strong>Malware:</strong> Content containing or linking to viruses, malware, ransomware, or other
                malicious software.</li>
            <li><strong>Platform Manipulation:</strong> Attempts to bypass security measures, exploit vulnerabilities,
                or interfere with platform functionality.</li>
          </ul>

          <h3 style={styles.subheading}>2.7 Privacy Violations</h3>
          <ul style={styles.list}>
            <li><strong>Unauthorized Photos:</strong> Photos of identifiable individuals without their consent,
                particularly in private settings or situations where they have a reasonable expectation of privacy.</li>
            <li><strong>Personal Information:</strong> Sharing others' personal information (addresses, phone numbers,
                social security numbers, financial information) without consent.</li>
            <li><strong>Doxxing:</strong> Publishing private information with malicious intent to harass, intimidate,
                or endanger individuals.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. AI Content Guidelines</h2>
          <p style={styles.paragraph}>
            GemBooth uses AI to transform photos into artistic styles. While we encourage creativity, certain
            AI-generated transformations are prohibited:
          </p>

          <h3 style={styles.subheading}>3.1 Acceptable AI Transformations</h3>
          <ul style={styles.list}>
            <li>Artistic style transfers (Renaissance, Cartoon, Anime, etc.)</li>
            <li>Creative effects and filters that don't misrepresent reality</li>
            <li>Fun transformations clearly intended as entertainment</li>
            <li>Artistic reinterpretations of your own photos</li>
          </ul>

          <h3 style={styles.subheading}>3.2 Prohibited AI Uses</h3>
          <ul style={styles.list}>
            <li><strong>Deceptive Deepfakes:</strong> Creating realistic alterations intended to deceive viewers
                or spread misinformation</li>
            <li><strong>Non-Consensual Transformations:</strong> Transforming photos of others without permission,
                particularly in degrading or sexual contexts</li>
            <li><strong>Harmful Stereotypes:</strong> Using AI to create content that perpetuates harmful stereotypes
                or discriminatory depictions</li>
            <li><strong>Illegal Content Generation:</strong> Using AI to generate any content that would violate
                Section 2 of this policy</li>
          </ul>

          <h3 style={styles.subheading}>3.3 Custom Prompts</h3>
          <p style={styles.paragraph}>
            When using custom AI prompts, users must ensure prompts do not:
          </p>
          <ul style={styles.list}>
            <li>Request generation of prohibited content (nudity, violence, hate speech, etc.)</li>
            <li>Attempt to bypass content filters or safety mechanisms</li>
            <li>Create content that misrepresents individuals or spreads misinformation</li>
            <li>Violate the rights or dignity of identifiable individuals</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. User Responsibilities</h2>
          <p style={styles.paragraph}>
            As a member of the GemBooth community, you are responsible for:
          </p>

          <h3 style={styles.subheading}>4.1 Content You Upload</h3>
          <ul style={styles.list}>
            <li><strong>Own or Have Permission:</strong> Only upload photos you own or have explicit permission to use</li>
            <li><strong>Respect Privacy:</strong> Obtain consent from identifiable individuals in your photos</li>
            <li><strong>Follow Guidelines:</strong> Ensure all uploaded and AI-generated content complies with this policy</li>
            <li><strong>Age Verification:</strong> You must be at least 13 years old to use GemBooth (users 13-17
                require parental consent)</li>
          </ul>

          <h3 style={styles.subheading}>4.2 Community Conduct</h3>
          <ul style={styles.list}>
            <li><strong>Treat Others Respectfully:</strong> Be kind, respectful, and considerate in all interactions</li>
            <li><strong>Report Violations:</strong> Use the reporting tools to flag content that violates this policy</li>
            <li><strong>Don't Abuse Systems:</strong> Don't file false reports or attempt to manipulate moderation
                systems</li>
            <li><strong>Accept Decisions:</strong> Respect moderation decisions or use proper appeal channels</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Reporting Violations</h2>
          <p style={styles.paragraph}>
            We rely on our community to help identify content that violates this policy. If you encounter
            prohibited content:
          </p>

          <h3 style={styles.subheading}>5.1 How to Report</h3>
          <ol style={styles.list}>
            <li><strong>Locate the Report Button:</strong> Find the "Report" or flag icon on the content</li>
            <li><strong>Select Violation Type:</strong> Choose the most appropriate category:
              <ul style={styles.nestedList}>
                <li>Illegal content (CSAM, terrorism, etc.)</li>
                <li>Hate speech or harassment</li>
                <li>Adult or explicit content</li>
                <li>Violence or harmful content</li>
                <li>Spam or scam</li>
                <li>Privacy violation</li>
                <li>Misinformation</li>
                <li>Copyright infringement</li>
                <li>Other</li>
              </ul>
            </li>
            <li><strong>Provide Context:</strong> Add details about why this content violates policy (optional but
                helpful)</li>
            <li><strong>Submit Report:</strong> Click submit; you'll receive a confirmation</li>
          </ol>

          <h3 style={styles.subheading}>5.2 What Happens After Reporting</h3>
          <ul style={styles.list}>
            <li><strong>Immediate Triage:</strong> High-severity reports (CSAM, credible threats) are prioritized
                for immediate review</li>
            <li><strong>Review Process:</strong> Our moderation team reviews reports, typically within 24-48 hours</li>
            <li><strong>Action Taken:</strong> If content violates policy, we remove it and may take action against
                the account</li>
            <li><strong>Reporter Notification:</strong> You'll receive a notification about the outcome of your report</li>
          </ul>

          <h3 style={styles.subheading}>5.3 Emergency Reporting</h3>
          <p style={styles.paragraph}>
            For urgent safety concerns, including:
          </p>
          <ul style={styles.list}>
            <li>Child sexual abuse material (CSAM)</li>
            <li>Imminent threats of violence or self-harm</li>
            <li>Active exploitation or abuse</li>
          </ul>
          <p style={styles.paragraph}>
            Email: <strong>safety@gembooth.com</strong> for immediate escalation
          </p>
          <p style={styles.paragraph}>
            For life-threatening emergencies, contact local law enforcement immediately.
          </p>

          <h3 style={styles.subheading}>5.4 False Reports</h3>
          <p style={styles.paragraph}>
            Filing false reports, spam reports, or abusing the reporting system may result in:
          </p>
          <ul style={styles.list}>
            <li>Warning or notification</li>
            <li>Temporary suspension of reporting privileges</li>
            <li>Account suspension or termination for repeated abuse</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Enforcement Actions</h2>
          <p style={styles.paragraph}>
            When content violates this policy or Terms of Service, we may take the following actions:
          </p>

          <h3 style={styles.subheading}>6.1 Content Removal</h3>
          <ul style={styles.list}>
            <li><strong>Immediate Removal:</strong> Content is deleted from GemBooth servers</li>
            <li><strong>No Notification:</strong> For severe violations (CSAM, terrorism), content is removed
                without notification</li>
            <li><strong>Notification with Explanation:</strong> For most violations, users receive an email
                explaining which policy was violated</li>
            <li><strong>Permanent Deletion:</strong> Removed content cannot be restored (except via successful appeal)</li>
          </ul>

          <h3 style={styles.subheading}>6.2 Account Warnings</h3>
          <ul style={styles.list}>
            <li><strong>First Offense:</strong> Most first-time, minor violations result in a warning</li>
            <li><strong>Educational Notice:</strong> Explanation of violation and guidance on policy compliance</li>
            <li><strong>Warning Accumulation:</strong> Multiple warnings may lead to escalated action</li>
            <li><strong>Warning Period:</strong> Warnings remain on account for 12 months</li>
          </ul>

          <h3 style={styles.subheading}>6.3 Temporary Suspension</h3>
          <ul style={styles.list}>
            <li><strong>Duration:</strong> Typically 7, 14, or 30 days depending on severity</li>
            <li><strong>Account Access:</strong> Unable to log in or use any GemBooth features</li>
            <li><strong>Content Status:</strong> Existing content hidden but not deleted during suspension</li>
            <li><strong>Triggers:</strong> Repeated violations, moderate-severity violations, or multiple warnings</li>
          </ul>

          <h3 style={styles.subheading}>6.4 Permanent Ban</h3>
          <ul style={styles.list}>
            <li><strong>Account Termination:</strong> Permanent loss of access to GemBooth</li>
            <li><strong>Content Deletion:</strong> All photos, GIFs, and user data permanently deleted</li>
            <li><strong>No Refunds:</strong> Subscription fees are not refunded for banned accounts</li>
            <li><strong>Ban Evasion:</strong> Creating new accounts to circumvent a ban results in immediate
                permanent ban</li>
            <li><strong>Triggers:</strong> Severe violations (CSAM, terrorism, severe harassment), repeated
                violations after warnings/suspensions, ban evasion</li>
          </ul>

          <h3 style={styles.subheading}>6.5 Feature Restrictions</h3>
          <p style={styles.paragraph}>
            In some cases, we may restrict specific features instead of full suspension:
          </p>
          <ul style={styles.list}>
            <li>Disable public sharing or gallery features</li>
            <li>Restrict custom prompt usage</li>
            <li>Limit upload frequency or storage</li>
            <li>Require manual review of content before publication</li>
          </ul>

          <h3 style={styles.subheading}>6.6 Law Enforcement Reporting</h3>
          <p style={styles.paragraph}>
            For certain violations, we are required or choose to report to authorities:
          </p>
          <ul style={styles.list}>
            <li><strong>CSAM:</strong> Reported to NCMEC (National Center for Missing and Exploited Children) as
                required by U.S. law</li>
            <li><strong>Credible Threats:</strong> Threats of violence, terrorism, or mass harm reported to law
                enforcement</li>
            <li><strong>Legal Requests:</strong> Compliance with valid court orders, subpoenas, or legal requests</li>
            <li><strong>Evidence Preservation:</strong> Content and account data preserved for law enforcement
                investigations</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Appeals Process</h2>
          <p style={styles.paragraph}>
            If you believe your content was removed or your account was actioned in error, you have the right
            to appeal:
          </p>

          <h3 style={styles.subheading}>7.1 Who Can Appeal</h3>
          <ul style={styles.list}>
            <li>Users whose content was removed</li>
            <li>Users who received warnings</li>
            <li>Users whose accounts were suspended (temporary or permanent)</li>
            <li>Users with feature restrictions</li>
          </ul>
          <p style={styles.paragraph}>
            <em>Note:</em> Appeals for CSAM, terrorism, and certain severe violations may not be accepted.
          </p>

          <h3 style={styles.subheading}>7.2 How to Appeal</h3>
          <ol style={styles.list}>
            <li><strong>Access Appeal Form:</strong> Click "Appeal" in the notification email or visit your
                account settings</li>
            <li><strong>Submit Within 30 Days:</strong> Appeals must be submitted within 30 days of the action</li>
            <li><strong>Explain Your Case:</strong> Clearly explain why you believe the decision was incorrect:
              <ul style={styles.nestedList}>
                <li>Why the content doesn't violate policy</li>
                <li>Context or intent that may have been misunderstood</li>
                <li>Evidence that supports your appeal</li>
              </ul>
            </li>
            <li><strong>Provide Evidence:</strong> Attach relevant documentation, screenshots, or other supporting
                material</li>
            <li><strong>Submit Once:</strong> Submit your appeal only once; duplicate appeals may be ignored</li>
          </ol>

          <h3 style={styles.subheading}>7.3 Appeal Review Process</h3>
          <ul style={styles.list}>
            <li><strong>Independent Review:</strong> Appeals reviewed by different moderator than original decision</li>
            <li><strong>Review Timeline:</strong> Most appeals reviewed within 5-7 business days</li>
            <li><strong>Thorough Assessment:</strong> Fresh review of content, context, and policy application</li>
            <li><strong>Decision Notification:</strong> You'll receive email with appeal outcome and reasoning</li>
          </ul>

          <h3 style={styles.subheading}>7.4 Appeal Outcomes</h3>
          <ul style={styles.list}>
            <li><strong>Appeal Granted:</strong>
              <ul style={styles.nestedList}>
                <li>Content restored to your account</li>
                <li>Account penalty removed</li>
                <li>No impact on account standing</li>
              </ul>
            </li>
            <li><strong>Partial Grant:</strong>
              <ul style={styles.nestedList}>
                <li>Some content restored or penalty reduced</li>
                <li>Explanation of which aspects upheld/overturned</li>
              </ul>
            </li>
            <li><strong>Appeal Denied:</strong>
              <ul style={styles.nestedList}>
                <li>Original decision stands</li>
                <li>Detailed explanation of why policy violation was confirmed</li>
                <li>Decision is final (no further appeals)</li>
              </ul>
            </li>
          </ul>

          <h3 style={styles.subheading}>7.5 Appeal Best Practices</h3>
          <ul style={styles.list}>
            <li>Be respectful and professional in your appeal</li>
            <li>Focus on facts and policy interpretation, not emotions</li>
            <li>Provide specific details about context or intent</li>
            <li>Acknowledge if you made a mistake but deserve a second chance</li>
            <li>Don't submit duplicate appeals or spam the system</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Detection and Moderation Systems</h2>
          <p style={styles.paragraph}>
            We use a multi-layered approach to detect and remove prohibited content:
          </p>

          <h3 style={styles.subheading}>8.1 Automated Detection</h3>
          <ul style={styles.list}>
            <li><strong>AI Content Classifiers:</strong> Machine learning models trained to detect NSFW content,
                violence, hate symbols, and other prohibited material</li>
            <li><strong>Hash Matching:</strong> PhotoDNA and similar technologies to identify known CSAM</li>
            <li><strong>Pattern Recognition:</strong> Detection of spam patterns, bot behavior, and coordinated
                inauthentic activity</li>
            <li><strong>Pre-Upload Scanning:</strong> Content analyzed before upload completes; high-confidence
                violations blocked automatically</li>
          </ul>

          <h3 style={styles.subheading}>8.2 Human Review</h3>
          <ul style={styles.list}>
            <li><strong>Trained Moderators:</strong> Dedicated team trained on policy guidelines, cultural context,
                and edge cases</li>
            <li><strong>Manual Review:</strong> User reports, flagged content, and edge cases reviewed by humans</li>
            <li><strong>Quality Assurance:</strong> Regular audits of automated and human decisions to ensure accuracy</li>
            <li><strong>Escalation:</strong> Complex cases escalated to senior moderators or policy specialists</li>
          </ul>

          <h3 style={styles.subheading}>8.3 Community Reporting</h3>
          <ul style={styles.list}>
            <li><strong>User Reports:</strong> Community members flag potential violations using reporting tools</li>
            <li><strong>Trusted Flaggers:</strong> Experienced users with strong reporting track records may receive
                priority review</li>
            <li><strong>Report Quality:</strong> System learns from high-quality reports to improve detection</li>
          </ul>

          <h3 style={styles.subheading}>8.4 Proactive Monitoring</h3>
          <ul style={styles.list}>
            <li>Random sampling of content for quality assurance</li>
            <li>Monitoring of trending content and viral posts</li>
            <li>Review of content from accounts with prior violations</li>
            <li>Periodic audits of public galleries and featured content</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. Context and Nuance</h2>
          <p style={styles.paragraph}>
            We recognize that content moderation requires human judgment and consideration of context. Content
            that might otherwise violate policy may be allowed if:
          </p>

          <h3 style={styles.subheading}>9.1 Educational or Documentary Value</h3>
          <ul style={styles.list}>
            <li>Historical documentation or archival content</li>
            <li>Educational content with clear pedagogical purpose</li>
            <li>News reporting on important events</li>
            <li>Awareness-raising about social issues</li>
          </ul>

          <h3 style={styles.subheading}>9.2 Artistic Expression</h3>
          <ul style={styles.list}>
            <li>Artistic works with creative merit and clear artistic intent</li>
            <li>Satire, parody, or commentary clearly marked as such</li>
            <li>Performance art or conceptual works</li>
          </ul>

          <h3 style={styles.subheading}>9.3 Context Considerations</h3>
          <p style={styles.paragraph}>
            When evaluating context, we consider:
          </p>
          <ul style={styles.list}>
            <li><strong>Intent:</strong> Was content created to inform, educate, or raise awareness vs. to shock,
                harass, or exploit?</li>
            <li><strong>Audience:</strong> Who is the intended audience and how likely are they to be harmed?</li>
            <li><strong>Setting:</strong> Is content clearly marked, age-gated, or opt-in?</li>
            <li><strong>Cultural Context:</strong> Are there cultural factors that affect interpretation?</li>
            <li><strong>Public Interest:</strong> Is there legitimate public interest in the content?</li>
          </ul>

          <h3 style={styles.subheading}>9.4 Content Warnings and Restrictions</h3>
          <p style={styles.paragraph}>
            For borderline content with legitimate value, we may:
          </p>
          <ul style={styles.list}>
            <li>Add content warnings or sensitive content overlays</li>
            <li>Age-gate content to users 18+</li>
            <li>Limit distribution (prevent trending, exclude from recommendations)</li>
            <li>Require opt-in viewing</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Transparency and Accountability</h2>

          <h3 style={styles.subheading}>10.1 Transparency Reports</h3>
          <p style={styles.paragraph}>
            We publish quarterly transparency reports that include:
          </p>
          <ul style={styles.list}>
            <li>Total content removals by violation category</li>
            <li>Account actions (warnings, suspensions, bans)</li>
            <li>User reports received and actioned</li>
            <li>Appeal statistics (submitted, granted, denied)</li>
            <li>Government requests for content removal or data</li>
            <li>Average response times for reports and appeals</li>
          </ul>

          <h3 style={styles.subheading}>10.2 Policy Evolution</h3>
          <p style={styles.paragraph}>
            This policy is regularly reviewed and updated based on:
          </p>
          <ul style={styles.list}>
            <li>User feedback and community input</li>
            <li>Emerging content threats and trends</li>
            <li>Changes in laws and regulations</li>
            <li>Industry best practices and expert consultation</li>
            <li>Platform feature changes</li>
          </ul>
          <p style={styles.paragraph}>
            Material changes to this policy will be announced via:
          </p>
          <ul style={styles.list}>
            <li>Email notification to registered users</li>
            <li>Prominent in-app notification</li>
            <li>Notice on website with summary of changes</li>
          </ul>

          <h3 style={styles.subheading}>10.3 Continuous Improvement</h3>
          <ul style={styles.list}>
            <li><strong>Moderator Training:</strong> Ongoing training on policy updates, cultural sensitivity, and
                emerging issues</li>
            <li><strong>Quality Audits:</strong> Regular review of moderation decisions to ensure consistency</li>
            <li><strong>Technology Investment:</strong> Continuous improvement of detection systems</li>
            <li><strong>Stakeholder Engagement:</strong> Consultation with safety experts, civil rights organizations,
                and affected communities</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. Limitations and Disclaimers</h2>
          <p style={styles.paragraph}>
            While we are committed to enforcing this policy effectively, users should be aware of inherent
            limitations:
          </p>

          <h3 style={styles.subheading}>11.1 System Limitations</h3>
          <ul style={styles.list}>
            <li><strong>Not Pre-Screening:</strong> We cannot review all content before it's posted (except
                high-risk automated blocks)</li>
            <li><strong>Detection Imperfections:</strong> Automated systems may produce false positives or miss
                violations</li>
            <li><strong>Volume Challenges:</strong> High content volumes may affect response times</li>
            <li><strong>Evolving Threats:</strong> New types of harmful content may not be immediately detected</li>
          </ul>

          <h3 style={styles.subheading}>11.2 Liability</h3>
          <ul style={styles.list}>
            <li>GemBooth is not responsible for user-generated content</li>
            <li>We make good faith efforts to enforce policy but don't guarantee removal of all violations</li>
            <li>Users are solely responsible for content they upload</li>
            <li>Moderation decisions are made in good faith but may involve subjective judgment</li>
          </ul>

          <h3 style={styles.subheading}>11.3 No Guaranteed Response Times</h3>
          <p style={styles.paragraph}>
            While we strive for prompt review, we do not guarantee specific response times for:
          </p>
          <ul style={styles.list}>
            <li>Report review and action</li>
            <li>Appeal processing</li>
            <li>Content restoration</li>
            <li>Account reinstatement</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>12. Contact Information</h2>
          <p style={styles.paragraph}>
            For questions, concerns, or reports related to content moderation:
          </p>

          <h3 style={styles.subheading}>General Inquiries</h3>
          <p style={styles.paragraph}>
            <strong>Email:</strong> moderation@gembooth.com<br />
            <strong>Support:</strong> support@gembooth.com
          </p>

          <h3 style={styles.subheading}>Urgent Safety Concerns</h3>
          <p style={styles.paragraph}>
            For emergencies involving CSAM, imminent threats, or active harm:<br />
            <strong>Email:</strong> safety@gembooth.com<br />
            <strong>Response Time:</strong> Within 2 hours during business hours, 6 hours outside business hours
          </p>

          <h3 style={styles.subheading}>Appeals</h3>
          <p style={styles.paragraph}>
            <strong>Email:</strong> appeals@gembooth.com<br />
            Or use the appeal form in your account settings or notification email
          </p>

          <h3 style={styles.subheading}>Legal and Law Enforcement</h3>
          <p style={styles.paragraph}>
            <strong>Email:</strong> legal@gembooth.com<br />
            For legal requests, court orders, or law enforcement inquiries
          </p>

          <h3 style={styles.subheading}>Mailing Address</h3>
          <p style={styles.paragraph}>
            <strong>GemBooth Pty Ltd</strong><br />
            Content Moderation Team<br />
            [Address]<br />
            Australia
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>13. Policy Acknowledgment</h2>
          <p style={styles.paragraph}>
            By using GemBooth, you acknowledge that:
          </p>
          <ul style={styles.list}>
            <li>You have read, understood, and agree to comply with this Content Moderation Policy</li>
            <li>You understand that violations may result in content removal and account action</li>
            <li>You accept that moderation decisions involve human judgment and may be subjective</li>
            <li>You understand your rights to report violations and appeal decisions</li>
            <li>You acknowledge that this policy may be updated and you're responsible for staying informed
                of changes</li>
          </ul>
          <p style={styles.paragraph}>
            Continued use of GemBooth constitutes ongoing acceptance of this policy and any updates.
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
    flexWrap: 'wrap',
    gap: '16px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
    cursor: 'pointer',
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
  nestedList: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#d1d5db',
    marginTop: '8px',
    marginBottom: '8px',
    paddingLeft: '20px',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'underline',
    cursor: 'pointer',
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
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  separator: {
    color: '#4b5563',
  },
};
