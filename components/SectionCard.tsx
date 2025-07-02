
import React from 'react';

interface SectionCardProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ id, title, description, children }) => {
  return (
    <div id={id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6 lg:p-8 mb-12 scroll-mt-24">
      <h2 className="text-3xl font-bold text-cyan-400 mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-4xl">{description}</p>
      <div className="w-full min-h-[400px] lg:min-h-[500px] relative">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
