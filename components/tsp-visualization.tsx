"use client";

import { useState, useEffect, useRef } from "react";
import { Graph, solveTSP, TSPStep } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { RouteMap } from "@/components/route-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, SkipForward, RotateCcw, PauseCircle, Map, GitGraph } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TSPVisualizationProps {
  graph: Graph;
  initialStart?: string;
}

export function TSPVisualization({ graph, initialStart = "A" }: TSPVisualizationProps) {
  const [startNode, setStartNode] = useState(initialStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(() => solveTSP(graph, startNode));
  const [animatedPath, setAnimatedPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'graph' | 'map'>('graph');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const step = result.steps[currentStep];

  useEffect(() => {
    setResult(solveTSP(graph, startNode));
    setCurrentStep(0);
    setAnimatedPath([]);
    setIsPlaying(false);
  }, [startNode, graph]);

  useEffect(() => {
    if (step && step.currentPath.length > animatedPath.length) {
      setAnimatedPath(step.currentPath);
    } else if (currentStep === 0) {
      setAnimatedPath([startNode]);
    }
  }, [currentStep, step, startNode, animatedPath.length]);

  const handlePlay = () => {
    if (currentStep >= result.steps.length - 1) {
      setCurrentStep(0);
      setAnimatedPath([startNode]);
    }
    setIsPlaying(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleNext = () => {
    if (currentStep < result.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setAnimatedPath([startNode]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TSP Configuration</CardTitle>
          <CardDescription>
            Visit all {graph.nodes.length} nodes exactly once with minimum total distance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Starting Node</label>
            <Select value={startNode} onValueChange={setStartNode}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {graph.nodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Visualization</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {result.steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'graph' | 'map')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="graph">
                    <GitGraph className="mr-2 h-4 w-4" />
                    Graph
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="mr-2 h-4 w-4" />
                    Map
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="graph" className="mt-4">
                  <div className="scale-75 origin-top-left w-[133%]">
                    <GraphVisualization
                      graph={graph}
                      highlightedPath={animatedPath}
                      currentNode={step?.nextNode || undefined}
                      visitedNodes={new Set(animatedPath)}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="map" className="mt-4">
                  <RouteMap
                    graph={graph}
                    highlightedPath={animatedPath}
                    currentNode={step?.nextNode || undefined}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>TSP Algorithm - Nearest Neighbor Heuristic</CardTitle>
              <CardDescription>
                Greedy approach: Always visit the nearest unvisited node
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {isPlaying ? (
                  <Button onClick={handlePause}>
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={handlePlay}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {currentStep >= result.steps.length - 1 ? 'Replay' : 'Play'}
                  </Button>
                )}
                <Button onClick={handleNext} variant="outline" disabled={currentStep >= result.steps.length - 1 || isPlaying}>
                  <SkipForward className="mr-2 h-4 w-4" />
                  Next Step
                </Button>
                <Button onClick={handleReset} variant="outline" disabled={currentStep === 0}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {step && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Current Path: {step.currentPath.join(' → ')}
                    </h4>
                    <p className="text-sm text-purple-800 mb-2">
                      Total Distance So Far: <span className="font-bold">{step.totalDistance} minutes</span>
                    </p>
                    {step.nextNode && (
                      <p className="text-sm text-purple-800">
                        Next Node Selected: <span className="font-bold">{step.nextNode}</span> (nearest unvisited)
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        Visited: {step.currentPath.length}
                      </Badge>
                      <Badge variant="outline">
                        Remaining: {step.remainingNodes.length}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Node Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {graph.nodes.map((node) => {
                        const isVisited = step.currentPath.includes(node.id);
                        const isCurrent = node.id === step.nextNode;
                        const isRemaining = step.remainingNodes.includes(node.id);

                        return (
                          <div
                            key={node.id}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              isCurrent
                                ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300'
                                : isVisited
                                ? 'bg-green-100 border-green-400'
                                : isRemaining
                                ? 'bg-white border-gray-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="font-bold text-lg">{node.id}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {isCurrent ? 'Next' : isVisited ? 'Visited' : 'Remaining'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {currentStep === result.steps.length - 1 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✓ TSP Solution Complete!</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Full Tour:</span>{' '}
                          <span className="font-mono font-bold">{result.path.join(' → ')}</span>
                        </p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Total Distance:</span>{' '}
                          <span className="font-bold">{result.totalDistance} minutes</span>
                        </p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Nodes Visited:</span>{' '}
                          <span className="font-bold">{result.path.length} locations (all nodes)</span>
                        </p>
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-blue-900">
                            <strong>Note:</strong> This uses the Nearest Neighbor heuristic, which provides a good but not
                            necessarily optimal solution. For guaranteed optimal solutions on small graphs, exact algorithms
                            like branch-and-bound or dynamic programming would be needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
