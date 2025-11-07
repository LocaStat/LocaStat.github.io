import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import privacyData from "@/data/privacy-statement.json";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{privacyData.title}</h1>
          <p className="text-muted-foreground">
            Last Updated: {privacyData.lastUpdated}
          </p>
        </div>

        <div className="space-y-6">
          {privacyData.sections.map((section, index) => (
            <Card key={section.id} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {index + 1}. {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {section.content.split("\n").map((paragraph, pIndex) => {
                    if (paragraph.trim() === "") {
                      return <br key={pIndex} />;
                    }
                    if (paragraph.trim().startsWith("•")) {
                      return (
                        <div key={pIndex} className="ml-4 mb-2">
                          {paragraph}
                        </div>
                      );
                    }
                    return (
                      <p key={pIndex} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

