"use client";

import { Graph } from "@/lib/graph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Network, TrendingUp, MapPin } from "lucide-react";

interface StatisticsDashboardProps {
  graph: Graph;
}

export function StatisticsDashboard({ graph }: StatisticsDashboardProps) {
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;
  const restaurantCount = graph.nodes.filter(n => n.type === 'restaurant').length;
  const customerCount = graph.nodes.filter(n => n.type === 'customer').length;
  const hubCount = graph.nodes.filter(n => n.type === 'driver-hub').length;

  const avgEdgesPerNode = (edgeCount * 2 / nodeCount).toFixed(1);
  const totalWeight = graph.edges.reduce((sum, edge) => sum + edge.weight, 0);
  const avgWeight = (totalWeight / edgeCount).toFixed(1);

  const maxWeight = Math.max(...graph.edges.map(e => e.weight));
  const minWeight = Math.min(...graph.edges.map(e => e.weight));

  const longestEdge = graph.edges.find(e => e.weight === maxWeight);
  const shortestEdge = graph.edges.find(e => e.weight === minWeight);

  const graphDensity = ((edgeCount / (nodeCount * (nodeCount - 1) / 2)) * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nodeCount}</div>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {restaurantCount} Restaurant
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {customerCount} Customers
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {hubCount} Hub
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Edges</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{edgeCount}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Avg {avgEdgesPerNode} connections per node
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Graph Density</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{graphDensity}%</div>
          <p className="text-xs text-muted-foreground mt-2">
            Connection ratio
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Travel Time</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgWeight} min</div>
          <p className="text-xs text-muted-foreground mt-2">
            Range: {minWeight}-{maxWeight} min
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Edge Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {longestEdge && (
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <span className="text-sm font-medium text-red-900">Longest Route</span>
              <Badge variant="destructive">
                {longestEdge.from} ↔ {longestEdge.to}: {longestEdge.weight}min
              </Badge>
            </div>
          )}
          {shortestEdge && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-900">Shortest Route</span>
              <Badge className="bg-green-600">
                {shortestEdge.from} ↔ {shortestEdge.to}: {shortestEdge.weight}min
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Graph Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">Undirected Weighted Graph</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Travel Time:</span>
              <span className="font-medium">{totalWeight} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Connectedness:</span>
              <Badge variant="outline">
                {graphDensity > 50 ? 'Highly Connected' : graphDensity > 30 ? 'Well Connected' : 'Sparse'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
