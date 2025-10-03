// import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import './globals.css'
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets:['latin'],
  weight:['100','200','300','400','500','600','700','800','900'],
  variable:'--font-poppins'
})

export const metadata = {
  title: "CouldVault",
  description: "StoreIt - The only storage solution you need",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
       <main>{children}</main> 
       <Toaster />
        
      </body>
    </html>
  );
}
