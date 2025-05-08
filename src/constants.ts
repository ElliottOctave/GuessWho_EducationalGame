import { Character } from './types';

export const allCharacters: Character[] = [
    { name: 'Anita', src: 'characters/Anita.png', attributes: { hair: 'white', gender: 'female', accessories: ['hat'], facialHair: [] } },
    { name: 'Billy', src: 'characters/Billy.png', attributes: { hair: 'black', gender: 'male', accessories: ['hat'], facialHair: ['mustache', 'beard'] } },
    { name: 'Bruno', src: 'characters/Bruno.png', attributes: { hair: 'no', gender: 'male', accessories: [], facialHair: ['mustache'] } },
    { name: 'Charlotte', src: 'characters/Charlotte.png', attributes: { hair: 'brown', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Cyril', src: 'characters/Cyril.png', attributes: { hair: 'ginger', gender: 'male', accessories: ['glasses'], facialHair: ['mustache'] } },
    { name: 'Mikhael', src: 'characters/Mikhael.png', attributes: { hair: 'black', gender: 'male', accessories: ['glasses'], facialHair: [] } },
    { name: 'Emma', src: 'characters/Emma.png', attributes: { hair: 'ginger', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Giorgio', src: 'characters/Giorgio.png', attributes: { hair: 'brown', gender: 'male', accessories: ['hat'], facialHair: ['mustache'] } },
    { name: 'Gwen', src: 'characters/Gwen.png', attributes: { hair: 'ginger', gender: 'female', accessories: ['hat'], facialHair: [] } },
    { name: 'Jacques', src: 'characters/Jacques.png', attributes: { hair: 'white', gender: 'male', accessories: ['glasses'], facialHair: ['mustache'] } },
    { name: 'Laura', src: 'characters/Laura.png', attributes: { hair: 'ginger', gender: 'female', accessories: ['hat'], facialHair: [] } },
    { name: 'Louka', src: 'characters/Louka.png', attributes: { hair: 'brown', gender: 'male', accessories: ['glasses'], facialHair: ['mustache', 'beard'] } },
    { name: 'James', src: 'characters/James.png', attributes: { hair: 'black', gender: 'male', accessories: [], facialHair: [] } },
    { name: 'Marie', src: 'characters/Marie.png', attributes: { hair: 'blond', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Obel', src: 'characters/Obel.png', attributes: { hair: 'white', gender: 'male', accessories: ['glasses'], facialHair: [] } },
    { name: 'Mounir', src: 'characters/Mounir.png', attributes: { hair: 'black', gender: 'male', accessories: ['glasses'], facialHair: ['mustache', 'beard'] } },
    { name: 'Vayne', src: 'characters/Vayne.png', attributes: { hair: 'black', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Rayane', src: 'characters/Rayane.png', attributes: { hair: 'brown', gender: 'male', accessories: ['hat'], facialHair: ['mustache', 'beard'] } },
    { name: 'Snow', src: 'characters/Snow.png', attributes: { hair: 'white', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Stacy', src: 'characters/Stacy.png', attributes: { hair: 'ginger', gender: 'female', accessories: ['glasses'], facialHair: [] } },
    { name: 'Lola', src: 'characters/Lola.png', attributes: { hair: 'no', gender: 'female', accessories: ['glasses'], facialHair: [] } },

    { name: 'Alice', src: 'characters/Alice.png', attributes: { hair: 'ginger', gender: 'female', accessories: [], facialHair: [] } },
    { name: 'Antoine', src: 'characters/Antoine.png', attributes: { hair: 'blond', gender: 'male', accessories: [], facialHair: ['mustache'] } },
    { name: 'Benjamin', src: 'characters/Benjamin.png', attributes: { hair: 'ginger', gender: 'male', accessories: ['glasses'], facialHair: [] } },
    { name: 'Bernard', src: 'characters/Bernard.png', attributes: { hair: 'no', gender: 'male', accessories: ['glasses'], facialHair: ['mustache', 'beard'] } },
    { name: 'Gerard', src: 'characters/Gerard.png', attributes: { hair: 'white', gender: 'male', accessories: [], facialHair: ['mustache', 'beard'] } },
    { name: 'Jones', src: 'characters/Jones.png', attributes: { hair: 'brown', gender: 'male', accessories: ['hat'], facialHair: [] } },
    { name: 'Lara', src: 'characters/Lara.png', attributes: { hair: 'blond', gender: 'female', accessories: ['hat'], facialHair: [] } },
    { name: 'Logan', src: 'characters/Logan.png', attributes: { hair: 'blond', gender: 'male', accessories: [], facialHair: [] } },
    { name: 'Michel', src: 'characters/Michel.png', attributes: { hair: 'black', gender: 'male', accessories: [], facialHair: ['mustache'] } },
    { name: 'Mona', src: 'characters/Mona.png', attributes: { hair: 'black', gender: 'female', accessories: [], facialHair: [] } },
    { name: 'Noël', src: 'characters/Noël.png', attributes: { hair: 'white', gender: 'male', accessories: ['glasses'], facialHair: ['mustache', 'beard'] } },
    { name: 'Pierre', src: 'characters/Pierre.png', attributes: { hair: 'blond', gender: 'male', accessories: [], facialHair: ['mustache', 'beard'] } },
    { name: 'Steven', src: 'characters/Steven.png', attributes: { hair: 'brown', gender: 'male', accessories: [], facialHair: ['mustache'] } },
  ];

export const allQuestions = {
  Hair: [
    'Does the person have no hair?',
    'Does the person have blond hair?',
    'Does the person have brown hair?',
    'Does the person have black hair?',
    'Does the person have white hair?',
    'Does the person have ginger hair?' ],
  'Facial Hair': [
    'Does the person have a mustache?',
    'Does the person have a beard?'],
  Accessory: [
    'Is the person wearing some glasses?',
    'Is the person wearing a hat?',],
  Gender: [
    'Is the person a male?',
    'Is the person a female?'],
};

// Checks if a character matches the question 
export const checkQuestion = (char: Character, question: string) => {
  if (question.includes("no hair")) return char.attributes.hair === "no";
  if (question.includes("blond hair")) return char.attributes.hair === "blond";
  if (question.includes("brown hair")) return char.attributes.hair === "brown";
  if (question.includes("black hair")) return char.attributes.hair === "black";
  if (question.includes("white hair")) return char.attributes.hair === "white";
  if (question.includes("ginger hair")) return char.attributes.hair === "ginger";
  if (question.includes("a mustache")) return char.attributes.facialHair.includes("mustache");
  if (question.includes("a beard")) return char.attributes.facialHair.includes("beard");
  if (question.includes("a male")) return char.attributes.gender === "male";
  if (question.includes("a female")) return char.attributes.gender === "female";
  if (question.includes("some glasses")) return char.attributes.accessories.includes("glasses");
  if (question.includes("a hat")) return char.attributes.accessories.includes("hat");

  return false;
};