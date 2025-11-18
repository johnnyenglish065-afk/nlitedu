const AddressInfo = () => {
  return (
    <div className="mb-12 max-w-[360px] lg:mb-16">
      <h2 className="mb-6 text-xl font-bold text-black dark:text-white">
        Contact
      </h2>
      <ul className="text-body-color dark:text-body-color-dark space-y-4 text-base leading-relaxed">
        <li>
          📍{" "}
          <span>
            Panchwati Colony, Near Panchayat Bhawan, Muzaffarpur, Bihar – 842001
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
  );
};

export default AddressInfo;
