"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { LatLngExpression, Icon, DivIcon } from "leaflet";
import { Graph, Node } from "@/lib/graph";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  graph: Graph;
  highlightedPath?: string[];
  currentNode?: string;
}

function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function RouteMap({ graph, highlightedPath = [], currentNode }: RouteMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-lg border bg-slate-100 flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const center: LatLngExpression = [40.7589, -73.9751];

  const createCustomIcon = (node: Node, isHighlighted: boolean, isCurrent: boolean) => {
    const colors = {
      'restaurant': isCurrent ? '#facc15' : '#ef4444',
      'customer': isCurrent ? '#facc15' : '#22c55e',
      'driver-hub': isCurrent ? '#facc15' : '#3b82f6',
    };

    const size = isCurrent ? 40 : isHighlighted ? 35 : 30;
    const color = colors[node.type];

    return new DivIcon({
      className: 'custom-icon',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-weight: bold;
          color: white;
          font-size: 14px;
          ${isCurrent ? 'animation: pulse 1.5s ease-in-out infinite;' : ''}
        ">
          ${node.id}
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        </style>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const pathCoordinates: LatLngExpression[] = highlightedPath
    .map(nodeId => graph.nodes.find(n => n.id === nodeId))
    .filter((node): node is Node => node !== undefined)
    .map(node => [node.lat, node.lng] as LatLngExpression);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />

        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            color="#9333ea"
            weight={4}
            opacity={0.8}
          />
        )}

        {graph.nodes.map(node => {
          const isHighlighted = highlightedPath.includes(node.id);
          const isCurrent = node.id === currentNode;

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomIcon(node, isHighlighted, isCurrent)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{node.label}</div>
                  <div className="text-muted-foreground capitalize">{node.type.replace('-', ' ')}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
