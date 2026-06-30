import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SAM Wheels Bosch Car Service",
  description: "Privacy policy and data protection guidelines for SAM Wheels Bosch Car Service.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="section-padding" style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: 800, marginTop: 100 }}>
          <h1 className="display-lg" style={{ marginBottom: 40 }}>
            PRIVACY <span className="gradient-text">POLICY</span>
          </h1>
          
          <div style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
            <p>
              At <strong>SAM Wheels Bosch Car Service</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), your privacy and the security of your personal data are our highest priorities. This Privacy Policy outlines how we collect, use, and protect your information in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>1. Data We Collect</h2>
            <p>
              We collect personal information necessary to provide you with seamless car servicing and booking experiences. This may include:
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li><strong>Identity Data:</strong> Full Name.</li>
                <li><strong>Contact Data:</strong> Phone Number and Email Address.</li>
                <li><strong>Vehicle Data:</strong> Car Brand and Model.</li>
                <li><strong>Account Data:</strong> Google Profile information if you sign in using Google.</li>
              </ul>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>2. Purpose of Collection</h2>
            <p>
              Your data is collected strictly for the following purposes:
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li>To process and manage your car service bookings.</li>
                <li>To contact you regarding your vehicle&apos;s status and updates.</li>
                <li>To authenticate your identity when accessing &quot;My Bookings&quot;.</li>
                <li>To maintain our service records and billing.</li>
              </ul>
              <em>We do not sell, rent, or trade your personal data to any third parties for marketing purposes.</em>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>3. Data Security & Storage</h2>
            <p>
              Your data is stored securely using enterprise-grade cloud infrastructure (Google Firebase). We employ strict security measures to protect against unauthorized or unlawful use, alteration, or accidental loss of your information. Only you and our authorized administrators can access your personal booking history and account details.
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>4. Information Sharing and Disclosure</h2>
            <p>
              We maintain strict controls over the sharing of your personal data. We do not sell, monetize, or utilize your data for third-party advertising. We may share your information only in the following limited circumstances:
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li>When required by law, court order, or governmental agency for verification of identity, or for the prevention, detection, or investigation of cyber incidents.</li>
                <li>In good faith compliance with applicable legal and regulatory frameworks.</li>
                <li>If SAM Wheels Pvt Ltd is acquired by or merged with another company.</li>
              </ul>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>5. Cookies and Log Files</h2>
            <p>
              Like most standard websites, we use log files and cookies to improve site functionality and user experience. 
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li><strong>Cookies:</strong> We use cookies to maintain your login session securely. These cookies do not contain personally identifiable information and are erased when you log out.</li>
                <li><strong>Log Files:</strong> We collect internet protocol (IP) addresses, browser type, and date/time stamps to analyze trends and administer the site. This automatically collected information is used solely in aggregate to improve our services.</li>
              </ul>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>6. Your Rights (DPDP Act)</h2>
            <p>
              Under the DPDP Act, you possess the following rights regarding your personal data:
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li><strong>Right to Access:</strong> You can view all your data by logging into the &quot;My Bookings&quot; portal.</li>
                <li><strong>Right to Correction:</strong> You can request updates to inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> You can withdraw your consent at any time and request the complete deletion of your account and booking history.</li>
              </ul>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>7. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the DPDP Act, the contact details of the Grievance Officer for data-related complaints are provided below. We shall acknowledge your complaint within 24 hours and dispose of such complaints within 15 days from the date of receipt.
              <br/><br/>
              <strong>Email:</strong> grievance@samwheels.com<br/>
              <strong>Address:</strong> SAM Wheels Pvt Ltd, Opp. Passport Office, Akashvani Lane, Ashiana–Digha Road, Patna, Bihar 800014
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>8. Contact Us</h2>
            <p>
              For general questions or service bookings, please contact us at:
              <br/><br/>
              <strong>Phone:</strong> +91 90283 84499<br/>
              <strong>Address:</strong> Opp. Passport Office, Akashvani Lane, Ashiana–Digha Road, Patna, Bihar 800014
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
