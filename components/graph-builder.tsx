"use client";

import { useState } from "react";
import { Graph, Node, Edge, getNextNodeId } from "@/lib/graph";
import { GraphVisualization } from "@/components/graph-visualization";
import { FullscreenMap } from "@/components/fullscreen-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, GitBranch, Map as MapIcon, Save, Download, Upload } from "lucide-react";

interface GraphBuilderProps {
  initialGraph: Graph;
  onGraphChange: (graph: Graph) => void;
}

export function GraphBuilder({ initialGraph, onGraphChange }: GraphBuilderProps) {
  const [graph, setGraph] = useState<Graph>(initialGraph);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // New node form state
  const [newNodeId, setNewNodeId] = useState(getNextNodeId(graph));
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<'restaurant' | 'customer' | 'driver-hub'>('customer');
  const [newNodeX, setNewNodeX] = useState(300);
  const [newNodeY, setNewNodeY] = useState(200);
  const [newNodeLat, setNewNodeLat] = useState(40.7589);
  const [newNodeLng, setNewNodeLng] = useState(-73.9751);

  // New edge form state
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState(5);

  const updateGraph = (updatedGraph: Graph) => {
    setGraph(updatedGraph);
    onGraphChange(updatedGraph);
  };

  const handleAddNode = () => {
    const newNode: Node = {
      id: newNodeId,
      label: newNodeLabel || `Node ${newNodeId}`,
      type: newNodeType,
      x: newNodeX,
      y: newNodeY,
      lat: newNodeLat,
      lng: newNodeLng,
    };

    updateGraph({
      ...graph,
      nodes: [...graph.nodes, newNode],
    });

    // Reset form
    const nextId = getNextNodeId({ ...graph, nodes: [...graph.nodes, newNode] });
    setNewNodeId(nextId);
    setNewNodeLabel('');
    setNewNodeType('customer');
    setIsAddNodeOpen(false);
  };

  const handleEditNode = () => {
    if (!selectedNode) return;

    updateGraph({
      ...graph,
      nodes: graph.nodes.map(n =>
        n.id === selectedNode.id ? selectedNode : n
      ),
    });

    setIsEditNodeOpen(false);
    setSelectedNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (confirm(`Are you sure you want to delete node ${nodeId}? This will also remove all connected edges.`)) {
      updateGraph({
        nodes: graph.nodes.filter(n => n.id !== nodeId),
        edges: graph.edges.filter(e => e.from !== nodeId && e.to !== nodeId),
      });
    }
  };

  const handleAddEdge = () => {
    if (edgeFrom && edgeTo && edgeFrom !== edgeTo) {
      // Check if edge already exists
      const exists = graph.edges.some(
        e => (e.from === edgeFrom && e.to === edgeTo) || (e.from === edgeTo && e.to === edgeFrom)
      );

      if (!exists) {
        updateGraph({
          ...graph,
          edges: [...graph.edges, { from: edgeFrom, to: edgeTo, weight: edgeWeight }],
        });
        setIsAddEdgeOpen(false);
        setEdgeFrom('');
        setEdgeTo('');
        setEdgeWeight(5);
      } else {
        alert('An edge already exists between these nodes!');
      }
    }
  };

  const handleDeleteEdge = (edge: Edge) => {
    if (confirm(`Delete edge ${edge.from} ↔ ${edge.to}?`)) {
      updateGraph({
        ...graph,
        edges: graph.edges.filter(e => !(e.from === edge.from && e.to === edge.to)),
      });
    }
  };

  const handleUpdateEdgeWeight = (edge: Edge, newWeight: number) => {
    updateGraph({
      ...graph,
      edges: graph.edges.map(e =>
        e.from === edge.from && e.to === edge.to
          ? { ...e, weight: newWeight }
          : e
      ),
    });
  };

  const handleExportGraph = () => {
    const dataStr = JSON.stringify(graph, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'custom-graph.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedGraph = JSON.parse(e.target?.result as string);
        updateGraph(importedGraph);
      } catch (error) {
        alert('Invalid graph file format!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph Builder</CardTitle>
          <CardDescription>
            Create and customize your delivery network by adding nodes and edges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Node</DialogTitle>
                  <DialogDescription>Create a new delivery point in your network</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-id" className="text-right">ID</Label>
                    <Input
                      id="node-id"
                      value={newNodeId}
                      onChange={(e) => setNewNodeId(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-label" className="text-right">Label</Label>
                    <Input
                      id="node-label"
                      value={newNodeLabel}
                      onChange={(e) => setNewNodeLabel(e.target.value)}
                      placeholder={`Node ${newNodeId}`}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-type" className="text-right">Type</Label>
                    <Select value={newNodeType} onValueChange={(v: any) => setNewNodeType(v)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="driver-hub">Driver Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-lat" className="text-right">Latitude</Label>
                    <Input
                      id="node-lat"
                      type="number"
                      step="0.0001"
                      value={newNodeLat}
                      onChange={(e) => setNewNodeLat(parseFloat(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-lng" className="text-right">Longitude</Label>
                    <Input
                      id="node-lng"
                      type="number"
                      step="0.0001"
                      value={newNodeLng}
                      onChange={(e) => setNewNodeLng(parseFloat(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddNode}>Add Node</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddEdgeOpen} onOpenChange={setIsAddEdgeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <GitBranch className="mr-2 h-4 w-4" />
                  Add Edge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Edge</DialogTitle>
                  <DialogDescription>Connect two nodes with a weighted edge</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-from" className="text-right">From</Label>
                    <Select value={edgeFrom} onValueChange={setEdgeFrom}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {graph.nodes.map(node => (
                          <SelectItem key={node.id} value={node.id}>{node.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-to" className="text-right">To</Label>
                    <Select value={edgeTo} onValueChange={setEdgeTo}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {graph.nodes.map(node => (
                          <SelectItem key={node.id} value={node.id}>{node.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-weight" className="text-right">Weight (min)</Label>
                    <Input
                      id="edge-weight"
                      type="number"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEdge}>Add Edge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleExportGraph}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button variant="outline" asChild>
              <label>
                <Upload className="mr-2 h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportGraph}
                />
              </label>
            </Button>
          </div>

          <div className="pt-4">
            <Tabs defaultValue="graph">
              <TabsList>
                <TabsTrigger value="graph">Graph View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="graph" className="mt-4">
                <GraphVisualization graph={graph} />
              </TabsContent>
              <TabsContent value="map" className="mt-4">
                <FullscreenMap graph={graph} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nodes ({graph.nodes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {graph.nodes.map(node => (
                <div key={node.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-lg">{node.id}</div>
                    <div>
                      <div className="font-medium">{node.label}</div>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {node.type.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedNode(node);
                        setIsEditNodeOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNode(node.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edges ({graph.edges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {graph.edges.map((edge, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {edge.from} ↔ {edge.to}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Label className="text-xs">Weight:</Label>
                      <Input
                        type="number"
                        value={edge.weight}
                        onChange={(e) => handleUpdateEdgeWeight(edge, parseInt(e.target.value))}
                        className="w-20 h-7 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteEdge(edge)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={isEditNodeOpen} onOpenChange={setIsEditNodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>Update node properties</DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID</Label>
                <Input value={selectedNode.id} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-label" className="text-right">Label</Label>
                <Input
                  id="edit-label"
                  value={selectedNode.label}
                  onChange={(e) => setSelectedNode({ ...selectedNode, label: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <Select
                  value={selectedNode.type}
                  onValueChange={(v: any) => setSelectedNode({ ...selectedNode, type: v })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="driver-hub">Driver Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={selectedNode.lat}
                  onChange={(e) => setSelectedNode({ ...selectedNode, lat: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={selectedNode.lng}
                  onChange={(e) => setSelectedNode({ ...selectedNode, lng: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditNode}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
