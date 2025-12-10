"use client";

import { useState, useEffect } from "react";
import { Graph, dijkstra, aStarSearch, applyTrafficConditions, calculateRouteCost } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { FullscreenMap } from "@/components/fullscreen-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Activity, Map, GitGraph, DollarSign, Clock, Fuel } from "lucide-react";

interface AdvancedRoutingProps {
  graph: Graph;
}

export function AdvancedRouting({ graph: initialGraph }: AdvancedRoutingProps) {
  const [graph, setGraph] = useState(initialGraph);
  const [start, setStart] = useState("A");
  const [end, setEnd] = useState("E");
  const [trafficLevel, setTrafficLevel] = useState<'light' | 'moderate' | 'heavy' | 'random'>('light');
  const [viewMode, setViewMode] = useState<'graph' | 'map'>('graph');

  const [dijkstraResult, setDijkstraResult] = useState(() => dijkstra(graph, start, end));
  const [aStarResult, setAStarResult] = useState(() => aStarSearch(graph, start, end));

  useEffect(() => {
    const trafficGraph = applyTrafficConditions(initialGraph, trafficLevel);
    setGraph(trafficGraph);
    setDijkstraResult(dijkstra(trafficGraph, start, end));
    setAStarResult(aStarSearch(trafficGraph, start, end));
  }, [initialGraph, start, end, trafficLevel]);

  const dijkstraCost = calculateRouteCost(graph, dijkstraResult.path);
  const aStarCost = calculateRouteCost(graph, aStarResult.path);

  const winner = dijkstraResult.distance < aStarResult.distance ? 'dijkstra' :
                 aStarResult.distance < dijkstraResult.distance ? 'astar' : 'tie';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Advanced Route Optimization
          </CardTitle>
          <CardDescription>
            Compare Dijkstra vs A* Search with traffic simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Point</label>
              <Select value={start} onValueChange={setStart}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {graph.nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>{node.label}</SelectItem>
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
                  {graph.nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>{node.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Traffic Conditions</label>
              <Select value={trafficLevel} onValueChange={(v: any) => setTrafficLevel(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (+10%)</SelectItem>
                  <SelectItem value="moderate">Moderate (+30%)</SelectItem>
                  <SelectItem value="heavy">Heavy (+60%)</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dijkstra Results */}
        <Card className={winner === 'dijkstra' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dijkstra's Algorithm</CardTitle>
              {winner === 'dijkstra' && <Badge className="bg-green-500">Winner</Badge>}
            </div>
            <CardDescription>Classic shortest path algorithm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-mono font-bold">{dijkstraResult.path.join(' → ')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Time:
                </span>
                <span className="font-bold">{dijkstraResult.distance.toFixed(1)} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Total Cost:
                </span>
                <span className="font-bold">${dijkstraCost.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3 w-3" /> Fuel:
                </span>
                <span className="font-bold">${dijkstraCost.fuelCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Steps:
                </span>
                <span className="font-bold">{dijkstraResult.steps.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* A* Results */}
        <Card className={winner === 'astar' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">A* Search</CardTitle>
              {winner === 'astar' && <Badge className="bg-blue-500">Winner</Badge>}
            </div>
            <CardDescription>Heuristic-based pathfinding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-mono font-bold">{aStarResult.path.join(' → ')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Time:
                </span>
                <span className="font-bold">{aStarResult.distance.toFixed(1)} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Total Cost:
                </span>
                <span className="font-bold">${aStarCost.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3 w-3" /> Fuel:
                </span>
                <span className="font-bold">${aStarCost.fuelCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Steps:
                </span>
                <span className="font-bold">{aStarResult.steps.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Visualization</CardTitle>
          <CardDescription>
            {winner === 'tie' ? 'Both algorithms found the same optimal route' :
             winner === 'dijkstra' ? 'Dijkstra found a better route' :
             'A* found a better route using heuristics'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'graph' | 'map')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="graph">
                <GitGraph className="mr-2 h-4 w-4" />
                Graph View
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="mr-2 h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="graph">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Showing {winner === 'astar' ? 'A* (blue)' : winner === 'dijkstra' ? 'Dijkstra (purple)' : 'optimal'} route
                </div>
                <GraphVisualization
                  graph={graph}
                  highlightedPath={winner === 'astar' ? aStarResult.path : dijkstraResult.path}
                />
              </div>
            </TabsContent>
            <TabsContent value="map">
              <FullscreenMap
                graph={graph}
                highlightedPath={winner === 'astar' ? aStarResult.path : dijkstraResult.path}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {winner !== 'tie' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 dark:text-yellow-200">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Time Difference:</strong> {Math.abs(dijkstraResult.distance - aStarResult.distance).toFixed(1)} minutes
              </li>
              <li>
                <strong>Cost Savings:</strong> ${Math.abs(dijkstraCost.totalCost - aStarCost.totalCost).toFixed(2)}
              </li>
              <li>
                <strong>Steps Difference:</strong> {Math.abs(dijkstraResult.steps.length - aStarResult.steps.length)} iterations
              </li>
              <li>
                {winner === 'astar' ?
                  'A* found a better route by using geographic heuristics to guide the search' :
                  'Dijkstra found a better route through exhaustive search of all possibilities'}
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
