'use client';

import { SiGmail } from 'react-icons/si';

export default function EmailLink() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const parts = ['lalith2023', '@', 'gmail', '.', 'com'];
    const email = parts.join('');
    window.location.href = `mailto:${email}`;
  };

  return (
    <a 
      href="#"
      onClick={handleEmailClick}
      aria-label="Email"
      className="text-gray-400 hover:text-white transition-colors"
      data-email="lalith2023@gmail.com"
    >
      <SiGmail size={24} />
    </a>
  );
} 