export type Attribute = 'Hair' | 'Facial Hair' | 'Accessory' | 'Gender' | null;

export type Character = {
  name: string;
  src: string;
  attributes: {
    hair: string;
    gender: string;
    accessories: string[];
    facialHair: string[];
  };
};

export type QuestionHistoryEntry = {
  question: string;
  rank: number;
  nrOfQuestions: number;
  bestQuestion: string;
  entropyBefore: number;
  entropyAfter: number;
  infoGain: number;
};

export type TreeNode = {
  question: string;
  remainingCharacters: Character[]; // List of characters still valid in this node
  yesBranch: TreeNode | null;
  noBranch: TreeNode | null;
  isCorrect: boolean; // Node that is on the 'correct' path to the target character
};