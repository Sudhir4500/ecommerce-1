import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 ">
      <div className="container mx-auto flex flex-wrap justify-between  ">
        {/* Customer Service Section */}
        <div className="w-full md:w-1/2 lg:w-1/5 mb-6">
          <h3 className="text-lg font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link href="/contact-us" className="hover:text-gray-400">Contact us</Link></li>
            <li><Link href="/faqs" className="hover:text-gray-400">FAQs</Link></li>
          </ul>
        </div>

        {/* Orders Section */}
        <div className="w-full md:w-1/2 lg:w-1/5 mb-6">
          <h3 className="text-lg font-bold mb-4">Orders</h3>
          <ul className="space-y-2">
            <li><Link href="/orders-and-delivery" className="hover:text-gray-400">Orders and delivery</Link></li>
            <li><Link href="/returns-and-refunds" className="hover:text-gray-400">Returns and refunds</Link></li>
          </ul>
        </div>

        {/* Payment Section */}
        <div className="w-full md:w-1/2 lg:w-1/5 mb-6">
          <h3 className="text-lg font-bold mb-4">Payment</h3>
          <ul className="space-y-2">
            <li><Link href="/payment-and-pricing" className="hover:text-gray-400">Payment and pricing</Link></li>
            <li><Link href="/promotion-terms-and-conditions" className="hover:text-gray-400">Promotion terms and conditions</Link></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="w-full md:w-1/2 lg:w-1/5 mb-6">
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/privacy-policy" className="hover:text-gray-400">Privacy policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-gray-400">Terms and conditions</Link></li>
            <li><Link href="/accessibility" className="hover:text-gray-400">Accessibility</Link></li>
            <li><Link href="/sitemap" className="hover:text-gray-400">Sitemap</Link></li>
          </ul>
        </div>

        {/* Get Updates Section */}
        <div className="w-full md:w-1/2 lg:w-1/5 mb-6">
          <h3 className="text-lg font-bold mb-4">Get Updates</h3>
          <form className="flex flex-col">
            <input
              type="email"
              placeholder="Your email address"
              className="p-2 my-2 text-gray-900 rounded"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;