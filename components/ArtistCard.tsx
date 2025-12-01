/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { PropertyFeature } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  artist: PropertyFeature; // Keeping prop name 'artist' to minimize refactor friction in parent, but treating as feature
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ artist: feature, onClick }) => {
  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-gray-200 bg-white cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={feature.image} 
          alt={feature.title} 
          className="h-full w-full object-cover will-change-transform"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-serif tracking-widest bg-white/90 text-black px-3 py-1 backdrop-blur-md uppercase">
             {feature.tag}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black p-3 will-change-transform"
           >
             <ArrowUpRight className="w-5 h-5" />
           </motion.div>
        </div>

        <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent -mx-6 -mb-6 p-6 md:p-8 pt-20">
          <div className="overflow-hidden">
            <motion.h3 
              className="font-serif text-2xl md:text-3xl font-medium text-white will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {feature.title}
            </motion.h3>
          </div>
          <motion.p 
            className="text-sm font-light text-gray-200 mt-2 will-change-transform"
            variants={{
              rest: { opacity: 0.8, y: 0 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {feature.subtitle}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;