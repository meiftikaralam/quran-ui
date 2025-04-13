import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Alame City. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/meiftikaralam/quran-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://alameducity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
