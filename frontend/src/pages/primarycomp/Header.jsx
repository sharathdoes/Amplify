import React, { useEffect } from 'react';
import { Sheet, SheetTrigger, SheetContent } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import image from '../../assets/image.jpeg'; // Import the image
import { useNavigate } from 'react-router-dom';


export default function Component() {
  const navigate=useNavigate();
  const handleC=()=>{
    navigate('/');
  };
  const handleCl=()=>{
    navigate('/about');
  };
  const handleCli=()=>{
    navigate('/recruit');
  };
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <a href="#" className="mr-6 hidden lg:flex items-center">
            <img src={image} alt="Acme Inc" className="h-12 w-12" /> Increased image size
            <span className="ml-2 text-black font-bold">Amplify</span> {/* Added text beside the image */}
          </a>
          <div className="grid gap-2 py-6">
            <a onClick={handleC} href="#" className="flex w-full items-center py-2 text-lg font-semibold">
              Home
            </a>
            <a href="#" className="flex w-full items-center py-2 text-lg font-semibold">
              About
            </a>
            <a href="#" className="flex w-full items-center py-2 text-lg font-semibold">
              Services
            </a>
            <a href="#" className="flex w-full items-center py-2 text-lg font-semibold">
              Contact
            </a>
          </div>
        </SheetContent>
      </Sheet>
      <a href="#" className="mr-6 hidden lg:flex items-center">
        <img src={image} alt="Acme Inc" className="h-12 w-12" /> {/* Increased image size */}
        <span className="ml-2 text-black text-lg font-bold">Amplify</span> {/* Added text beside the image */}
      </a>
      <nav className="ml-auto hidden lg:flex gap-6">
        <a onClick={handleC}
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md   px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          Home
        </a>
        <a onClick={handleCl}
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md   px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          About
        </a>
       
        <a onClick={handleCli}
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md   px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          Recruit
        </a>
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
