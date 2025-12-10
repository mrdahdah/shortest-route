"use client";

import { useState, useEffect, useRef } from "react";
import { Graph, dijkstra, DijkstraStep } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { RouteMap } from "@/components/route-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, SkipForward, RotateCcw, PauseCircle, Map, GitGraph } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DijkstraVisualizationEnhancedProps {
  graph: Graph;
  initialStart?: string;
  initialEnd?: string;
}

export function DijkstraVisualizationEnhanced({
  graph,
  initialStart = "A",
  initialEnd = "E"
}: DijkstraVisualizationEnhancedProps) {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(() => dijkstra(graph, start, end));
  const [animatedPath, setAnimatedPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'graph' | 'map'>('graph');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const step = result.steps[currentStep];

  useEffect(() => {
    setResult(dijkstra(graph, start, end));
    setCurrentStep(0);
    setAnimatedPath([]);
    setIsPlaying(false);
  }, [start, end, graph]);

  useEffect(() => {
    if (currentStep === result.steps.length - 1 && result.path.length > 0) {
      let pathIndex = 0;
      const pathInterval = setInterval(() => {
        if (pathIndex < result.path.length) {
          setAnimatedPath(prev => [...prev, result.path[pathIndex]]);
          pathIndex++;
        } else {
          clearInterval(pathInterval);
        }
      }, 300);
      return () => clearInterval(pathInterval);
    } else {
      setAnimatedPath([]);
    }
  }, [currentStep, result.path, result.steps.length]);

  const handlePlay = () => {
    if (currentStep >= result.steps.length - 1) {
      setCurrentStep(0);
      setAnimatedPath([]);
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
    }, 1200);
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
    setAnimatedPath([]);
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

  const customerNodes = graph.nodes.filter(n => n.type === 'customer');
  const allNodes = graph.nodes;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Route Configuration</CardTitle>
          <CardDescription>Select start and end points for route optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Point</label>
              <Select value={start} onValueChange={setStart}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allNodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Point</label>
              <Select value={end} onValueChange={setEnd}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allNodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                      currentNode={step?.current}
                      visitedNodes={step?.visited}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="map" className="mt-4">
                  <RouteMap
                    graph={graph}
                    highlightedPath={animatedPath}
                    currentNode={step?.current}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Execution</CardTitle>
              <CardDescription>
                Dijkstra's shortest path algorithm
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
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Current Node: {step.current}
                    </h4>
                    <p className="text-sm text-blue-800">
                      Processing node {step.current} and updating distances to neighbors
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        Visited: {step.visited.size}
                      </Badge>
                      <Badge variant="outline">
                        Remaining: {step.unvisited.size}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Distance Table</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(step.distances).map(([node, distance]) => (
                        <div
                          key={node}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            node === step.current
                              ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300'
                              : step.visited.has(node)
                              ? 'bg-gray-100 border-gray-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="font-bold text-lg">{node}</div>
                          <div className="text-sm font-mono font-semibold text-muted-foreground">
                            {distance === Infinity ? '∞' : `${distance}min`}
                          </div>
                          {step.previous[node] && (
                            <div className="text-xs text-muted-foreground mt-1">
                              via {step.previous[node]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentStep === result.steps.length - 1 && result.path.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✓ Shortest Path Found</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Path:</span>{' '}
                          <span className="font-mono font-bold">{result.path.join(' → ')}</span>
                        </p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Total Distance:</span>{' '}
                          <span className="font-bold">{result.distance} minutes</span>
                        </p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Nodes Visited:</span>{' '}
                          <span className="font-bold">{result.path.length} locations</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === result.steps.length - 1 && result.path.length === 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">⚠ No Path Found</h4>
                      <p className="text-sm text-red-800">
                        There is no route from {start} to {end} in the current graph.
                      </p>
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
