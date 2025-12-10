"use client";

import { useState } from "react";
import { sampleGraph } from "@/lib/graph";
import { DijkstraVisualization } from "@/components/dijkstra-visualization";
import { HamiltonianCheck } from "@/components/hamiltonian-check";
import { GraphVisualization } from "@/components/graph-visualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, TruckIcon } from "lucide-react";

export default function Home() {
  const [graph] = useState(sampleGraph);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TruckIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Logistics Routing Engine</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Graph-based delivery route optimization using Dijkstra's algorithm
          </p>
        </div>

        <Separator className="mb-8" />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="overview">
              <MapPin className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dijkstra">
              <Package className="mr-2 h-4 w-4" />
              Route Finder
            </TabsTrigger>
            <TabsTrigger value="hamiltonian">
              <TruckIcon className="mr-2 h-4 w-4" />
              Path Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Network</CardTitle>
                  <CardDescription>
                    Interactive graph showing all delivery points and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GraphVisualization graph={graph} />
                </CardContent>
              </Card>

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

          <TabsContent value="dijkstra" className="space-y-6">
            <DijkstraVisualization graph={graph} start="A" end="E" />
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
