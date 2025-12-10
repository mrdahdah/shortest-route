# Logistics Routing Engine

A responsive web application demonstrating graph algorithms for delivery route optimization, similar to apps like Glovo and Deliveroo.

## Features

### Core Algorithms
- **Dijkstra's Algorithm**: Interactive step-by-step visualization of shortest path finding with animated path tracing
- **Hamiltonian Path Detection**: Algorithm to check if all nodes can be visited exactly once
- **Dynamic Route Planning**: Select any start and end points to calculate optimal routes

### Visualizations
- **Abstract Graph View**: SVG-based graph visualization with color-coded nodes and weighted edges
- **OpenStreetMap Integration**: Real-world geographic visualization using Leaflet and OpenStreetMap
- **Dual View Mode**: Toggle between abstract graph and map views during algorithm execution
- **Animated Path Tracing**: Watch routes being built step-by-step with smooth animations

### Analytics & Data
- **Statistics Dashboard**: Comprehensive graph metrics including density, connectivity, and edge analysis
- **Multi-format Export**: Export graph data as JSON, route analysis as TXT, or adjacency matrix as CSV
- **Real-time Metrics**: Track algorithm progress with visited/unvisited node counts

### User Experience
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

### 3. Graph Statistics
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
│   ├── page.tsx                                # Main dashboard with tabs
│   └── globals.css                             # Global styles + Leaflet CSS
├── components/
│   ├── ui/                                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   └── separator.tsx
│   ├── graph-visualization.tsx                 # SVG graph renderer
│   ├── dijkstra-visualization-enhanced.tsx     # Enhanced algorithm viz
│   ├── route-map.tsx                          # OpenStreetMap integration
│   ├── hamiltonian-check.tsx                  # Hamiltonian path checker
│   ├── statistics-dashboard.tsx               # Graph analytics
│   └── export-data.tsx                        # Data export utilities
└── lib/
    ├── utils.ts                                # Utility functions (cn)
    └── graph.ts                                # Graph algorithms & data
```

## Application Sections

### 1. Overview
- Side-by-side graph and map visualizations
- Scenario description and graph properties
- Real-world application context

### 2. Route Finder
- Dynamic start/end point selection
- Enhanced Dijkstra visualization with animation
- Toggle between graph and map views
- Real-time distance table updates

### 3. Path Analysis
- Hamiltonian path detection
- Graph connectivity analysis
- Educational content on graph theory

### 4. Statistics
- Comprehensive network metrics
- Edge analysis (longest/shortest routes)
- Graph density and connectivity stats
- Visual metric cards

### 5. Export
- JSON export (complete graph structure)
- TXT export (route analysis with all shortest paths)
- CSV export (adjacency matrix)
- Format documentation

## License

MIT
