import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-4">
      <div className="text-center max-w-xl">
        <div className="w-14 h-14 rounded-[var(--radius-card)] bg-accent flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">SF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          SiteForge
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          {"\u53f0\u7063\u54c1\u724c\u5c08\u5c6c\u7684\u975c\u614b\u5b98\u7db2\u5efa\u7ad9\u5de5\u5177\u3002\u7e41\u9ad4\u4e2d\u6587\u6392\u7248\u512a\u5316\uff0c\u6b50\u7f8e\u7c21\u7d04\u8cea\u611f\u7248\u578b\u3002"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-white bg-accent rounded-[var(--radius-input)] hover:bg-accent/90 transition-colors"
          >
            {"\u767b\u5165"}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-text-primary bg-bg-card border border-border-strong rounded-[var(--radius-input)] hover:bg-bg-card-elevated transition-colors"
          >
            {"\u514d\u8cbb\u8a3b\u518a"}
          </Link>
        </div>
      </div>
    </div>
  );
}
