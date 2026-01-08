const AddressInfo = () => {
  return (
    // Changed: Removed 'max-w-[360px]' from parent so it can span full width
    <div className="mb-12 w-full lg:mb-16">
      
      {/* Grid Layout: 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        
        {/* --- Left Column: Text Info --- */}
        <div className="max-w-full">
          <h2 className="mb-6 text-xl font-bold text-black dark:text-white">
            Contact
          </h2>
          <ul className="text-body-color dark:text-body-color-dark space-y-4 text-base leading-relaxed">
            <li>
              📍{" "}
              <span>
                Panchwati Colony, Near Panchayat Bhawan, Muzaffarpur, Bihar –
                842001
              </span>
            </li>
            <li>
              📞{" "}
              <a
                href="tel:+916214007268"
                className="hover:text-primary duration-300"
              >
                +91 62140 07268
              </a>
              {" , "}
              <a
                href="tel:+918092378320"
                className="hover:text-primary duration-300"
              >
                80923 78320
              </a>
            </li>
            <li>
              📧{" "}
              <a
                href="mailto:info@nlitedu.com"
                className="hover:text-primary duration-300"
              >
                info@nlitedu.com
              </a>
            </li>
          </ul>
        </div>

        {/* --- Right Column: Map --- */}
        <div className="h-full w-full min-h-[180px] overflow-hidden rounded-lg shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.670693006323!2d85.37894327599015!3d26.14227899276527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed11000b0e52a9%3A0xe5f7454f0a996f2e!2sPanchwati%20Colony!5e0!3m2!1sen!2sin!4v1704719000000!5m2!1sen!2sin" 
            className="h-full w-full"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;