"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/constansts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import FileUploader from "./FileUploader";

const MobileNavigation = ({ fullName, email, ownerId }) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className="flex justify-between h-[60px] items-center px-5 sm:hidden">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        width={120}
        height={52}
        alt="logo"
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen} className='pt-0 flex justify-start items-start'>
        <SheetTrigger >
          <Image
            src="/assets/icons/menu.svg"
            width={40}
            height={40}
            alt="logo"
          />
        </SheetTrigger>
        <SheetContent className="h-screen shad-sheet px-3">
          <SheetHeader className='text-start'>
            <SheetTitle>
              <div className="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3">
                <Image
                  alt="avatar"
                  src="/assets/images/avatar.png"
                  width={44}
                  height={44}
                  className="aspect-square w-10 rounded-full object-cover"
                />

                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>

              <Separator className="bg-ligh-200/20 my-4" />
            </SheetTitle>
            <nav className="h-5 flex-1 gap-1 text-brand">
              <ul className="flex flex-1 flex-col gap-4">
                {navItems.map(({ url, name, icon }) => (
                  <Link href={url} key={name} className="lg:w-full ">
                    <li
                      className={cn(
                        "mobile-nav-item",
                        pathName === url && "shad-active"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "nav-icon",
                          pathName === url && "nav-icon-active"
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>

            <Separator className="bg-ligh-200/20 my-4" />

            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader/>
              <Button className="h5 flex h-[52px] w-full items-center gap-4 rounded-full bg-brand/10 px-6 text-brand shadow-none transition-all hover:bg-brand/20"
              onClick={() => {}}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                  
                />
                <p>Logout</p>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
