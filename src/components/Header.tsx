
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
              <span className="text-primary-foreground text-lg font-bold">C</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">CalorieTracker</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/upload" className="text-sm font-medium transition-colors hover:text-primary">
            Food Scanner
          </Link>
          <Link to="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            Profile
          </Link>
        </nav>
        
        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/upload">Food Scanner</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
