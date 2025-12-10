"use client";

import { Graph, dijkstra } from "@/lib/graph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileJson, FileText } from "lucide-react";

interface ExportDataProps {
  graph: Graph;
}

export function ExportData({ graph }: ExportDataProps) {
  const exportAsJSON = () => {
    const dataStr = JSON.stringify(graph, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'logistics-graph.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportRouteAnalysis = () => {
    let analysis = 'LOGISTICS ROUTE ANALYSIS\n';
    analysis += '=' .repeat(50) + '\n\n';

    analysis += 'GRAPH STATISTICS:\n';
    analysis += '-'.repeat(50) + '\n';
    analysis += `Total Nodes: ${graph.nodes.length}\n`;
    analysis += `Total Edges: ${graph.edges.length}\n\n`;

    analysis += 'NODES:\n';
    analysis += '-'.repeat(50) + '\n';
    graph.nodes.forEach(node => {
      analysis += `${node.id} - ${node.label} (${node.type})\n`;
      analysis += `  Location: ${node.lat}, ${node.lng}\n`;
    });

    analysis += '\nEDGES (Travel Times):\n';
    analysis += '-'.repeat(50) + '\n';
    graph.edges.forEach(edge => {
      analysis += `${edge.from} ↔ ${edge.to}: ${edge.weight} minutes\n`;
    });

    analysis += '\nSHORTEST PATHS:\n';
    analysis += '-'.repeat(50) + '\n';
    const nodes = graph.nodes.map(n => n.id);
    nodes.forEach(start => {
      nodes.forEach(end => {
        if (start !== end) {
          const result = dijkstra(graph, start, end);
          if (result.path.length > 0) {
            analysis += `${start} → ${end}: ${result.path.join(' → ')} (${result.distance} min)\n`;
          }
        }
      });
    });

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(analysis);
    const exportFileDefaultName = 'route-analysis.txt';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAdjacencyMatrix = () => {
    const nodeIds = graph.nodes.map(n => n.id);
    const matrix: number[][] = Array(nodeIds.length).fill(0).map(() => Array(nodeIds.length).fill(0));

    graph.edges.forEach(edge => {
      const fromIdx = nodeIds.indexOf(edge.from);
      const toIdx = nodeIds.indexOf(edge.to);
      matrix[fromIdx][toIdx] = edge.weight;
      matrix[toIdx][fromIdx] = edge.weight;
    });

    let csv = ',' + nodeIds.join(',') + '\n';
    nodeIds.forEach((nodeId, i) => {
      csv += nodeId + ',' + matrix[i].join(',') + '\n';
    });

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const exportFileDefaultName = 'adjacency-matrix.csv';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download graph data and analysis in various formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={exportAsJSON} variant="outline" className="w-full justify-start">
          <FileJson className="mr-2 h-4 w-4" />
          Export Graph as JSON
        </Button>
        <Button onClick={exportRouteAnalysis} variant="outline" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Export Route Analysis (TXT)
        </Button>
        <Button onClick={exportAdjacencyMatrix} variant="outline" className="w-full justify-start">
          <Download className="mr-2 h-4 w-4" />
          Export Adjacency Matrix (CSV)
        </Button>
      </CardContent>
    </Card>
  );
}
