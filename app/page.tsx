"use client";

import { useState } from "react";
import { sampleGraph, Graph } from "@/lib/graph";
import { DijkstraVisualizationEnhanced } from "@/components/dijkstra-visualization-enhanced";
import { HamiltonianCheck } from "@/components/hamiltonian-check";
import { GraphVisualization } from "@/components/graph-visualization";
import { FullscreenMap } from "@/components/fullscreen-map";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { ExportData } from "@/components/export-data";
import { TSPVisualization } from "@/components/tsp-visualization";
import { TSPEnhanced } from "@/components/tsp-enhanced";
import { AdvancedRouting } from "@/components/advanced-routing";
import { GraphBuilder } from "@/components/graph-builder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Package, MapPin, TruckIcon, BarChart3, Download, Route, Pencil, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  const [graph, setGraph] = useState<Graph>(sampleGraph);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <TruckIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Logistics Routing Engine</h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-lg text-muted-foreground">
            Graph-based delivery route optimization using advanced algorithms
          </p>
        </div>

        <Separator className="mb-8" />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-9 h-auto">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              <MapPin className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="builder" className="text-xs md:text-sm">
              <Pencil className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="dijkstra" className="text-xs md:text-sm">
              <Package className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Dijkstra
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs md:text-sm">
              <Zap className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              A* vs Dijkstra
            </TabsTrigger>
            <TabsTrigger value="tsp" className="text-xs md:text-sm">
              <Route className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              TSP Basic
            </TabsTrigger>
            <TabsTrigger value="tsp-advanced" className="text-xs md:text-sm">
              <TrendingUp className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              TSP Pro
            </TabsTrigger>
            <TabsTrigger value="hamiltonian" className="text-xs md:text-sm">
              <TruckIcon className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs md:text-sm">
              <BarChart3 className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs md:text-sm">
              <Download className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Network Graph</CardTitle>
                    <CardDescription>
                      Abstract graph showing all delivery points and connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GraphVisualization graph={graph} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>OpenStreetMap View</CardTitle>
                    <CardDescription>
                      Geographic locations on real map
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FullscreenMap graph={graph} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Overview</CardTitle>
                    <CardDescription>Delivery app routing system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Points</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span><strong>A</strong> = Restaurant</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span><strong>B, C, D, E</strong> = Customers</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span><strong>F</strong> = Driver Hub</span>
                        </li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Tasks</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Construct a weighted graph with at least 8 edges</li>
                        <li>Compute shortest route using Dijkstra's algorithm</li>
                        <li>Detect if driver can pass through all nodes exactly once</li>
                      </ol>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Graph Properties</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-slate-100 rounded">
                          <div className="text-xs text-muted-foreground">Nodes</div>
                          <div className="font-bold">{graph.nodes.length}</div>
                        </div>
                        <div className="p-2 bg-slate-100 rounded">
                          <div className="text-xs text-muted-foreground">Edges</div>
                          <div className="font-bold">{graph.edges.length}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-World Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This routing logic is used in real logistics apps like Glovo and Deliveroo
                      to optimize delivery routes, minimize travel time, and ensure efficient
                      resource allocation for food delivery services.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <GraphBuilder initialGraph={graph} onGraphChange={setGraph} />
          </TabsContent>

          <TabsContent value="dijkstra" className="space-y-6">
            <DijkstraVisualizationEnhanced graph={graph} initialStart="A" initialEnd="E" />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedRouting graph={graph} />
          </TabsContent>

          <TabsContent value="tsp" className="space-y-6">
            <TSPVisualization graph={graph} initialStart="A" />
          </TabsContent>

          <TabsContent value="tsp-advanced" className="space-y-6">
            <TSPEnhanced graph={graph} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatisticsDashboard graph={graph} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ExportData graph={graph} />
              <Card>
                <CardHeader>
                  <CardTitle>About Exports</CardTitle>
                  <CardDescription>Data format information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">JSON Format:</strong> Complete graph structure
                    including all nodes, edges, and coordinates. Perfect for importing into other applications.
                  </p>
                  <p>
                    <strong className="text-foreground">Route Analysis:</strong> Human-readable text file
                    with all shortest paths calculated between every pair of nodes.
                  </p>
                  <p>
                    <strong className="text-foreground">Adjacency Matrix:</strong> CSV format matrix
                    showing edge weights. Can be imported into Excel or other data analysis tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hamiltonian" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Graph</CardTitle>
                  <CardDescription>All delivery points and connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <GraphVisualization graph={graph} />
                </CardContent>
              </Card>

              <HamiltonianCheck graph={graph} />
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Graph Exercise: Routing Engine for a Delivery App</p>
          <p className="mt-1">Built with Next.js, TypeScript, shadcn/ui, and Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
