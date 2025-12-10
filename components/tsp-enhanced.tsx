"use client";

import { useState, useEffect } from "react";
import { Graph, solveTSP, solveTSPWithReturn, optimize2Opt, calculateRouteCost, splitRoutesByCapacity } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { FullscreenMap } from "@/components/fullscreen-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Route, TrendingUp, Truck, Map, GitGraph, DollarSign, ArrowLeftRight } from "lucide-react";

interface TSPEnhancedProps {
  graph: Graph;
}

export function TSPEnhanced({ graph }: TSPEnhancedProps) {
  const [startNode, setStartNode] = useState("A");
  const [returnToHub, setReturnToHub] = useState(true);
  const [use2Opt, setUse2Opt] = useState(true);
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [useCapacityConstraint, setUseCapacityConstraint] = useState(false);
  const [viewMode, setViewMode] = useState<'graph' | 'map'>('graph');

  const [initialResult, setInitialResult] = useState(() =>
    returnToHub ? solveTSPWithReturn(graph, startNode, true) : solveTSP(graph, startNode)
  );
  const [optimizedResult, setOptimizedResult] = useState(() =>
    use2Opt ? optimize2Opt(graph, initialResult.path) : null
  );
  const [multiRoutes, setMultiRoutes] = useState<string[][]>([]);

  useEffect(() => {
    const initial = returnToHub ? solveTSPWithReturn(graph, startNode, true) : solveTSP(graph, startNode);
    setInitialResult(initial);

    if (use2Opt && initial.path.length > 0) {
      setOptimizedResult(optimize2Opt(graph, initial.path));
    } else {
      setOptimizedResult(null);
    }

    if (useCapacityConstraint) {
      const customerNodes = graph.nodes.filter(n => n.type === 'customer');
      const routes = splitRoutesByCapacity(graph, customerNodes, maxCapacity);
      setMultiRoutes(routes);
    } else {
      setMultiRoutes([]);
    }
  }, [graph, startNode, returnToHub, use2Opt, useCapacityConstraint, maxCapacity]);

  const finalPath = optimizedResult ? optimizedResult.path : initialResult.path;
  const finalDistance = optimizedResult ? optimizedResult.totalDistance : initialResult.totalDistance;
  const improvement = optimizedResult ? optimizedResult.improvement : 0;
  const improvementPercent = initialResult.totalDistance > 0
    ? (improvement / initialResult.totalDistance) * 100
    : 0;

  const cost = calculateRouteCost(graph, finalPath);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-purple-500" />
            Enhanced TSP Solver
          </CardTitle>
          <CardDescription>
            Advanced traveling salesman with 2-Opt optimization and capacity constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Starting Node</Label>
                <Select value={startNode} onValueChange={setStartNode}>
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Return to Start</Label>
                  <div className="text-xs text-muted-foreground">Complete the circuit</div>
                </div>
                <Switch checked={returnToHub} onCheckedChange={setReturnToHub} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>2-Opt Optimization</Label>
                  <div className="text-xs text-muted-foreground">Improve route quality</div>
                </div>
                <Switch checked={use2Opt} onCheckedChange={setUse2Opt} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Capacity Constraints</Label>
                  <div className="text-xs text-muted-foreground">Split into multiple routes</div>
                </div>
                <Switch checked={useCapacityConstraint} onCheckedChange={setUseCapacityConstraint} />
              </div>

              {useCapacityConstraint && (
                <div className="space-y-2">
                  <Label>Max Capacity per Route</Label>
                  <Input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 10)}
                    min={1}
                    max={50}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Initial Route</CardTitle>
            <CardDescription>Nearest Neighbor heuristic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-bold">{initialResult.totalDistance.toFixed(1)} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nodes:</span>
              <span className="font-bold">{initialResult.path.length}</span>
            </div>
          </CardContent>
        </Card>

        {use2Opt && optimizedResult && (
          <Card className="ring-2 ring-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Optimized Route</CardTitle>
                <Badge className="bg-green-500">2-Opt</Badge>
              </div>
              <CardDescription>After optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span className="font-bold">{optimizedResult.totalDistance.toFixed(1)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Improvement:</span>
                <span className="font-bold text-green-600">
                  -{improvement.toFixed(1)} min ({improvementPercent.toFixed(1)}%)
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Route Cost
            </CardTitle>
            <CardDescription>Total delivery cost</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fuel:</span>
              <span className="font-bold">${cost.fuelCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Driver:</span>
              <span className="font-bold">${cost.driverCost.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${cost.totalCost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {useCapacityConstraint && multiRoutes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Truck className="h-5 w-5" />
              Multi-Vehicle Routes ({multiRoutes.length} drivers needed)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {multiRoutes.map((route, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Driver {idx + 1}:</span>
                  <Badge variant="outline">{route.length} stops</Badge>
                </div>
                <div className="text-sm text-muted-foreground font-mono mt-1">
                  {route.join(' → ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Route Visualization</CardTitle>
          <CardDescription>
            {use2Opt ? `Optimized route with ${improvementPercent.toFixed(1)}% improvement` : 'Standard TSP solution'}
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
              <GraphVisualization
                graph={graph}
                highlightedPath={finalPath}
              />
            </TabsContent>
            <TabsContent value="map">
              <FullscreenMap
                graph={graph}
                highlightedPath={finalPath}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {use2Opt && improvement > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <TrendingUp className="h-5 w-5" />
              Optimization Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-800 dark:text-green-200">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Time Saved:</strong> {improvement.toFixed(1)} minutes ({improvementPercent.toFixed(1)}% faster)
              </li>
              <li>
                <strong>Cost Saved:</strong> ${(improvement * 0.5 * 0.5).toFixed(2)} in fuel and driver costs
              </li>
              <li>
                <strong>Method:</strong> 2-Opt edge swap optimization removes route crossings
              </li>
              <li>
                2-Opt systematically tries reversing route segments to eliminate inefficient paths
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
