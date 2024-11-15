import React, {useRef,useState} from "react";
import { useInView, motion, AnimatePresence} from "framer-motion";
import { Icon } from '@iconify/react';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormStatus('success');
    setTimeout(() => setFormStatus(null), 3000);
    setFormState({ name: '', email: '', message: '', subject: '' });
  };

  const contactInfo = [
    {
      icon: "mdi:map-marker",
      title: "Visit Us",
      content: "97, Rue de Palestine 2ème étage 1002 TUNIS",
      color: "blue"
    },
    {
      icon: "mdi:phone",
      title: "Call Us",
      content: "(+216) 71 802 881",
      color: "green"
    },
    {
      icon: "mdi:email",
      title: "Email Us",
      content: "reservation.batouta@gmail.com",
      color: "purple"
    }
  ];

  return (
    <section ref={ref} id="contact" className="relative py-24 px-6 bg-gradient-to-b from-white to-gray-50 isolate">
      {/* Decorative elements with pointer-events-none */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" className="text-orange-500" />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-purple-600 text-transparent bg-clip-text">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our services,
            pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 z-100">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-white rounded-3xl shadow-xl p-8 z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-purple-50 opacity-50 rounded-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div className="relative">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      required
                    />
                  </motion.div>
                  <motion.div className="relative">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      required
                    />
                  </motion.div>
                </div>
                
                <motion.div className="relative">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div className="relative">
                  <textarea
                    placeholder="Your Message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg font-semibold relative overflow-hidden"
                  disabled={formStatus === 'sending'}
                >
                  <AnimatePresence mode="wait">
                    {formStatus === 'sending' ? (
                      <motion.div
                        key="sending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </motion.div>
                    ) : formStatus === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center text-white"
                      >
                        <Icon icon="mdi:check" className="w-5 h-5 mr-2" />
                        Message Sent!
                      </motion.div>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 z-20"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-${info.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon icon={info.icon} className={`w-6 h-6 text-${info.color}-500`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                    <p className="text-gray-600">{info.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map with proper z-index */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg z-20"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5726527330544!2d10.181673!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0x7c56c6c3cd5d6403!2s97%20Rue%20de%20Palestine%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1699372841010!5m2!1sen!2s"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

  
  export default Contact;
 


// import React, {useRef} from "react";
// import { useInView, motion} from "framer-motion";
// import { Icon } from '@iconify/react';

// const Contact = () => {
//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true });
  
//     return (
//       <section ref={ref} className="py-24 px-6 bg-white relative overflow-hidden">
//         <div className="max-w-6xl mx-auto">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
//             transition={{ duration: 0.6 }}
//             className="text-4xl font-bold text-center mb-16 text-gray-800"
//           >
//             Contact Us
//           </motion.h2>
  
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Contact Information */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="space-y-8"
//             >
//               <div className="bg-white rounded-2xl p-8 shadow-lg">
//                 <h3 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h3>
                
//                 <div className="space-y-6">
//                   {/* Address */}
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Icon icon="mdi:map-marker" className="w-6 h-6 text-blue-500" />
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
//                       <p className="text-gray-600">97, Rue de Palestine 2ème étage 1002 TUNIS</p>
//                     </div>
//                   </div>
  
//                   {/* Phone */}
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0">
//                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                         <Icon icon="mdi:phone" className="w-6 h-6 text-green-500" />
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-700 mb-1">Phone</h4>
//                       <p className="text-gray-600">(+216) 71 802 881</p>
//                     </div>
//                   </div>
  
//                   {/* Email */}
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-shrink-0">
//                       <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
//                         <Icon icon="mdi:email" className="w-6 h-6 text-purple-500" />
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
//                       <p className="text-gray-600">reservation.batouta@gmail.com</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
  
//             {/* Map */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="relative h-96 rounded-2xl overflow-hidden shadow-lg"
//             >
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5726527330544!2d10.181673!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0x7c56c6c3cd5d6403!2s97%20Rue%20de%20Palestine%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1699372841010!5m2!1sen!2s"
//                 className="w-full h-full border-0"
//                 allowFullScreen=""
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               ></iframe>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//     );
//   };
  
//   export default Contact;
 