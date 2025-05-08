import React, { useState } from "react";
import { QuestionHistoryEntry, TreeNode } from "../types";
import ReactFlow, { Node, Edge, Background, Controls } from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const buildOptimalTreeGraph = (
  tree: TreeNode | null,
  x = 0,
  y = 0,
  nodes: Node[] = [],
  edges: Edge[] = [],
  parentId: string | null = null,
  depth = 0,
  isYesPath: boolean | null = null // Track if it's a Yes or No path
) => {
  // Adjust positioning for better spacing
  const spacing = [1450, 725, 375, 170, 80, 80]; // Predefined X spacing for each depth level
  const spacingX = spacing[depth] || 80;
  const spacingY = 120;
  if (!tree) return { nodes, edges };

  const id = `${nodes.length}`;

  if (tree.remainingCharacters.length === 0) {
    nodes.push({
      id,
      data: { label: tree.question },
      position: { x, y },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-->${id}`,
        source: parentId,
        target: id,
        animated: true,
        style: { stroke: isYesPath ? "green" : "red", strokeWidth: 3 }, // Green for Yes, Red for No
      });
    }
  } else {
    nodes.push({
      id,
      data: { label: `${tree.question} (${tree.remainingCharacters.length})` },
      position: { x, y },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-->${id}`,
        source: parentId,
        target: id,
        animated: true,
        style: { stroke: isYesPath ? "green" : "red", strokeWidth: 3 }, // Green for Yes, Red for No
      });
    }
  }

  if (tree.yesBranch) {
    buildOptimalTreeGraph(tree.yesBranch, x - spacingX, y + spacingY, nodes, edges, id, depth + 1, true);
  }

  if (tree.noBranch) {
    buildOptimalTreeGraph(tree.noBranch, x + spacingX, y + spacingY, nodes, edges, id, depth + 1, false);
  }

  return { nodes, edges };
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onRestart: () => void;
  questionHistory: QuestionHistoryEntry[];
  optimalTree: TreeNode | null;
};

const GameRecap: React.FC<Props> = ({
  isVisible,
  onClose,
  onRestart,
  questionHistory,
  optimalTree,
}) => {
  const [showOptimalTree, setShowOptimalTree] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCongratsMessage, setShowCongratsMessage] = useState(true); 

  const restartGame = () => {
    onRestart();
    setCurrentQuestionIndex(0);
    setShowCongratsMessage(true); // Reset the congratulations message when restarting
    setShowOptimalTree(false); // Reset the optimal tree visibility
  }


  if (!isVisible) return null;

  const { nodes, edges } = buildOptimalTreeGraph(optimalTree);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionHistory.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startReviewing = () => {
    setShowCongratsMessage(false);
  };

  const currentQuestion = questionHistory[currentQuestionIndex];

  return (
  <div className="overlay" onClick={onClose}>
    <div className="recap-container" onClick={(e) => e.stopPropagation()}>

      {/* Show Previous button when not showing the optimal tree */}
      {!showOptimalTree  && !showCongratsMessage  &&(
        <div className="prev-buttons">
          <button
            className="prev-btn"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      )}

      {/* Show Optimal Tree when enabled */}
      {showOptimalTree && optimalTree && (
        <div className="optimal-tree-modal">
          <div className="optimal-tree-container">
            <h3>Optimal Decision Tree</h3>
            <ReactFlow nodes={nodes} edges={edges} fitView elementsSelectable={false} nodesConnectable={false}>
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <div className="optimal-tree-recap-buttons">
          <button className="button1" onClick={restartGame}>
            Restart Game
          </button>
          <button
            className="button1"
            onClick={() => {
              setShowOptimalTree(!showOptimalTree)
              console.log(optimalTree)
            }
          }
          >
            Hide Optimal Tree
            </button>
            </div>
          </div>
        )}


        {showCongratsMessage && !showOptimalTree &&  (
          <div className="congrats-message">
            <div className="congrats-text">
                <h2>Congratulations on Winning!</h2>
                <p>Click below to see how well you did for each question.</p>
                </div>
                <button className="congrats-button" onClick={startReviewing}>
                  Start Reviewing
                </button>
              </div>
            )}

      {/* Show recap content only when not showing the optimal tree */}
      {!showOptimalTree && !showCongratsMessage &&(
          <div className="recap-content">
            
            {/* Show recap text once the player clicks to start reviewing */}
              <div className="recap-text">
                <h2>Game Recap</h2>
                <p>Here’s how you played:</p>
                <div className="question-container">
                  <p>
                    <strong>Question {currentQuestionIndex + 1}: </strong>
                    {currentQuestion.question}
                  </p>
                  <p>
                    <strong>Ranked #{currentQuestion.rank} out of{" "}
                    {currentQuestion.nrOfQuestions} possible questions</strong>
                  </p>
                  <div className="recap-stat-group">
                  <figure className="recap-stat">
                    <figcaption>Entropy Before</figcaption>
                    <div className="circle">{currentQuestion.entropyBefore.toFixed(2)}</div>
                  </figure>
                  <figure className="recap-stat">
                    <figcaption>Entropy After</figcaption>
                    <div className="circle">{currentQuestion.entropyAfter.toFixed(2)}</div>
                  </figure>
                </div>
                  <p>Information Gain: {currentQuestion.infoGain.toFixed(2)}</p>
                </div>
              </div>
            
            {!showCongratsMessage && (
              <>
                {/* Recap buttons */}
                <div className="recap-buttons">
                  <button className="button1" onClick={restartGame}>
                    Restart Game
                  </button>
                  <button
                    className="button1"
                    onClick={() => setShowOptimalTree(!showOptimalTree)}
                  >
                    {showOptimalTree ? "Hide Optimal Tree" : "Show Optimal Tree"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Show Next button when not showing the optimal tree */}
        {!showOptimalTree && !showCongratsMessage  && (
          <div className="next-button">
            <button
              className="next-btn"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questionHistory.length - 1 || showCongratsMessage}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}
        
    </div>
  </div>
  );
};

export default GameRecap;
