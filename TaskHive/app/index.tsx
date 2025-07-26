import { useRouter } from "expo-router";
import { useEffect, useState } from "react";


export default function Index() {
  const router = useRouter();
 

  useEffect(() => {
    
      
      router.replace("/splash");
    }, []); 

    return null;
}
