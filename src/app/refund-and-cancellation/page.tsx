import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Cancellation | NLITedu",
  description: "Refund and cancellation policy for the NLITedu platform.",
};

const RefundAndCancellationPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Refund & Cancellation"
        description="Clear policies regarding cancellations, refunds, and returns."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-10/12">
              <div className="mb-10 rounded-sm bg-white px-8 py-10 shadow-three dark:bg-gray-dark sm:p-[60px]">
                <h2 className="mb-8 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Cancellation Policy
                </h2>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  This policy outlines the procedure for cancellations and refunds for products or services purchased through the NLITedu Platform.
                </p>

                <ul className="mb-12 list-disc space-y-6 pl-5 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>
                    <p>
                      <strong>Cancellation Window:</strong> Cancellations will only be considered if the request is made within 14 days of placing the order.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Processed Orders:</strong> Cancellation requests may not be entertained if the orders have been communicated to sellers/merchants and they have initiated the shipping process. In such events, you may choose to reject the product at the doorstep.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Damaged or Defective Items:</strong> Please report damaged or defective items to our customer service team within 14 days of receipt. The request will be processed once the seller/merchant has determined the defect at their end.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Expectation Mismatch:</strong> If you feel the product is not as shown on the site, you must bring it to the notice of customer service within 14 days of receiving the product.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Manufacturer Warranty:</strong> For products with manufacturer warranties, please refer issues directly to the manufacturer.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Refund Processing:</strong> Approved refunds will take approximately 3 days to process.
                    </p>
                  </li>
                </ul>

                <h2 className="mb-8 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Return & Exchange Policy
                </h2>
                <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  We offer a 7-day return and exchange window for eligible purchases.
                </p>

                <ul className="mb-12 list-disc space-y-6 pl-5 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
                  <li>
                    <p>
                      <strong>Eligibility:</strong> Items must be unused, in their original packaging, and in the same condition as received. Sale items may not be eligible for returns.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Replacements:</strong> Items are only replaced if they are found to be defective or damaged.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Exemptions:</strong> Certain categories of products may be exempt from returns. These will be identified at the time of purchase.
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

export default RefundAndCancellationPage;
