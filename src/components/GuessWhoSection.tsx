import React, { useEffect, useState } from 'react';
import Title from './Title';
import { Character, Attribute } from '../types';
import { Tooltip } from 'react-tooltip';

type Props = {
  selectedAttribute: Attribute;
  characters: Character[];
  remainingCharacters: Character[];
  handleGuess: (guessedCharacter: Character) => void;
};

const GuessWhoSection: React.FC<Props> = ({ remainingCharacters, characters, handleGuess }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [eliminatedCharacters, setEliminatedCharacters] = useState<string[]>([]);

  useEffect(() => {
    setEliminatedCharacters(characters.filter((char) => !remainingCharacters.includes(char)).map((char) => char.name)); // Elminated characters are characters that are not in the remaining characters list
  }, [remainingCharacters]);


  // If the character that was selected, is removed by a question, unselect it
  useEffect(() => {
    if (selectedCharacter && eliminatedCharacters.includes(selectedCharacter.name)) {
      setSelectedCharacter(null);
    }
  }, [eliminatedCharacters]);

  // Handles guess logic 
  // Makes it so if the character is clicked, it is selected
  // If the character is clicked again, it is guessed
  const Guess = (char: Character) => {
    if (selectedCharacter === char) {
      handleGuess(char);
      setSelectedCharacter(null);
    } else {
      setTimeout(() => {
        setSelectedCharacter(char) // Select the character if it is clicked 
      }, 50);
     }
  };

  return (
    <div className="guess-section">
      <div className="sub-sections">
        {/*<Title text="Guess Who" />*/}
        <div className="guess-middle-section">
          <div className="grid">
            {characters.map((char) => (
              <div
                key={char.name}
                className={`grid-item ${selectedCharacter?.name === char.name ? 'selected' : ''} ${
                  eliminatedCharacters.includes(char.name) ? 'faded' : ''
                }`}
                onClick={() => Guess(char)}
                data-tooltip-content={char.name}
                data-tooltip-id={char.name}
              >
                <img src={char.src} alt={char.name} />
              </div>
            ))}
          {characters.map((char, index) => (
            <Tooltip key={index} id={char.name} place="top" delayShow={250} float={true} />
          ))}
          </div>
        </div>

        {/*<div className="bottom-section">
          <div className="select-buttons">
            <button id="guess-button"
           onClick= {() => selectedCharacter && Guess(selectedCharacter)}
           disabled={selectedCharacter === null}
            >
            Guess 
          </button>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default GuessWhoSection;
