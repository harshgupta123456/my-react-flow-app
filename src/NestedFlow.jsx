import { useCallback, useState,useEffect } from 'react';
import './Edges.css';
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: '' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: {
      label: '',
      view: 'default',
      content: 'Main content for Group A',
      cardData: {
        label: 'Group A Card',
        view: 'card',
        name: 'Harsh',
        description: 'hello',
        content: 'hii folks kaise ho',
      },
    },
    position: { x: 100, y: 100 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
  },
  {
    id: '2a',
    data: {
      label: '',
      view: 'card',
      name: 'Node A.1',
      description: 'Description for Node A.1',
      content: 'Content for Node A.1',
    },
    position: { x: 10, y: 50 },
    parentId: '2',
  },
  {
    id: '3',
    data: {
      label: '',
      view: 'default',
      content: 'Main content for Node 1',
      cardData: {
        label: 'Node 1 Card',
        view: 'card',
        name: 'Node 1',
        description: 'Description for Node 1',
        content: 'Card content for Node 1',
      },
    },
    position: { x: 320, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: {
      label: '',
      view: 'default',
      content: 'Main content for Group B',
      cardData: {
        label: 'Group B Card',
        view: 'card',
        name: 'Group B',
        description: 'Description for Group B',
        content: 'Card content for Group B',
      },
    },
    position: { x: 320, y: 200 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 300, height: 300 },
    type: 'group',
  },
  {
    id: '4a',
    data: { label: '' },
    position: { x: 15, y: 65 },
    className: 'light',
    parentId: '4',
    extent: 'parent',
  },
  {
    id: '4b',
    data: {
      label: '',
      view: 'default',
      content: 'Main content for Group B.A',
      cardData: {
        label: 'Group B.A Card',
        view: 'card',
        name: 'HARSH',
        description: 'Description for Group B.A',
        content: 'Card content for Group B.A',
      },
    },
    position: { x: 15, y: 120 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 255, 0.2)', height: 150, width: 270 },
    parentId: '4',
  },
  {
    id: '4b1',
    data: { label: '' },
    position: { x: 20, y: 40 },
    className: 'light',
    parentId: '4b',
  },
  {
    id: '4b2',
    data: { label: '' },
    position: { x: 100, y: 100 },
    className: 'light',
    parentId: '4b',
  },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2a-4a', source: '2a', target: '4a' }, // Connect 2a card view to 4a
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2' },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];

const NestedFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCard, setShowCard] = useState(null); // State to manage which card to show
  useEffect(() => {
    fetch('your_json_data_url')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setNodes(data.nodes);
        setEdges(data.edges);
      })
      .catch((error) => {
        console.error('Error fetching JSON data:', error);
      });
  }, []);
  

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const toggleCard = (nodeId) => {
    setShowCard(showCard === nodeId ? null : nodeId); //  card view
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="react-flow-subflows-example"
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />

        {/* Custom node  */}
        {nodes.map((node) => (
          <div key={node.id}>
            <div className="default-node" style={node.style}>
              <p>{node.data.label}</p>
            </div>
            {node.data.view === 'card' && node.data.cardData && (
              <div className="card-node" style={{ ...node.style }}>
                <h3>{node.data.cardData.name}</h3>
                <p>{node.data.cardData.description}</p>
              </div>
            )}
          </div>
        ))}

        {/* Render edges */}
        {edges.map((edge) => (
          <div key={edge.id}>
            <svg style={{ position: 'absolute', pointerEvents: 'none', zIndex: 0 }}>
              <path
                id={`edge-${edge.id}`}
                className="animated-edge"
                d={`M${nodes.find((n) => n.id === edge.source).position.x},${nodes.find((n) => n.id === edge.source).position.y} L${nodes.find((n) => n.id === edge.target).position.x},${nodes.find((n) => n.id === edge.target).position.y}`}
              />
            </svg>
          </div>
        ))}
      </ReactFlow>
    </div>
  );
};

export default NestedFlow;