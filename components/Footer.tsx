
import React from 'react';
import { BRAND_CONFIG, LinkedInIcon, InstagramIcon, GitHubIcon, XIcon, YoutubeIcon, BlogIcon } from '../constants';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Blog', href: BRAND_CONFIG.socialMedia.blog, icon: <BlogIcon className="w-5 h-5" /> },
    { name: 'LinkedIn', href: BRAND_CONFIG.socialMedia.linkedin, icon: <LinkedInIcon className="w-5 h-5" /> },
    { name: 'Instagram', href: BRAND_CONFIG.socialMedia.instagram, icon: <InstagramIcon className="w-5 h-5" /> },
    { name: 'GitHub', href: BRAND_CONFIG.socialMedia.github, icon: <GitHubIcon className="w-5 h-5" /> },
    { name: 'X', href: BRAND_CONFIG.socialMedia.x, icon: <XIcon className="w-5 h-5" /> },
    { name: 'YouTube', href: BRAND_CONFIG.socialMedia.youtube, icon: <YoutubeIcon className="w-5 h-5" /> },
  ];

  return (
    <footer 
      className="p-4 text-center mt-auto"
      style={{ backgroundColor: BRAND_CONFIG.colors.secondary, color: BRAND_CONFIG.colors.textLight }}
    >
      <div className="container mx-auto">
        <p className="text-sm mb-2" style={{ color: BRAND_CONFIG.colors.primary }}>
          {BRAND_CONFIG.slogan}
        </p>
        <div className="flex justify-center space-x-4 mb-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="hover:opacity-75 transition-opacity"
              style={{ color: BRAND_CONFIG.colors.primary }}
            >
              {link.icon}
            </a>
          ))}
        </div>
        <p className="text-xs" style={{ color: BRAND_CONFIG.colors.textLight }}>
          &copy; {new Date().getFullYear()} {BRAND_CONFIG.longName}. All rights reserved.
        </p>
        <p className="text-xs mt-1" style={{ color: BRAND_CONFIG.colors.textLight }}>
          Developed by Adhithya J [ AI Products Engineering Team ]
        </p>
        <p className="text-xs mt-1">
          Contact: <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:underline" style={{ color: BRAND_CONFIG.colors.primary }}>{BRAND_CONFIG.email}</a> | 
          Phone: <span style={{ color: BRAND_CONFIG.colors.primary }}>{BRAND_CONFIG.mobile}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
