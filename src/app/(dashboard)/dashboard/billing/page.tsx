"use client";

import { Shell } from "@/components/layout/shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS, type Profile } from "@/lib/types";
import { Check } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "NT$0",
    period: "/\u6708",
    features: ["1 \u500b\u9801\u9762", "\u5b50\u7db2\u57df", "\u57fa\u672c\u6a21\u7d44"],
  },
  {
    id: "basic" as const,
    name: "Basic",
    price: "NT$200",
    period: "/\u6708",
    features: ["3 \u500b\u9801\u9762", "\u81ea\u8a02\u7db2\u57df", "\u6240\u6709\u6a21\u7d44", "\u512a\u5148\u652f\u63f4"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "NT$400",
    period: "/\u6708",
    features: [
      "\u7121\u9650\u9801\u9762",
      "\u81ea\u8a02\u7db2\u57df",
      "\u6240\u6709\u6a21\u7d44",
      "AI \u6587\u6848\u529f\u80fd",
      "\u9032\u968e\u6a21\u7d44",
      "\u5c08\u5c6c\u652f\u63f4",
    ],
  },
];

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Shell title={"\u65b9\u6848\u8207\u5e33\u55ae"}>
      <div className="mb-6">
        <h2 className="text-xl font-bold">{"\u65b9\u6848\u8207\u5e33\u55ae"}</h2>
        <p className="text-sm text-text-secondary mt-1">
          {"\u7ba1\u7406\u4f60\u7684\u8a02\u95b1\u65b9\u6848"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = profile?.plan === plan.id;
          return (
            <Card
              key={plan.id}
              className={isCurrent ? "border-accent ring-2 ring-accent-glow" : ""}
            >
              <CardHeader>
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && (
                    <Badge variant="accent" className="mt-1">
                      {"\u76ee\u524d\u65b9\u6848"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold font-[var(--font-mono)]">{plan.price}</span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    {"\u76ee\u524d\u65b9\u6848"}
                  </Button>
                ) : (
                  <Button
                    variant={plan.id === "pro" ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => alert("\u91d1\u6d41\u529f\u80fd\u5373\u5c07\u4e0a\u7dda")}
                  >
                    {"\u5347\u7d1a"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
