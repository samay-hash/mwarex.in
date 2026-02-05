export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-white/60">Last updated: January 17, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            1. Acceptance of Terms
          </h2>
          <p className="text-white/80 leading-relaxed md:text-lg">
            By accessing and using MwareX, you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use
            our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            2. Service Description
          </h2>
          <p className="text-white/80 leading-relaxed">
            MwareX provides a workflow automation tool for YouTube creators and
            editors. It allows for video file uploads, review processes, and
            automated uploading to YouTube via the YouTube Data API.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials.
            </li>
            <li>
              You agree not to upload content that violates YouTube's Community
              Guidelines or Terms of Service.
            </li>
            <li>
              You retain all rights to the video content you upload, but grant
              MwareX a limited license to store and process it for the purpose
              of the service.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            4. YouTube API Services
          </h2>
          <p className="text-white/80 leading-relaxed">
            Our service users YouTube API Services. By using MwareX, you also
            agree to be bound by the{" "}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              className="underline text-blue-400"
            >
              YouTube Terms of Service
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#FF4D4D]">
            5. Termination
          </h2>
          <p className="text-white/80 leading-relaxed">
            We reserve the right to terminate or suspend your access to MwareX
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
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
          <h2 className="text-xl font-semibold text-[#FF4D4D]">7. Contact</h2>
          <p className="text-white/80 leading-relaxed">
            Questions? Contact us at{" "}
            <a
              href="mailto:founder.samay@gmail.com"
              className="text-blue-400 underline"
            >
              founder.samay@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
