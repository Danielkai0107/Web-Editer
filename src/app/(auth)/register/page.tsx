"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("\u5bc6\u78bc\u4e0d\u4e00\u81f4");
      return;
    }

    if (password.length < 6) {
      setError("\u5bc6\u78bc\u81f3\u5c11\u9700\u8981 6 \u500b\u5b57\u5143");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
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
          <h1 className="text-2xl font-bold text-text-primary">{"\u5efa\u7acb\u5e33\u865f"}</h1>
          <p className="text-sm text-text-secondary mt-1">{"\u514d\u8cbb\u958b\u59cb\uff0c\u96a8\u6642\u5347\u7d1a"}</p>
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
            placeholder={"\u81f3\u5c11 6 \u500b\u5b57\u5143"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            id="confirmPassword"
            label={"\u78ba\u8a8d\u5bc6\u78bc"}
            type="password"
            placeholder={"\u518d\u6b21\u8f38\u5165\u5bc6\u78bc"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-danger bg-danger-bg rounded-[var(--radius-input)] px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            {"\u8a3b\u518a"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          {"\u5df2\u6709\u5e33\u865f\uff1f"}
          <Link href="/login" className="text-accent hover:underline ml-1">
            {"\u767b\u5165"}
          </Link>
        </p>
      </div>
    </div>
  );
}
