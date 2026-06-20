import React from 'react';
import { motion } from 'motion/react';
import { SCHOOL_INFO } from '@/src/constants';
import { Shield, Award, Users, BookOpen } from 'lucide-react';

interface HouseDetail {
  name: string;
  shortName: string;
  color: string;
  accentColor: string;
  textColor: string;
  description: string;
}

export default function SchoolHouses() {
  const houses = (SCHOOL_INFO as any).housesDetail as HouseDetail[] || [];

  return (
    <div className="space-y-12 py-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 text-red-600 rounded-full text-xs font-black uppercase tracking-widest"
        >
          <Shield size={12} />
          The Noble Houses
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--foreground)]">
          Mfantsipim <span className="text-red-600">Houses</span>
        </h2>
        <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed">
          The foundation of discipline, camaraderie, and healthy rivalry at Kwabotwe. Every alumnus proudly associates with their house and carries its values for a lifetime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
        {houses.map((house, idx) => {
          // Determine an icon based on index to create aesthetic variety
          const icons = [Shield, Award, Users, BookOpen];
          const IconComponent = icons[idx % icons.length];

          return (
            <motion.div
              key={house.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              style={{ 
                borderColor: house.color,
                background: `linear-gradient(135deg, var(--card) 0%, var(--card) 70%, ${house.accentColor} 100%)`
              }}
              className="relative p-6 rounded-2xl border-l-[6px] border border-y-[var(--border)] border-r-[var(--border)] shadow-sm flex flex-col justify-between h-full bg-[var(--card)] transition-shadow duration-300 group"
              id={`school-house-card-${house.shortName.toLowerCase()}`}
            >
              <div>
                {/* Decorative house color ring */}
                <div className="flex items-center justify-between mb-6">
                  <div 
                    style={{ backgroundColor: house.accentColor, color: house.color }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                    id={`school-house-icon-${house.shortName.toLowerCase()}`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <span 
                    style={{ color: house.color }}
                    className="text-[10px] font-black uppercase tracking-widest"
                  >
                    Est. Heritage
                  </span>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--foreground)] mb-3 group-hover:text-red-600 transition-colors">
                  {house.name}
                </h3>
                
                <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-6">
                  {house.description}
                </p>
              </div>

              {/* Bottom house color indicator tag */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between mt-auto">
                <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">
                  Official Color
                </span>
                <div className="flex items-center space-x-2">
                  <span 
                    style={{ backgroundColor: house.color }} 
                    className="w-3 h-3 rounded-full shadow-sm block" 
                  />
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    {house.shortName}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
