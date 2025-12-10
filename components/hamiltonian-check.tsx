"use client";

import { Graph, hasHamiltonianPath } from "@/lib/graph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface HamiltonianCheckProps {
  graph: Graph;
}

export function HamiltonianCheck({ graph }: HamiltonianCheckProps) {
  const hasPath = hasHamiltonianPath(graph);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hamiltonian Path Detection</CardTitle>
        <CardDescription>
          Checks if a driver can visit all nodes exactly once
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {hasPath ? (
              <>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-700">Hamiltonian Path Exists</p>
                  <p className="text-sm text-muted-foreground">
                    A driver can visit all {graph.nodes.length} locations exactly once
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">No Hamiltonian Path</p>
                  <p className="text-sm text-muted-foreground">
                    Cannot visit all {graph.nodes.length} locations exactly once in a single path
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">What is a Hamiltonian Path?</h4>
            <p className="text-sm text-muted-foreground">
              A Hamiltonian path is a path in a graph that visits each node exactly once.
              This is crucial for logistics as it helps determine if a driver can complete
              all deliveries without revisiting any location.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Graph Theory</Badge>
            <Badge variant="secondary">NP-Complete Problem</Badge>
            <Badge variant="secondary">Route Optimization</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
