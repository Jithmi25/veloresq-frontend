import React from "react";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";

type LegalPageType = "terms" | "privacy";

interface LegalPageProps {
  type: LegalPageType;
}

const termsSections = [
  {
    title: "Using Veloresq",
    paragraphs: [
      "Veloresq connects vehicle owners with automotive service providers, roadside assistance, battery charging, and vehicle diagnosis tools. By using the platform, you agree to use it lawfully and provide accurate information.",
      "You are responsible for keeping your account credentials secure and for activity carried out through your account. Please contact us promptly if you believe your account has been used without permission.",
    ],
  },
  {
    title: "Services and bookings",
    paragraphs: [
      "Service descriptions, availability, pricing, and estimated times are provided by participating garages or service partners. A booking is subject to confirmation by the selected provider.",
      "You may cancel or reschedule a booking according to the provider's stated policy. Veloresq is not responsible for a provider's workmanship, delays, or changes to an offered service, but we will help you contact the provider when possible.",
    ],
  },
  {
    title: "Payments and subscriptions",
    paragraphs: [
      "Any applicable charges are shown before you confirm a purchase or booking. Subscription plans renew according to the terms displayed at checkout until you cancel them.",
      "We may suspend or discontinue access when an account violates these terms, creates a security risk, or uses the platform fraudulently. We will provide notice where reasonably possible.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update these terms as Veloresq evolves. The latest version will always be published on this page, and material changes will be communicated through the platform where appropriate.",
      "Questions about these terms can be sent to hello@veloresq.com.",
    ],
  },
];

const privacySections = [
  {
    title: "Information we collect",
    paragraphs: [
      "We collect information you provide, such as your name, contact details, vehicle information, account credentials, bookings, and messages to service providers. We also receive technical information needed to keep the platform working, such as device and usage data.",
      "When you use location-enabled features, we use your location only as needed to help find nearby garages or provide a requested service. You can manage location permissions through your device settings.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "We use your information to create and secure your account, process bookings and payments, connect you with service providers, provide support, improve our products, and send service-related communications.",
      "We do not sell your personal information. We share the information needed to fulfill a booking with the relevant garage or service partner, and with trusted providers that help us operate Veloresq under appropriate confidentiality obligations.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You can review or update account information from your profile, unsubscribe from optional marketing messages, and request access to or deletion of your personal information by contacting us.",
      "Some information may be retained where required for legal, security, fraud-prevention, or transaction-record purposes.",
    ],
  },
  {
    title: "Updates and contact",
    paragraphs: [
      "We may update this policy when our services or legal obligations change. We will post the updated policy here and revise the effective date below.",
      "For privacy questions or requests, contact hello@veloresq.com.",
    ],
  },
];

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isTerms = type === "terms";
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div className="bg-gray-light py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-secondary/5">
          <div className="bg-secondary px-6 py-10 text-accent sm:px-10 sm:py-12">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary">
              {isTerms ? (
                <FileText className="h-6 w-6" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Veloresq legal
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {isTerms ? "Terms and Conditions" : "Privacy Policy"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-accent/70">
              Effective October 1, 2026. This page explains the rules and
              information practices that apply when you use Veloresq.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="space-y-9">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="mb-3 text-xl font-bold text-secondary">
                    {section.title}
                  </h2>
                  <div className="space-y-3 text-[15px] leading-7 text-gray-600">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
