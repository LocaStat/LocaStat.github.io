import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Lock, Zap, TrendingUp, FileUp, BarChart3, Shield, Cloud, Github, Heart, TabletSmartphone, Upload, LineChart, Database, TableRowsSplit, TableCellsSplit, TableColumnsSplit, ChartCandlestick, ChartNoAxesCombined, TableOfContents, ChartPie, ChartScatter, ChartColumnStacked, Sheet, FileSpreadsheet } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

// Helper function to highlight substrings in text
const highlightText = (text: string, highlight: string): React.ReactNode => {
  if (!highlight) return text;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="text-primary font-semibold">{part}</span>
    ) : (
      part
    )
  );
};

const Index = () => {
  const heroFeatures = [
    {
      icons: [TableRowsSplit, TableCellsSplit, TableColumnsSplit],
      title: "Filter and Export",
      description: "Download only a handful of columns among thousands - like selected proteins, genes or metabolytes in OMICS data.",
      highlight: "OMICS",
    },
    {
      icons: [TableOfContents, ChartNoAxesCombined, ChartCandlestick],
      title: "Statistical Analysis",
      description: "Comprehensive tools for exploring your data with descriptive statistics and insights.",
      highlight: "descriptive statistics",
    },
    {
      icons: [ChartColumnStacked, ChartPie, ChartScatter],
      title: "Rich Visualizations",
      description: "Create and download beautiful charts to understand patterns and trends in your data.",
      highlight: "beautiful charts",
    },
    {
      icons: [Sheet, FileSpreadsheet, Database],
      title: "Data Management",
      description: "Handle multiple data formats, preview data, and export results - all with a clean, intuitive interface.",
      highlight: "data formats",
    },
  ];

  // Helper function to render a hero feature card
  const renderHeroCard = (feature: typeof heroFeatures[0], index: number, isMobile: boolean = false) => (
    <Card className="relative z-10 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]">
      <CardContent className="p-4 md:p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {feature.icons.map((Icon, idx) => (
            <div key={idx} className="bg-primary/10 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          ))}
        </div>
        <h4 className="text-base md:text-lg font-semibold mb-2">{feature.title}</h4>
        <p className="text-xs md:text-sm text-muted-foreground flex-grow">{highlightText(feature.description, feature.highlight)}</p>
      </CardContent>
    </Card>
  );

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
      icon: TabletSmartphone,
      title: "Mobile Friendly",
      description: "No one needs to think about work outside the lab. But we still do! Quick data exploration on your fingertips.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section */}
      <section className="relative overflow-x-hidden ">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] pointer-events-none" />
        <div className="container mx-auto px-4 py-6 md:py-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center ">
            <div className="space-y-6 min-w-0">

              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold leading-tight break-words">
                <span className="block">Exploratory Data Analysis</span>
                <span className="block bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                  for Scientists
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed break-words">
                A modern, privacy-focused tool for researchers to explore, analyze, and visualize
                their data - completely offline. Your data never leaves your device.
              </p>
              <div className="flex flex-row flex-wrap gap-2 max-w-full">
              <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap">
                  No-Code
                </span>
                <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap">
                  Offline
                </span>
                <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap">
                  Secure
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/app" className="block w-full sm:w-auto">
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
            {/* Desktop Grid */}
            <div className="md:grid relative grid-cols-2 gap-4 h-full min-h-[500px]">
              {/* Center image overlay - behind cards, double size */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-24 h-24 md:w-32 md:h-32">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-[hsl(var(--primary-glow))]/20 blur-3xl rounded-full" />
                <img
                  src={heroImage}
                  alt="Data visualization illustration"
                  className="relative rounded-2xl shadow-2xl w-full h-full object-cover"
                />
              </div>
              
              {renderHeroCard(heroFeatures[0], 0)}
              {renderHeroCard(heroFeatures[1], 1)}
              {renderHeroCard(heroFeatures[2], 2)}
              {renderHeroCard(heroFeatures[3], 3)}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
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
      <section className="py-12 md:py-16">
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
              <Link to="/app" className="block w-full sm:w-auto">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 md:hover:scale-105 w-full sm:w-auto"
                >
                  Try LocaStat Now
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
              <img src="/logo.png" alt="LocaStat Logo" className="h-6 w-6" />
              <span className="font-semibold">LocaStat</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Built for researchers, by researchers. 100% offline, 100% private.
              </div>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Statement
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
