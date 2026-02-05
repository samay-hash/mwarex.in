export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-white/60">Last updated: January 17, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            1. Introduction
          </h2>
          <p className="text-white/80 leading-relaxed md:text-lg">
            Welcome to MwareX. We value your privacy. This Privacy Policy
            explains how we collect, use, and protect your information when you
            use our YouTube approval and video upload services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>
              <strong>Google User Data:</strong> When you connect your YouTube
              account, we access your basic profile information (name, email)
              and your YouTube channel details to facilitate video uploads.
            </li>
            <li>
              <strong>Uploaded Content:</strong> Videos you upload to our
              platform for review.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you interact with
              our dashboard (approvals, rejections).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            3. How We Use Your Data
          </h2>
          <p className="text-white/80 leading-relaxed">
            We use your data solely to provide the MwareX service:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>To authenticate you via Google Sign-In.</li>
            <li>
              To upload approved videos directly to your YouTube channel as
              drafts/private videos (using the YouTube Data API).
            </li>
            <li>
              To manage the collaboration workflow between Creators and Editors.
            </li>
          </ul>
          <p className="text-white/60 mt-2 italic">
            We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            4. Limited Use Disclosure
          </h2>
          <p className="text-white/80 leading-relaxed">
            MwareX's use and transfer to any other app of information received
            from Google APIs will adhere to{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              className="underline text-blue-400"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            5. Data Storage
          </h2>
          <p className="text-white/80 leading-relaxed">
            Video files are temporarily stored on our secure cloud servers
            (Cloudinary) to facilitate the review process. Once approved and
            uploaded to YouTube, we may retain a copy for your history logs or
            delete it based on retention policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            6. Data Protection and Security
          </h2>
          <p className="text-white/80 leading-relaxed">
            We take the security of user data seriously. All user data accessed
            through Google APIs is protected using industry-standard security
            measures.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>Data is transmitted over secure HTTPS (TLS encryption).</li>
            <li>
              Access to user data is restricted to authorized services only.
            </li>
            <li>
              We do not sell, rent, or share user data with third parties.
            </li>
            <li>
              OAuth access tokens are securely stored and used only for the
              stated application functionality.
            </li>
            <li>
              User data is retained only as long as necessary to provide the
              requested features and is deleted upon user request.
            </li>
          </ul>
          <p className="text-white/80 leading-relaxed">
            The application complies with Google API Services User Data Policy,
            including Limited Use requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            7. Contact Us
          </h2>
          <p className="text-white/80 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
            <a
              href="mailto:support@mwarex.com"
              className="text-blue-400 underline"
            >
              support@mwarex.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
