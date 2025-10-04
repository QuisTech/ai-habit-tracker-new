"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  children: ReactNode;
}

export default function AuthWrapper({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to see your habits.</div>;

  return <>{children}</>;
}
