"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  children: ReactNode;
}

interface User {
  id: string;
  email?: string;
  // Add other user properties you need
}

export default function AuthWrapper({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUser(user as User | null);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to see your habits.</div>;

  return <>{children}</>;
}
