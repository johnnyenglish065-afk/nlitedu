import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NLITedu",
  description: "Privacy policy for the NLITedu platform.",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Privacy Policy"
        description="We value your privacy and are committed to protecting your personal data."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-10/12">
              <div className="mb-10 rounded-sm bg-white px-8 py-10 shadow-three dark:bg-gray-dark sm:p-[60px]">
                <h2 className="mb-8 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Introduction
                </h2>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  This Privacy Policy describes how <strong>8092378320</strong> and its affiliates (collectively &quot;8092378320, we, our, us&quot;) collect, use, share, protect or otherwise process your information/ personal data through our website <a href="https://www.nlitedu.com/" className="text-primary hover:underline">https://www.nlitedu.com/</a> (hereinafter referred to as Platform).
                </p>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy and the Terms of Use. If you do not agree please do not use or access our Platform.
                </p>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  1. Collection of Information
                </h3>
                <p className="mb-6 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship. This includes:
                </p>
                <ul className="mb-8 list-disc space-y-3 pl-5 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>Personal details: Name, Date of Birth, Address, Telephone/Mobile number, Email ID.</li>
                  <li>Sensitive personal data: Bank account or credit/debit card information (with your consent).</li>
                  <li>Behavioral data: Tracking your preferences and interactions on our Platform.</li>
                  <li>Transaction data: Details related to your purchases and interactions with business partners.</li>
                </ul>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  2. Usage of Personal Data
                </h3>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We use your personal data to provide requested services, resolve disputes, troubleshoot problems, and enhance your customer experience. We may also use it to inform you about offers, products, and services that may interest you. You will always have the ability to opt-out of marketing communications.
                </p>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  3. Sharing of Personal Data
                </h3>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We may share your data with group entities, affiliates, and third-party service providers (such as logistics and payment partners) to fulfill orders and comply with legal obligations. We may also disclose information to law enforcement agencies if required by law or to protect the safety of our users.
                </p>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  4. Security Precautions
                </h3>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We adopt reasonable security practices and procedures to protect your data from unauthorized access, loss, or misuse. While we strive to protect your information, transmission over the internet is not 100% secure, and you acknowledge the inherent risks.
                </p>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  5. Data Deletion and Retention
                </h3>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  You can delete your account through your profile settings. We retain your data only for as long as necessary for the purposes it was collected or as required by law. We may continue to retain anonymized data for research and analytical purposes.
                </p>

                <h3 className="mb-4 mt-12 text-xl font-bold text-black dark:text-white">
                  6. Your Rights and Consent
                </h3>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  You have the right to access, rectify, and update your personal data. By using our Platform, you consent to our collection and processing of your data as described here. You may withdraw your consent at any time by contacting our Grievance Officer.
                </p>

                <div className="mt-12 rounded-sm border border-body-color border-opacity-10 bg-slate-50 p-8 dark:border-white dark:border-opacity-10 dark:bg-slate-900/50">
                  <h4 className="mb-4 text-lg font-bold text-black dark:text-white">
                    Grievance Officer
                  </h4>
                  <p className="mb-2 text-base font-medium text-body-color dark:text-body-color-dark">
                    <strong>Name:</strong> Legal Support Team
                  </p>
                  <p className="mb-2 text-base font-medium text-body-color dark:text-body-color-dark">
                    <strong>Address:</strong> near Panchyat Bhawan, Panchwati Colony, Gobarsahi, Muzaffarpur, Bihar 842001
                  </p>
                  <p className="text-base font-medium text-body-color dark:text-body-color-dark">
                    <strong>Contact:</strong> Monday - Friday (9:00 - 18:00)
                  </p>
                </div>

                <div className="mt-12 border-t border-body-color border-opacity-10 pt-10 dark:border-white dark:border-opacity-10">
                  <p className="text-base font-medium text-body-color dark:text-body-color-dark">
                    Last updated on: May 16, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
