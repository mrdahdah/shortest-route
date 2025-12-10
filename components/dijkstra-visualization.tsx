"use client";

import { useState } from "react";
import { Graph, dijkstra, DijkstraStep } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, SkipForward, RotateCcw } from "lucide-react";

interface DijkstraVisualizationProps {
  graph: Graph;
  start: string;
  end: string;
}

export function DijkstraVisualization({ graph, start, end }: DijkstraVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result] = useState(() => dijkstra(graph, start, end));

  const step = result.steps[currentStep];

  const handlePlay = () => {
    if (currentStep >= result.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep < result.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualization</CardTitle>
          <CardDescription>
            Finding shortest path from {start} (Restaurant) to {end} (Customer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GraphVisualization
            graph={graph}
            highlightedPath={currentStep === result.steps.length - 1 ? result.path : []}
            currentNode={step?.current}
            visitedNodes={step?.visited}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Controls</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {result.steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={handlePlay} disabled={isPlaying}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {currentStep >= result.steps.length - 1 ? 'Replay' : 'Play'}
            </Button>
            <Button onClick={handleNext} variant="outline" disabled={currentStep >= result.steps.length - 1}>
              <SkipForward className="mr-2 h-4 w-4" />
              Next Step
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {step && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Current Node: {step.current}</h4>
                <p className="text-sm text-muted-foreground">
                  Processing node {step.current} and updating distances to neighbors
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Distance Table</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {Object.entries(step.distances).map(([node, distance]) => (
                    <div
                      key={node}
                      className={`p-2 rounded border text-center ${
                        node === step.current
                          ? 'bg-yellow-100 border-yellow-400'
                          : step.visited.has(node)
                          ? 'bg-gray-100 border-gray-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="font-bold">{node}</div>
                      <div className="text-sm">
                        {distance === Infinity ? '∞' : distance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentStep === result.steps.length - 1 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Result</h4>
                  <p className="text-sm text-green-800">
                    Shortest path: <span className="font-mono font-bold">{result.path.join(' → ')}</span>
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Total distance: <span className="font-bold">{result.distance} minutes</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
