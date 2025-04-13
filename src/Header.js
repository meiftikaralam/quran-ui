import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/alameducity.png';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="alameducity.com" 
            className="h-10 w-auto cursor-pointer" 
            onClick={handleLogoClick}
          />
          <span className="hidden md:inline-block text-sm text-muted-foreground">Learn, Excel & Enlighten</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/home" className="text-sm font-medium transition-colors hover:text-primary">
            Settings
          </Link>
          <Link to="/quran" className="text-sm font-medium transition-colors hover:text-primary">
            The Holy Quran
          </Link>
          <Link to="/read" className="text-sm font-medium transition-colors hover:text-primary">
            Read Quran
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <Link 
                  to="/home" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={closeMenu}
                >
                  Settings
                </Link>
                <Link 
                  to="/quran" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={closeMenu}
                >
                  The Holy Quran
                </Link>
                <Link 
                  to="/read" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={closeMenu}
                >
                  Read Quran
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
