# Logistics Routing Engine 🚚

A comprehensive, production-ready web application for delivery route optimization. Features advanced algorithms, real-time cost calculation, traffic simulation, and multi-vehicle routing - built for Glovo-scale logistics!

**🚀 Latest:** Dark Mode, A* Search, 2-Opt TSP Optimization, Priority Orders, Driver Capacity Constraints, Traffic Simulation, and Cost Analysis!

## Features

### Core Algorithms
- **Dijkstra's Algorithm**: Classic shortest path with step-by-step visualization
- **A* Search**: Heuristic-based pathfinding with Euclidean distance estimation
- **Algorithm Comparison**: Side-by-side Dijkstra vs A* with performance metrics
- **TSP Solver**: Nearest Neighbor heuristic for visiting all nodes once
- **2-Opt Optimization**: Improve TSP solutions by eliminating route crossings
- **Hamiltonian Path Detection**: Check if all nodes can be visited exactly once
- **Multi-Vehicle Routing**: Split routes by driver capacity constraints

### Visualizations
- **Abstract Graph View**: SVG-based graph visualization with color-coded nodes and weighted edges
- **OpenStreetMap Integration**: Real-world geographic visualization using Leaflet and OpenStreetMap
- **Fullscreen Map Mode**: Expand map to fullscreen for better route visualization
- **Dual View Mode**: Toggle between abstract graph and map views during algorithm execution
- **Animated Path Tracing**: Watch routes being built step-by-step with smooth animations

### Graph Builder
- **Interactive Graph Editor**: Add, edit, and delete nodes and edges in real-time
- **Node Customization**: Change node names, types (restaurant/customer/hub), and coordinates
- **Edge Management**: Add weighted edges, adjust weights, delete connections
- **Import/Export**: Save and load custom graphs as JSON files
- **Live Preview**: See changes instantly on both graph and map views

### Analytics & Data
- **Statistics Dashboard**: Comprehensive graph metrics including density, connectivity, and edge analysis
- **Multi-format Export**: Export graph data as JSON, route analysis as TXT, or adjacency matrix as CSV
- **Real-time Metrics**: Track algorithm progress with visited/unvisited node counts

### Business Features
- **Cost Calculation**: Automatic fuel and driver cost computation per route
- **Traffic Simulation**: Apply traffic conditions (light/moderate/heavy/random)
- **Priority Orders**: Urgent, standard, and low priority delivery support
- **Driver Capacity**: Automatic route splitting based on vehicle capacity
- **Return to Hub**: Complete delivery circuits with return leg

### User Experience
- **Dark Mode**: Professional night-friendly interface with theme toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop with Tailwind CSS
- **Interactive Controls**: Play, pause, step-forward, and reset controls for algorithm visualization
- **Modern UI**: Powered by shadcn/ui components with clean, accessible design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Maps**: Leaflet + React-Leaflet with OpenStreetMap tiles
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Graph Structure

The application uses a weighted graph with 6 nodes:
- **A**: Restaurant (starting point)
- **B, C, D, E**: Customer delivery locations
- **F**: Driver hub (return point)

Edges represent travel time in minutes between locations.

## Algorithms Implemented

### 1. Dijkstra's Shortest Path
Finds the optimal route between any two nodes in the graph:
- **Interactive Controls**: Play, pause, step-forward, and reset
- **Step-by-step Execution**: Watch the algorithm process each node
- **Distance Table**: Real-time updates showing distances and paths
- **Dual Visualization**: View on abstract graph or real map
- **Animated Results**: Path traced with smooth animation
- **Complete Metrics**: Total distance, nodes visited, and full path

### 2. Hamiltonian Path Detection
Determines if a driver can visit all nodes exactly once:
- Depth-first search implementation
- Visual feedback on path existence
- Educational explanations of graph theory concepts
- Useful for route optimization and delivery scheduling

### 3. A* Search
Advanced pathfinding with heuristics:
- Euclidean distance heuristic guides search
- Faster than Dijkstra in many cases
- Open/closed set visualization
- gScore and fScore tracking
- Direct comparison with Dijkstra
- Traffic-aware routing

### 4. TSP Solver (Basic)
Traveling Salesman Problem using Nearest Neighbor:
- Visit all nodes exactly once
- Greedy nearest-neighbor approach
- Step-by-step visualization
- Selectable starting point

### 5. TSP Pro (Enhanced)
Advanced TSP with optimization:
- 2-Opt route optimization (eliminates crossings)
- Return to hub option
- Driver capacity constraints
- Multi-vehicle routing
- Cost breakdown (fuel + driver)
- Improvement percentages

### 6. Graph Statistics
Comprehensive analysis of the delivery network:
- Node and edge counts by type
- Graph density calculation
- Average travel times
- Longest and shortest routes
- Connectivity analysis

## Project Structure

```
├── app/
│   ├── layout.tsx                              # Root layout with metadata
│   ├── page.tsx                                # Main dashboard with 7 tabs
│   └── globals.css                             # Global styles + Leaflet CSS
├── components/
│   ├── ui/                                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── dialog.tsx                          # Dialog/Modal component
│   │   ├── input.tsx                           # Text input
│   │   ├── label.tsx                           # Form labels
│   │   └── textarea.tsx                        # Textarea input
│   ├── graph-visualization.tsx                 # SVG graph renderer
│   ├── dijkstra-visualization-enhanced.tsx     # Enhanced Dijkstra viz
│   ├── tsp-visualization.tsx                   # TSP algorithm viz ⭐ NEW
│   ├── graph-builder.tsx                       # Interactive graph editor ⭐ NEW
│   ├── route-map.tsx                           # Basic OpenStreetMap
│   ├── fullscreen-map.tsx                      # Map with fullscreen mode ⭐ NEW
│   ├── hamiltonian-check.tsx                   # Hamiltonian path checker
│   ├── statistics-dashboard.tsx                # Graph analytics
│   └── export-data.tsx                         # Data export utilities
└── lib/
    ├── utils.ts                                # Utility functions (cn)
    └── graph.ts                                # Graph algorithms & TSP solver
```

## Application Sections (9 Tabs)

### 1. Overview
- Side-by-side graph and map visualizations with fullscreen support
- Scenario description and graph properties
- Real-world application context (Glovo/Deliveroo)

### 2. Graph Builder
- Interactive graph editor for custom networks
- Add/edit/delete nodes with customizable names and types
- Create and modify weighted edges
- Live preview with dual graph/map views
- Import/export custom graphs

### 3. Dijkstra
- Dynamic start/end point selection
- Enhanced Dijkstra visualization with animation
- Toggle between graph and map views
- Real-time distance table updates

### 4. A* vs Dijkstra 🔥 NEW
- Side-by-side algorithm comparison
- Traffic condition simulation
- Cost breakdown (fuel + driver)
- Performance metrics (time, steps, cost)
- Winner highlighting

### 5. TSP Basic
- Visit all nodes exactly once
- Nearest neighbor heuristic algorithm
- Animated step-by-step solution
- Selectable starting node

### 6. TSP Pro 🔥 NEW
- 2-Opt optimization for better routes
- Return to hub toggle
- Driver capacity constraints
- Multi-vehicle route splitting
- Cost analysis and improvement metrics

### 7. Path Analysis
- Hamiltonian path detection
- Graph connectivity analysis
- Educational content on graph theory

### 8. Statistics
- Comprehensive network metrics
- Edge analysis (longest/shortest routes)
- Graph density and connectivity stats
- Visual metric cards

### 9. Export
- JSON export (complete graph structure)
- TXT export (route analysis with all shortest paths)
- CSV export (adjacency matrix)
- Format documentation

## License

MIT
