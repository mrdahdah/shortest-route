export interface Node {
  id: string;
  label: string;
  type: 'restaurant' | 'customer' | 'driver-hub';
  x: number;
  y: number;
  lat: number;
  lng: number;
  priority?: 'urgent' | 'standard' | 'low';
  capacity?: number; // For delivery capacity
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
  traffic?: number; // Traffic multiplier (1.0 = normal, 1.5 = heavy traffic)
  cost?: number; // Cost per unit distance
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

// A* Search Algorithm (heuristic-based pathfinding)
export interface AStarStep {
  current: string;
  gScore: Record<string, number>; // Cost from start
  fScore: Record<string, number>; // g + h (estimated total cost)
  previous: Record<string, string | null>;
  openSet: Set<string>;
  closedSet: Set<string>;
}

export function aStarSearch(graph: Graph, start: string, end: string): {
  path: string[];
  distance: number;
  steps: AStarStep[];
} {
  const startNode = graph.nodes.find(n => n.id === start);
  const endNode = graph.nodes.find(n => n.id === end);

  if (!startNode || !endNode) {
    return { path: [], distance: Infinity, steps: [] };
  }

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const openSet = new Set<string>([start]);
  const closedSet = new Set<string>();
  const steps: AStarStep[] = [];

  // Heuristic function: Euclidean distance
  const heuristic = (fromId: string, toId: string): number => {
    const fromNode = graph.nodes.find(n => n.id === fromId);
    const toNode = graph.nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) return 0;

    const dx = fromNode.x - toNode.x;
    const dy = fromNode.y - toNode.y;
    return Math.sqrt(dx * dx + dy * dy) / 50; // Scale to approximate minutes
  };

  graph.nodes.forEach(node => {
    gScore[node.id] = node.id === start ? 0 : Infinity;
    fScore[node.id] = node.id === start ? heuristic(start, end) : Infinity;
    previous[node.id] = null;
  });

  while (openSet.size > 0) {
    // Get node with lowest fScore
    let current = Array.from(openSet).reduce((min, node) =>
      fScore[node] < fScore[min] ? node : min
    );

    steps.push({
      current,
      gScore: { ...gScore },
      fScore: { ...fScore },
      previous: { ...previous },
      openSet: new Set(openSet),
      closedSet: new Set(closedSet),
    });

    if (current === end) break;

    openSet.delete(current);
    closedSet.add(current);

    const neighbors = graph.edges.filter(e => e.from === current || e.to === current);

    neighbors.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (closedSet.has(neighbor)) return;

      const tentativeGScore = gScore[current] + edge.weight * (edge.traffic || 1.0);

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeGScore >= gScore[neighbor]) {
        return;
      }

      previous[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
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
    distance: gScore[end],
    steps,
  };
}

// 2-Opt TSP Optimization
export function optimize2Opt(graph: Graph, initialPath: string[]): {
  path: string[];
  totalDistance: number;
  improvement: number;
} {
  if (initialPath.length < 4) return {
    path: initialPath,
    totalDistance: calculatePathDistance(graph, initialPath),
    improvement: 0
  };

  let route = [...initialPath];
  let improved = true;
  let bestDistance = calculatePathDistance(graph, route);
  const initialDistance = bestDistance;

  while (improved) {
    improved = false;

    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const newRoute = twoOptSwap(route, i, j);
        const newDistance = calculatePathDistance(graph, newRoute);

        if (newDistance < bestDistance) {
          route = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return {
    path: route,
    totalDistance: bestDistance,
    improvement: initialDistance - bestDistance
  };
}

function twoOptSwap(route: string[], i: number, j: number): string[] {
  const newRoute = route.slice(0, i);
  const reversed = route.slice(i, j + 1).reverse();
  const end = route.slice(j + 1);
  return [...newRoute, ...reversed, ...end];
}

function calculatePathDistance(graph: Graph, path: string[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += getDistance(graph, path[i], path[i + 1]);
  }
  return total;
}

// Cost Calculation
export interface RouteCost {
  distance: number;
  time: number; // in minutes
  fuelCost: number;
  driverCost: number;
  totalCost: number;
}

export function calculateRouteCost(
  graph: Graph,
  path: string[],
  costPerKm: number = 0.5,
  driverHourlyRate: number = 15
): RouteCost {
  const distance = calculatePathDistance(graph, path);
  const time = distance; // Assuming weight is in minutes
  const distanceKm = distance * 0.5; // Approximate conversion

  const fuelCost = distanceKm * costPerKm;
  const driverCost = (time / 60) * driverHourlyRate;
  const totalCost = fuelCost + driverCost;

  return {
    distance,
    time,
    fuelCost,
    driverCost,
    totalCost
  };
}

// Traffic Simulation
export function applyTrafficConditions(
  graph: Graph,
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'random'
): Graph {
  const trafficMultipliers = {
    light: 1.1,
    moderate: 1.3,
    heavy: 1.6,
    random: 1.0 // Will be randomized
  };

  return {
    ...graph,
    edges: graph.edges.map(edge => ({
      ...edge,
      traffic: trafficLevel === 'random'
        ? 1 + Math.random() * 0.8 // Random between 1.0 and 1.8
        : trafficMultipliers[trafficLevel]
    }))
  };
}

// Priority-based routing
export function getPriorityScore(node: Node): number {
  const priorityScores = {
    urgent: 3,
    standard: 2,
    low: 1
  };
  return priorityScores[node.priority || 'standard'];
}

export function sortNodesByPriority(nodes: Node[]): Node[] {
  return [...nodes].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
}

// Driver capacity constraint
export function splitRoutesByCapacity(
  graph: Graph,
  nodes: Node[],
  maxCapacity: number
): string[][] {
  const routes: string[][] = [];
  let currentRoute: string[] = [];
  let currentCapacity = 0;

  const sortedNodes = sortNodesByPriority(nodes);

  for (const node of sortedNodes) {
    const nodeCapacity = node.capacity || 1;

    if (currentCapacity + nodeCapacity > maxCapacity && currentRoute.length > 0) {
      routes.push([...currentRoute]);
      currentRoute = [];
      currentCapacity = 0;
    }

    currentRoute.push(node.id);
    currentCapacity += nodeCapacity;
  }

  if (currentRoute.length > 0) {
    routes.push(currentRoute);
  }

  return routes;
}

// Return to hub enhancement for TSP
export function solveTSPWithReturn(graph: Graph, startNode: string, returnToStart: boolean = true): TSPResult {
  const result = solveTSP(graph, startNode);

  if (returnToStart && result.path.length > 0) {
    const lastNode = result.path[result.path.length - 1];
    const returnDistance = getDistance(graph, lastNode, startNode);

    return {
      path: [...result.path, startNode],
      totalDistance: result.totalDistance + returnDistance,
      steps: result.steps
    };
  }

  return result;
}
