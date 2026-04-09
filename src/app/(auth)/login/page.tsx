"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-card)] bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">SF</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{"\u767b\u5165 SiteForge"}</h1>
          <p className="text-sm text-text-secondary mt-1">{"\u958b\u59cb\u6253\u9020\u4f60\u7684\u54c1\u724c\u5b98\u7db2"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label={"\u5bc6\u78bc"}
            type="password"
            placeholder={"\u8f38\u5165\u5bc6\u78bc"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-danger bg-danger-bg rounded-[var(--radius-input)] px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            {"\u767b\u5165"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          {"\u9084\u6c92\u6709\u5e33\u865f\uff1f"}
          <Link href="/register" className="text-accent hover:underline ml-1">
            {"\u514d\u8cbb\u8a3b\u518a"}
          </Link>
        </p>
      </div>
    </div>
  );
}
