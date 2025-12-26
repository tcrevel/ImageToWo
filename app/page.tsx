"use client";

/**
 * ImageToFit Home Page
 * 
 * Main application flow:
 * 1. Upload workout image
 * 2. AI parses to structured workout
 * 3. Edit workout if needed
 * 4. Export as .zwo file
 */

import React, { useState, useCallback } from "react";
import { Download, Loader2, ArrowRight, Upload, Sparkles } from "lucide-react";
import { Uploader } from "@/components/uploader";
import { WorkoutEditor } from "@/components/workout-editor";
import { Button } from "@/components/ui/button";
import type { Workout, ParseResponse } from "@/lib/schemas";

// ============================================================================
// Types
// ============================================================================

type AppState = "upload" | "loading" | "edit";

// ============================================================================
// Component
// ============================================================================

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload and parsing
  const handleUpload = useCallback(async (file: File) => {
    setState("loading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/workouts/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok && !data.workout) {
        throw new Error(data.error || "Failed to parse workout");
      }

      const result = data as ParseResponse;
      setWorkout(result.workout);
      setWarnings(result.warnings);
      setConfidence(result.confidence);
      setState("edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse workout");
      setState("upload");
    }
  }, []);

  // Handle ZWO export
  const handleExport = useCallback(async () => {
    if (!workout) return;

    setIsExporting(true);

    try {
      const response = await fetch("/api/workouts/export/zwo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workout }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to export");
      }

      // Download the file
      const blob = await response.blob();
      const filename =
        response.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] || "workout.zwo";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export");
    } finally {
      setIsExporting(false);
    }
  }, [workout]);

  // Reset to upload state
  const handleReset = useCallback(() => {
    setState("upload");
    setWorkout(null);
    setWarnings([]);
    setConfidence(0);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">ImageToFit</h1>
          {state === "edit" && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Upload className="h-4 w-4 mr-2" />
              New Upload
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Hero Section - Only on upload state */}
        {state === "upload" && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Transform Workout Images
              <br />
              <span className="text-primary">into .zwo Files</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Upload a screenshot of your cycling workout and we&apos;ll convert it
              to a .zwo file for Zwift, Intervals.icu, or TrainingPeaks.
            </p>
          </div>
        )}

        {/* Main Content */}
        {state === "upload" && (
          <div className="space-y-6">
            <Uploader onUpload={handleUpload} isLoading={false} />
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3 mt-12">
              <FeatureCard
                icon={<Upload className="h-5 w-5" />}
                title="Upload Image"
                description="Drag & drop or take a photo of your workout"
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5" />}
                title="AI Parsing"
                description="Our AI extracts workout structure automatically"
              />
              <FeatureCard
                icon={<Download className="h-5 w-5" />}
                title="Export ZWO"
                description="Download for Zwift and other platforms"
              />
            </div>
          </div>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Analyzing your workout...</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few seconds
            </p>
          </div>
        )}

        {state === "edit" && workout && (
          <div className="space-y-6">
            <WorkoutEditor
              workout={workout}
              warnings={warnings}
              confidence={confidence}
              onChange={setWorkout}
            />

            {/* Export Button */}
            <div className="flex justify-end gap-4">
              <Button
                size="lg"
                onClick={handleExport}
                disabled={isExporting}
                className="min-w-[180px]"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export .zwo
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            ImageToFit — Convert workout images to .zwo files
          </p>
          <p className="mt-1">
            Compatible with Zwift, Intervals.icu, and TrainingPeaks
          </p>
        </div>
      </footer>
    </main>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
