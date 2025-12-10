export interface Node {
  id: string;
  label: string;
  type: 'restaurant' | 'customer' | 'driver-hub';
  x: number;
  y: number;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export const sampleGraph: Graph = {
  nodes: [
    { id: 'A', label: 'Restaurant A', type: 'restaurant', x: 200, y: 150 },
    { id: 'B', label: 'Customer B', type: 'customer', x: 100, y: 250 },
    { id: 'C', label: 'Customer C', type: 'customer', x: 300, y: 100 },
    { id: 'D', label: 'Customer D', type: 'customer', x: 400, y: 250 },
    { id: 'E', label: 'Customer E', type: 'customer', x: 500, y: 150 },
    { id: 'F', label: 'Driver Hub F', type: 'driver-hub', x: 300, y: 300 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 5 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'A', to: 'E', weight: 7 },
    { from: 'B', to: 'F', weight: 4 },
    { from: 'C', to: 'D', weight: 6 },
    { from: 'C', to: 'E', weight: 4 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 3 },
    { from: 'E', to: 'F', weight: 5 },
  ],
};

export interface DijkstraStep {
  current: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: Set<string>;
  unvisited: Set<string>;
}

export function dijkstra(graph: Graph, start: string, end: string): {
  path: string[];
  distance: number;
  steps: DijkstraStep[];
} {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  const steps: DijkstraStep[] = [];

  graph.nodes.forEach(node => {
    distances[node.id] = node.id === start ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  while (unvisited.size > 0) {
    let current = Array.from(unvisited).reduce((min, node) =>
      distances[node] < distances[min] ? node : min
    );

    if (distances[current] === Infinity) break;

    const visited = new Set(graph.nodes.map(n => n.id).filter(n => !unvisited.has(n)));

    steps.push({
      current,
      distances: { ...distances },
      previous: { ...previous },
      visited: new Set(visited),
      unvisited: new Set(unvisited),
    });

    if (current === end) break;

    unvisited.delete(current);

    const neighbors = graph.edges.filter(e => e.from === current || e.to === current);

    neighbors.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbor)) return;

      const alt = distances[current] + edge.weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    });
  }

  const path: string[] = [];
  let current: string | null = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path[0] === start ? path : [],
    distance: distances[end],
    steps,
  };
}

export function hasHamiltonianPath(graph: Graph): boolean {
  const n = graph.nodes.length;
  const adjacencyList = new Map<string, Set<string>>();

  graph.nodes.forEach(node => adjacencyList.set(node.id, new Set()));
  graph.edges.forEach(edge => {
    adjacencyList.get(edge.from)?.add(edge.to);
    adjacencyList.get(edge.to)?.add(edge.from);
  });

  function dfs(path: string[]): boolean {
    if (path.length === n) return true;

    const current = path[path.length - 1];
    const neighbors = adjacencyList.get(current) || new Set();

    for (const neighbor of neighbors) {
      if (!path.includes(neighbor)) {
        path.push(neighbor);
        if (dfs(path)) return true;
        path.pop();
      }
    }

    return false;
  }

  for (const node of graph.nodes) {
    if (dfs([node.id])) return true;
  }

  return false;
}
