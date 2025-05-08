import React, { useEffect } from 'react';
import Title from './Title';
import ReactFlow, { Node, Edge, Controls, useReactFlow, ReactFlowProvider } from 'reactflow';
import { TreeNode } from '../types';
import 'reactflow/dist/style.css';

interface Props {
  selectedQuestion: string | null;
  lockQuestion: () => void;
  decisionTree: TreeNode | null;
  scoreText: string;
}

// Recursively build a tree
const buildNodesAndEdges = (
  tree: TreeNode | null, 
  x = 0, 
  y = 0, 
  nodes: Node[] = [], 
  edges: Edge[] = [], 
  parentId: string | null = null
) => {
  if (!tree) return { nodes, edges };

  const id = `${nodes.length}`;
  nodes.push({ 
    id,
    data: { label: `${tree.question} (${tree.remainingCharacters.length})` },
    position: { x, y }
  });

  if (parentId) {
    edges.push({ 
      id: `${parentId}-->${id}`,
      source: parentId,
      target: id,
      animated: tree.isCorrect, 
      style: { stroke: tree.isCorrect ? "blue" : "gray", strokeWidth: 3 },
    });
  }

  const spacingX = 150;
  const spacingY = 100;

  if (tree.yesBranch) {
    buildNodesAndEdges(tree.yesBranch, x - spacingX, y + spacingY, nodes, edges, id);
  }

  if (tree.noBranch) {
    buildNodesAndEdges(tree.noBranch, x + spacingX, y + spacingY, nodes, edges, id);
  }

  return { nodes, edges };
};

const DecisionTreeContent: React.FC<Props> = ({ selectedQuestion, lockQuestion, decisionTree, scoreText }) => {
  const { setCenter } = useReactFlow();
  const { nodes, edges } = buildNodesAndEdges(decisionTree);

  useEffect(() => {
    if (nodes.length > 0) {
      // Find the last question node
      let lastQuestionNode = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const label = node.data.label;
  
        // Check if the node is not a "Yes" or "No" node
        if (!label.includes("✅ Yes") && !label.includes("❌ No")) {
          lastQuestionNode = node;
          break; // Stop once we find the last question node
        }
      }
      // If a valid question node is found, center the view on it
      if (lastQuestionNode) {
        setCenter(lastQuestionNode.position.x + 75, lastQuestionNode.position.y, { zoom: 1.5, duration: 1000 });
      }
    }
  }, [decisionTree, setCenter]);

  return (
    <div className="tree-section">
      <div className="sub-sections">
        <Title text={scoreText}/>
        <div className="tree-middle-section">
          <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              fitView
              elementsSelectable={false} 
              nodesConnectable={false}
            >
              <Controls />
            </ReactFlow>
          </div>
        </div>
        {/*
        <div className="bottom-section">
          <div className="select-buttons">
            <button
              onClick={lockQuestion}
              className={!selectedQuestion ? 'disabled-button' : ''}
              disabled={!selectedQuestion}
            >
              Lock Choice
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
    
  );
};

const DecisionTreeSection: React.FC<Props> = (props) => {
  return (
    <ReactFlowProvider>
      <DecisionTreeContent {...props} />
    </ReactFlowProvider>
  );
};

export default DecisionTreeSection;
