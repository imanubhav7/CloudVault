'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [user,setUser] = useState(null)
    useEffect(() => {
      fetch('/api/me')
      .then((res) => res.json())
      .then((data)=> setUser(data.user))
      .catch(() => setUser(null))
    },[])
  return (
  <h1 className="bg-brand-100 h-[840px] rounded-3xl flex justify-center items-center max-w-[98%]"> This is Cloud Vault</h1>
  );
}
