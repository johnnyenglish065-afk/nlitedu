import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | NLITedu",
  description: "Shipping and delivery policy for the NLITedu platform.",
};

const ShippingPolicyPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Shipping Policy"
        description="Details regarding shipping timelines, partners, and delivery procedures."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-10/12">
              <div className="mb-10 rounded-sm bg-white px-8 py-10 shadow-three dark:bg-gray-dark sm:p-[60px]">
                <h2 className="mb-8 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Shipping & Delivery
                </h2>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We strive to ensure your orders reach you as quickly and safely as possible.
                </p>

                <ul className="mb-12 list-disc space-y-6 pl-5 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>
                    <p>
                      <strong>Shipping Partners:</strong> Orders are shipped through registered domestic courier companies and/or speed post only.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Processing Timeline:</strong> Orders are typically shipped within 7 days from the date of the order and payment, or as per the agreed delivery date at the time of confirmation.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Delivery Liability:</strong> While we ensure timely dispatch, the Platform Owner shall not be liable for any delays in delivery caused by the courier company or postal authority.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Shipping Address:</strong> All orders will be delivered to the address provided by the buyer at the time of purchase. Please ensure the address is accurate and complete.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Confirmations:</strong> Delivery and dispatch details will be confirmed via the email address you provided during registration.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Shipping Costs:</strong> Any shipping costs levied at the time of purchase are non-refundable.
                    </p>
                  </li>
                </ul>

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

export default ShippingPolicyPage;
