"use client";

import { Graph, Node, Edge } from "@/lib/graph";
import { Badge } from "@/components/ui/badge";

interface GraphVisualizationProps {
  graph: Graph;
  highlightedPath?: string[];
  currentNode?: string;
  visitedNodes?: Set<string>;
}

export function GraphVisualization({
  graph,
  highlightedPath = [],
  currentNode,
  visitedNodes = new Set(),
}: GraphVisualizationProps) {
  const getNodeColor = (node: Node) => {
    if (node.type === 'restaurant') return 'fill-red-500';
    if (node.type === 'driver-hub') return 'fill-blue-500';
    return 'fill-green-500';
  };

  const getNodeStroke = (nodeId: string) => {
    if (nodeId === currentNode) return 'stroke-yellow-400 stroke-[4]';
    if (highlightedPath.includes(nodeId)) return 'stroke-purple-500 stroke-[3]';
    if (visitedNodes.has(nodeId)) return 'stroke-gray-400 stroke-[2]';
    return 'stroke-gray-700 stroke-[2]';
  };

  const isEdgeInPath = (edge: Edge) => {
    const fromIndex = highlightedPath.indexOf(edge.from);
    const toIndex = highlightedPath.indexOf(edge.to);
    return fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1;
  };

  return (
    <div className="w-full">
      <svg viewBox="0 0 600 400" className="w-full h-auto border rounded-lg bg-slate-50">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#666" />
          </marker>
        </defs>

        {graph.edges.map((edge, idx) => {
          const fromNode = graph.nodes.find(n => n.id === edge.from);
          const toNode = graph.nodes.find(n => n.id === edge.to);

          if (!fromNode || !toNode) return null;

          const isInPath = isEdgeInPath(edge);
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          return (
            <g key={idx}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={isInPath ? 'stroke-purple-500' : 'stroke-gray-400'}
                strokeWidth={isInPath ? 3 : 2}
              />
              <text
                x={midX}
                y={midY - 5}
                className="text-xs fill-gray-700 font-semibold"
                textAnchor="middle"
              >
                {edge.weight}min
              </text>
            </g>
          );
        })}

        {graph.nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={25}
              className={`${getNodeColor(node)} ${getNodeStroke(node.id)}`}
            />
            <text
              x={node.x}
              y={node.y + 5}
              className="text-sm font-bold fill-white"
              textAnchor="middle"
            >
              {node.id}
            </text>
            <text
              x={node.x}
              y={node.y + 45}
              className="text-xs fill-gray-700"
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-red-500 text-white border-red-600">
          Restaurant
        </Badge>
        <Badge variant="outline" className="bg-green-500 text-white border-green-600">
          Customer
        </Badge>
        <Badge variant="outline" className="bg-blue-500 text-white border-blue-600">
          Driver Hub
        </Badge>
      </div>
    </div>
  );
}
