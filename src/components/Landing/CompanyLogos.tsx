import React from 'react';
import { motion } from 'framer-motion';

const companies = [
  { name: 'Goldman Sachs', logo: 'GS' },
  { name: 'JPMorgan', logo: 'JPM' },
  { name: 'BlackRock', logo: 'BR' },
  { name: 'Fidelity', logo: 'FID' },
  { name: 'Vanguard', logo: 'VG' },
  { name: 'Charles Schwab', logo: 'CS' },
  { name: 'Morgan Stanley', logo: 'MS' },
  { name: 'Bank of America', logo: 'BAC' },
  { name: 'Wells Fargo', logo: 'WFC' },
  { name: 'Citigroup', logo: 'C' },
];

const CompanyLogos: React.FC = () => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-green-400">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join the ranks of Fortune 500 companies and institutional investors who trust EarnParkPro
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -100 * companies.length] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex space-x-8"
          >
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 bg-gray-700/50 border border-gray-600 rounded-xl p-6 w-48 h-24 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{company.logo}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{company.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400">
            Over <span className="text-green-400 font-semibold">500+ institutional partners</span> worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyLogos;