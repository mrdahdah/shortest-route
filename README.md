# Logistics Routing Engine

A responsive web application demonstrating graph algorithms for delivery route optimization, similar to apps like Glovo and Deliveroo.

## Features

- **Interactive Graph Visualization**: Visual representation of delivery points (restaurant, customers, driver hub)
- **Dijkstra's Algorithm**: Step-by-step visualization of shortest path finding
- **Hamiltonian Path Detection**: Algorithm to check if all nodes can be visited exactly once
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Modern UI**: Powered by shadcn/ui components

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

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
Finds the optimal route from restaurant A to customer E, showing:
- Step-by-step execution
- Distance table updates
- Visited vs unvisited nodes
- Final shortest path and total distance

### 2. Hamiltonian Path Detection
Determines if a driver can visit all nodes exactly once, useful for:
- Route optimization
- Delivery scheduling
- Resource allocation

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── graph-visualization.tsx
│   ├── dijkstra-visualization.tsx
│   └── hamiltonian-check.tsx
└── lib/
    ├── utils.ts            # Utility functions
    └── graph.ts            # Graph algorithms
```

## License

MIT
