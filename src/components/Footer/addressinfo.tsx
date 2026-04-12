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
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3372.750603981014!2d85.35793321060227!3d26.10959619404776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed110070eb3d1f%3A0x103106be3d7f9c22!2sNLIT(Nexgen%20Learning%20Institute%20Of%20Technology)!5e1!3m2!1sen!2sin!4v1767961544718!5m2!1sen!2sin" 
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