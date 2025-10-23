import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, Lock, Zap, TrendingUp, FileUp, BarChart3, Shield, Cloud } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const Index = () => {
  const features = [
    {
      icon: Cloud,
      title: "Explore Offline",
      description: "Work without internet connection. Your data stays on your device, always accessible.",
    },
    {
      icon: Shield,
      title: "Private by Design",
      description: "Your data never leaves your device. Complete privacy and security guaranteed.",
    },
    {
      icon: Zap,
      title: "Fast Import",
      description: "Quick CSV and Excel upload with instant preview. Start analyzing in seconds.",
    },
    {
      icon: TrendingUp,
      title: "Expandable",
      description: "Foundation for plots, statistical analysis, and advanced data exploration.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
              DataPrep Offline
            </h1>
          </div>
          <Link to="/app">
            <Button variant="ghost" size="sm">
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  Offline-First Data Tool
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Offline Data Exploration for{" "}
                <span className="bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                  Scientists
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A modern, privacy-focused tool for researchers to explore, analyze, and prepare
                their data—completely offline. Your data never leaves your device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/app">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                    Start Analyzing Data
                    <FileUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-[hsl(var(--primary-glow))]/20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="Data visualization illustration"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Modern Research
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to explore your data, with privacy and performance at the core.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Exploring?
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Upload your data and begin analyzing in seconds. No sign-up, no cloud storage, no hassle.
              </p>
              <Link to="/app">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 hover:scale-105"
                >
                  Try DataPrep Now
                  <BarChart3 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span className="font-semibold">DataPrep Offline</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built for researchers, by researchers. 100% offline, 100% private.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
