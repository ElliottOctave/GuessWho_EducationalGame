import React, { useState, useEffect } from 'react';
import './css/App.css';
import QuestionSection from './components/QuestionSection';
import GuessWhoSection from './components/GuessWhoSection';
import DecisionTreeSection from './components/DecisionTreeSection';
import GameRecap from './components/GameRecap';
import Tutorial from './components/Tutorial';
import InfoModal from './components/InfoModal';
import { Attribute, Character, TreeNode, QuestionHistoryEntry } from './types';
import { allCharacters, checkQuestion, allQuestions } from './constants'


const App: React.FC = () => {

  const [characters, setCharacters] = useState<Character[]>([]); // Keeps the list of characters //
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>(null); // Manage `selectedAttribute` here //
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null); // Shared state for the selected question //
  const [lockedQuestions, setLockedQuestions] = useState<string[]>([]); // List of locked questions //
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null); // New state //  
  const [decisionTree, setDecisionTree] = useState<TreeNode | null>(null); // Track the decision tree //
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null); // Track the correct branching node //
  const [remainingCharacters, setRemainingCharacters] = useState<Character[]>([]); // Track the remaining characters that could still be the target //
  const [showRecap, setShowRecap] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState(true); // State for the info popup
  const [scoreText, setScoreText] = useState(""); 
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryEntry[]>([]);
  const [optimalTree, setOptimalTree] = useState<TreeNode | null >(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Select a random character for user to guess when the game starts //

  // Select a random character for user to guess when the game starts //
  const pickRandomCharacter = () => {
    const selectedCharacters = allCharacters
    .sort(() => Math.random() - 0.5) // Shuffle the array
    .slice(0, 21); // Take first 21 elements
    
    const randomCharacter = selectedCharacters[Math.floor(Math.random() * selectedCharacters.length)];
    const optimalTreeGenerated = generateOptimalTree(selectedCharacters);

    setCharacters(selectedCharacters);
    setOptimalTree(optimalTreeGenerated);
    setTargetCharacter(randomCharacter);
    setRemainingCharacters(selectedCharacters);
  
    console.log(selectedCharacters);
    console.log(optimalTreeGenerated);
    console.log(randomCharacter);
  }

  useEffect(() => {
    pickRandomCharacter();
  }, []);


  const generateOptimalTree = (characters: Character[]): TreeNode | null => {
    if (characters.length <= 1) {
      return {
      question: characters[0].name,
      remainingCharacters: [],
      yesBranch: null,
      noBranch: null,
      isCorrect: true,
    }
  }
  
    const questionRanks = rankQuestionsBySplit(characters, allQuestions);
    const bestQuestionEntry = questionRanks[0];
  
    if (!bestQuestionEntry || bestQuestionEntry.score <= 0) {
      return {
        question: "No optimal split",
        remainingCharacters: [],
        yesBranch: null,
        noBranch: null,
        isCorrect: true,
      }
    }
  
    const bestQuestion = bestQuestionEntry.question;
    const yesCharacters = characters.filter((char) => checkQuestion(char, bestQuestion));
    const noCharacters = characters.filter((char) => !checkQuestion(char, bestQuestion));
  
    return {
      question: bestQuestion,
      remainingCharacters: characters,
      yesBranch: generateOptimalTree(yesCharacters),
      noBranch: generateOptimalTree(noCharacters),
      isCorrect: true,
    };
  };

  // This is used to make it so when a user asks one of teh worst possible questions it will say his question was last ranked (ex #12 out of 12) 
  // before if 5 questions were all equaly the worst questions it would say your question was ranked #7 out of 12 now it will say #12 out of 12
  // This is just to make the score more clear to the user and better show how useful a question was
  const adjustRanks = (questions: { question: string; score: number; rank: number }[]) => {
    const n = questions.length;
    const lastScore = questions[n - 1].score; // Get the last element's score

    for (let i = n - 1; i >= 0; i--) {
        if (questions[i].score === lastScore) {
            questions[i].rank = n; // Set rank to the length of the array
        } else {
            break; // Stop when a different score is found
        }
    }
    return questions;
};
  
  /* Function to lock the currently selected question and remove characters that do not fit with the question depending on the answer of the question for the target character */
  const lockQuestion = () => {
    if (!selectedQuestion || lockedQuestions.includes(selectedQuestion) || !targetCharacter) {
      console.log("Invalid question or question already locked");
      return;
    }

  if (remainingCharacters.length !== 1) {

  // Get ranked list of questions
  const rankedQuestions = adjustRanks(rankQuestionsBySplit(remainingCharacters, allQuestions));

  // Find the user's question rank
  const userQuestionRank = rankedQuestions.find(q => q.question === selectedQuestion)?.rank ?? rankedQuestions.length + 1; // If the question is not found, set the rank to the last position (for saftey else it gives error)
  const totalQuestions = rankedQuestions.length;
  
  // Get the best possible question
  const bestQuestion = rankedQuestions[0]?.question || "Unknown";
 
  // Calculate entropy before the question was asked
  const entropyBefore = calculateEntropy(remainingCharacters);
  // Determine yes/no split after asking the question
  const yesCharacters = remainingCharacters.filter((char) => checkQuestion(char, selectedQuestion));
  const noCharacters = remainingCharacters.filter((char) => !checkQuestion(char, selectedQuestion));
 
  // Calculate entropy after asking the question
  const entropyAfter = (yesCharacters.length / remainingCharacters.length) * calculateEntropy(yesCharacters) + 
                        (noCharacters.length / remainingCharacters.length) * calculateEntropy(noCharacters);
 
  // Calculate Information Gain
  const infoGain = entropyBefore - entropyAfter;
 
  // Store question history
  setQuestionHistory((prevHistory) => [
    ...prevHistory,
    { question: selectedQuestion, rank: userQuestionRank, nrOfQuestions: totalQuestions , bestQuestion, entropyBefore, entropyAfter, infoGain }
  ]);
 
  setScoreText(`Your question was ranked #${userQuestionRank} out of ${totalQuestions} possible questions.`);
 
  }
    const isYesAnswer = checkQuestion(targetCharacter, selectedQuestion); // Check if the target character fits the question
    const yesCharacters = remainingCharacters.filter((char) => checkQuestion(char, selectedQuestion)); // Filter characters that fit the question
    const noCharacters = remainingCharacters.filter((char) => !checkQuestion(char, selectedQuestion)); // Filter characters that do not fit the question

    // yesNode has all the characters that fit the question
    const yesNode: TreeNode = { 
      question: "✅ Yes",
      remainingCharacters: yesCharacters,
      yesBranch: null,
      noBranch: null,
      isCorrect: isYesAnswer,
    };

    // noNode has all the characters that do not fit the question
    const noNode: TreeNode = {
      question: "❌ No",
      remainingCharacters: noCharacters,
      yesBranch: null,
      noBranch: null,
      isCorrect: !isYesAnswer,
    };

    // questionNode has the selected question and the remaining characters that fit the question
    const questionNode: TreeNode = { // Question node
      question: selectedQuestion,
      remainingCharacters: remainingCharacters,
      yesBranch: yesNode,
      noBranch: noNode,
      isCorrect: true,
    };

    // currNode is the correct path to follow
    const currNode: TreeNode = isYesAnswer ? yesNode : noNode;

    setDecisionTree((prevTree) => {
      if (!prevTree) { // If the tree is empty, set the question node as the root
        setCurrentNode(currNode); // Correct path
        return questionNode;
      } // If the tree is not empty
      const updatedTree = addToCorrectNode(prevTree, currentNode, questionNode);
      setCurrentNode(currNode); // Move current node forward
      return updatedTree;
    });
    // Update the remaining characters to only include those that fit the answer
    setRemainingCharacters(isYesAnswer ? yesCharacters : noCharacters);
    setLockedQuestions((prev) => [...prev, selectedQuestion]); 
    setSelectedQuestion(null);
  };

   // Function to insert a node into the correct path of the tree 
   const addToCorrectNode = (tree: TreeNode, current: TreeNode | null, newNode: TreeNode): TreeNode => {
  if (!current) {
    return tree;
  }
  // Find the correct branch (where the target character still fits)
  if (tree === current) {
    return {
      ...tree,
      yesBranch: newNode, // Insert the new node into the yes branch
      noBranch: null,
    };
  } 
  return { 
    ...tree, // Copy the tree with some modifications
    yesBranch: tree.yesBranch && tree.yesBranch.isCorrect 
      ? addToCorrectNode(tree.yesBranch, current, newNode) 
      : tree.yesBranch,
    noBranch: tree.noBranch && tree.noBranch.isCorrect 
      ? addToCorrectNode(tree.noBranch, current, newNode) 
      : tree.noBranch,
  };
};

  // Function to handle player's guess same as lockQuestion
  const handleGuess = (guessedCharacter: Character) => {
    if (!targetCharacter) {
      return;
    }

    const remainingCount = remainingCharacters.length;


    if (remainingCount !== 1) {
      // Probability of randomly guessing correctly
    const probabilityCorrect = 1 / remainingCount;

    // Estimate entropy reduction for the guess
    //const entropyReduction = -probabilityCorrect * Math.log2(probabilityCorrect);

    //const maxGain = Math.log2(remainingCount); 
    //setScore((prevScore) => prevScore + Math.round(normalizedScore));
    
    }

    const isYesAnswer = targetCharacter.name == guessedCharacter.name; // Check if the target character fits the question
    const yesCharacters = remainingCharacters.filter((char) => char.name === guessedCharacter.name);
    const noCharacters = remainingCharacters.filter((char) => char.name !== guessedCharacter.name);

    const yesNode: TreeNode = {
      question: "✅ Yes",
      remainingCharacters: yesCharacters,
      yesBranch: null,
      noBranch: null,
      isCorrect: isYesAnswer,
    };

    const noNode: TreeNode = {
      question: "❌ No",
      remainingCharacters: noCharacters,
      yesBranch: null,
      noBranch: null,
      isCorrect: !isYesAnswer,
    };

    const guessNode: TreeNode = {
      question: `Is the character ${guessedCharacter.name}?`,
      remainingCharacters: remainingCharacters, // A guess always represents a single character
      yesBranch: yesNode,
      noBranch: noNode,
      isCorrect: true,
    };

    setDecisionTree((prevTree) => {
      if (!prevTree) return guessNode;

      const updatedTree = addToCorrectNode(prevTree, currentNode, guessNode);
      return updatedTree;
    });

    const currNode: TreeNode = isYesAnswer ? yesNode : noNode;
    setRemainingCharacters(isYesAnswer ? yesCharacters : noCharacters);
    setCurrentNode(currNode); 

    if (guessedCharacter.name === targetCharacter.name) { // end of the game
      setShowRecap(true);
    } else {
      return
    }
  };

  const restartGame = () => {
    setSelectedAttribute(null);
    setSelectedQuestion(null);
    setLockedQuestions([]);
    setDecisionTree(null);
    setCurrentNode(null);
    pickRandomCharacter();
    setScoreText("");
    setShowRecap(false);
    setQuestionHistory([]);
  };

  const calculateEntropy = (characters: Character[]): number => {
    const total = characters.length;
    if (total === 0) return 0;
  
    const probability = 1 / total; 
    return -total * probability * Math.log2(probability);
  };
  
  const rankQuestionsBySplit = (remainingCharacters: Character[], questions: Record<string, string[]>): { question: string; score: number, rank: number }[] => {
    const questionScores: { question: string; score: number, rank: number | null }[] = [];
  
    Object.values(questions).flat().forEach((question, index) => {
      if (lockedQuestions.includes(question))
        return;
      const yesCount = remainingCharacters.filter((char) => checkQuestion(char, question)).length;
      const noCount = remainingCharacters.length - yesCount;
  
      // Score is based on how balanced the split is (closer to 50/50 is better)
      const balanceScore = 1 - Math.abs(yesCount - noCount) / remainingCharacters.length;
  
      questionScores.push({ question, score: balanceScore * 100, rank: index}); // Scale to 100 points
    });
  
    // Sort questions from highest to lowest efficiency
    questionScores.sort((a, b) => b.score - a.score);
    let rank = 1;
    return questionScores.map((q, index) => {
      if (index > 0 && q.score < questionScores[index - 1].score) { // If the score is lower than the previous question, increment the rank, so that same scores have the same rank
        rank = index + 1; 
      }
      return { ...q, rank }; // Add rank to the question
    });
  };
  
  return (
    <div className="container">
      {showTutorial ? (
        <Tutorial onFinish={() => {
          setShowTutorial(false);
          pickRandomCharacter(); // Initialize game once tutorial ends
        }} />
      ) : (
        <>
          <QuestionSection
            selectedQuestion={selectedQuestion}
            selectedAttribute={selectedAttribute}
            setSelectedAttribute={setSelectedAttribute}
            setQuestion={setSelectedQuestion}
            lockQuestion={lockQuestion}
            lockedQuestions={lockedQuestions}
            showInfoModal={setShowInfoModal}
          />
          <GuessWhoSection 
            selectedAttribute={selectedAttribute}
            characters={characters}
            remainingCharacters={remainingCharacters}
            handleGuess={handleGuess}
          />
          <DecisionTreeSection
            selectedQuestion={selectedQuestion}
            lockQuestion={lockQuestion}
            decisionTree={decisionTree}
            scoreText={scoreText}
          />
          <GameRecap
            isVisible={showRecap}
            onClose={() => setShowRecap(false)} 
            onRestart={restartGame}
            questionHistory={questionHistory}
            optimalTree={optimalTree}
          />
          <InfoModal 
            isVisible={showInfoModal}
            onClose={() => setShowInfoModal(false)}
          />
        </>
      )}
    </div>
  );
  
};

export default App;