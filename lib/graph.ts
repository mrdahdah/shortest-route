export interface Node {
  id: string;
  label: string;
  type: 'restaurant' | 'customer' | 'driver-hub';
  x: number;
  y: number;
  lat: number;
  lng: number;
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
    { id: 'A', label: 'Restaurant A', type: 'restaurant', x: 200, y: 150, lat: 40.7589, lng: -73.9851 },
    { id: 'B', label: 'Customer B', type: 'customer', x: 100, y: 250, lat: 40.7489, lng: -73.9951 },
    { id: 'C', label: 'Customer C', type: 'customer', x: 300, y: 100, lat: 40.7689, lng: -73.9751 },
    { id: 'D', label: 'Customer D', type: 'customer', x: 400, y: 250, lat: 40.7489, lng: -73.9651 },
    { id: 'E', label: 'Customer E', type: 'customer', x: 500, y: 150, lat: 40.7589, lng: -73.9551 },
    { id: 'F', label: 'Driver Hub F', type: 'driver-hub', x: 300, y: 300, lat: 40.7389, lng: -73.9751 },
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

// TSP (Traveling Salesman Problem) - Visit all nodes once with shortest path
export interface TSPResult {
  path: string[];
  totalDistance: number;
  steps: TSPStep[];
}

export interface TSPStep {
  currentPath: string[];
  totalDistance: number;
  nextNode: string | null;
  remainingNodes: string[];
}

export function solveTSP(graph: Graph, startNode: string): TSPResult {
  const steps: TSPStep[] = [];
  const visited = new Set<string>([startNode]);
  const path = [startNode];
  let totalDistance = 0;

  steps.push({
    currentPath: [...path],
    totalDistance,
    nextNode: null,
    remainingNodes: graph.nodes.filter(n => n.id !== startNode).map(n => n.id),
  });

  while (visited.size < graph.nodes.length) {
    const current = path[path.length - 1];
    let nearestNode: string | null = null;
    let nearestDistance = Infinity;

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        const distance = getDistance(graph, current, node.id);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestNode = node.id;
        }
      }
    }

    if (nearestNode === null) break;

    path.push(nearestNode);
    visited.add(nearestNode);
    totalDistance += nearestDistance;

    steps.push({
      currentPath: [...path],
      totalDistance,
      nextNode: nearestNode,
      remainingNodes: graph.nodes.filter(n => !visited.has(n.id)).map(n => n.id),
    });
  }

  // Optionally return to start
  // const returnDistance = getDistance(graph, path[path.length - 1], startNode);
  // totalDistance += returnDistance;
  // path.push(startNode);

  return { path, totalDistance, steps };
}

// Helper function to get distance between two nodes
function getDistance(graph: Graph, from: string, to: string): number {
  const edge = graph.edges.find(
    e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );

  if (edge) return edge.weight;

  // If no direct edge, use Dijkstra to find shortest path
  const result = dijkstra(graph, from, to);
  return result.distance === Infinity ? Infinity : result.distance;
}

// Generate next available node ID
export function getNextNodeId(graph: Graph): string {
  const existingIds = graph.nodes.map(n => n.id);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (const letter of letters) {
    if (!existingIds.includes(letter)) return letter;
  }

  // If all letters used, start with AA, AB, etc.
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      const id = letters[i] + letters[j];
      if (!existingIds.includes(id)) return id;
    }
  }

  return 'N' + (graph.nodes.length + 1);
}
