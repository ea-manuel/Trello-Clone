// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on app launch
    router.replace("/auth/welcome");
  }, []);

  return null; // or a loading spinner if you want
}
