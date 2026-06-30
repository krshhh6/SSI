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
              Your data is stored securely using enterprise-grade cloud infrastructure (Google Firebase). We implement strict security rules to ensure that your personal booking history and account details can only be accessed by you and our authorized administrators.
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>4. Your Rights (DPDP Act)</h2>
            <p>
              Under the DPDP Act, you possess the following rights regarding your personal data:
              <ul style={{ listStyle: "disc", paddingLeft: 24, marginTop: 12 }}>
                <li><strong>Right to Access:</strong> You can view all your data by logging into the &quot;My Bookings&quot; portal.</li>
                <li><strong>Right to Correction:</strong> You can request updates to inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> You can withdraw your consent at any time and request the complete deletion of your account and booking history.</li>
              </ul>
            </p>

            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", marginTop: 20 }}>5. Contact Us</h2>
            <p>
              If you wish to exercise your data rights, request data deletion, or have any questions about this Privacy Policy, please contact our Data Protection Officer at:
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
