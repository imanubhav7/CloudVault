import Image from "next/image";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] flex-col justify-center space-y-12 max-w-[430px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={82}
            width={230}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">Where Your Files Work for You</h1>
            <p className="body-1">The Luxe Home for Your Files</p>
            <Image
              src="/assets/images/files.png"
              height={350}
              width={350}
              className="transition-all hover:rotate-6 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
            <Image
            src='/assets/icons/logo-full-brand.svg'
            height={230}
            width={82}
            className="h-auto w-[200px] lg:w-[250px]"
            />
        </div>

      {children}
      </section>
    </div>
  );
};

export default Layout;
