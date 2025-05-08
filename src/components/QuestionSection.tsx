import React, { useEffect, useState } from 'react';
import Title from './Title';
import { allQuestions } from '../constants';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

interface Props {
  selectedAttribute: 'Hair' | 'Facial Hair' | 'Accessory' | 'Gender' | null;
  setSelectedAttribute: (attribute: 'Hair' | 'Facial Hair' | 'Accessory' | 'Gender' | null) => void;
  selectedQuestion: string | null;
  setQuestion: (question: string | null) => void;
  lockQuestion: () => void;
  lockedQuestions: string[];
  showInfoModal: (isVisible: boolean) => void;
}

const QuestionSection: React.FC<Props> = ({
  selectedAttribute,
  setSelectedAttribute,
  selectedQuestion,
  setQuestion,
  lockQuestion,
  lockedQuestions,
  showInfoModal,
}) => {

  const [titleText, setTitleText] = useState<string>("Select a question"); 

  const selectAttribute = (attribute: 'Hair' | 'Facial Hair' | 'Accessory' | 'Gender' | null) => {
    setQuestion(null);
    setSelectedAttribute(attribute);
  };

  // if the selected question is changed update the title text
  useEffect(() => {
    if (selectedAttribute === null) {
      setTitleText("Select an attribute");
    } else if (selectedQuestion == null) {
        setTitleText("Select a question");
      } else {
        setTitleText("Click again to lock your choice!");
      }
    }, [selectedQuestion, selectedAttribute]);

  const handleQuestion = (question: string) => {
    if (!lockedQuestions.includes(question)) {
      if (selectedQuestion === question) {
        lockQuestion(); // Lock the question if it is clicked again
      } else {
        setQuestion(question); // Select the question if it is clicked
      }
    }
  };

  const renderQuestions = () => {
    if (selectedAttribute) {
      return (
        <div className="attributes">
          {allQuestions[selectedAttribute].map((question, index) => (
            <button
              key={index}
              className={`question-button ${
                lockedQuestions.includes(question) ? 'locked' : ''   
              } ${selectedQuestion === question ? 'selected' : ''}`}
              onClick={() => handleQuestion(question)}
              data-tooltip-content="Click to select this question! Then click again to lock it."
              data-tooltip-id={`question-${index}`}
            >
              {(!lockedQuestions.includes(question) && selectedQuestion === question) ? `➡️${question}` : question}
            </button>
          ))}
          {allQuestions[selectedAttribute].map((_, index) => (
            <Tooltip key={index} id={`question-${index}`} place="top" delayShow={4000} float={true} />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="question-section">
      <div className="sub-sections">
        <Title text={titleText} />
        
        <div className="middle-section">
          {selectedAttribute === null ? (
            <div className="attributes">
              <button data-tooltip-id="hair-tip" data-tooltip-content="Ask questions about hair" onClick={() => selectAttribute('Hair')}>Hair</button>
              <button data-tooltip-id="facial-hair-tip" data-tooltip-content="Ask questions about facial hair" onClick={() => selectAttribute('Facial Hair')}>Facial Hair</button>
              <button data-tooltip-id="accessory-tip" data-tooltip-content="Ask questions about accessories" onClick={() => selectAttribute('Accessory')}>Accessory</button>
              <button data-tooltip-id="gender-tip" data-tooltip-content="Ask questions about gender" onClick={() => selectAttribute('Gender')}>Gender</button>

              <Tooltip id="hair-tip" place="top" delayShow={1000} />
              <Tooltip id="facial-hair-tip" place="top" delayShow={1000} />
              <Tooltip id="accessory-tip" place="top" delayShow={1000} />
              <Tooltip id="gender-tip" place="top" delayShow={1000} />
            </div>
          ) : (
            renderQuestions()
          )}
        </div>

        <div className="bottom-section">
          <div className="select-buttons">
            {selectedAttribute !== null ? (
              <button id="back-button" className="back-button" onClick={() => selectAttribute(null)}>Back</button>
            ) : (
              <button
                id="info-button"
                onClick= {() => showInfoModal(true)}
                className="info-button"
                data-tooltip-id="info-tip"
                data-tooltip-content="Click for game instructions"
              >
                How to play? 
              </button>
            )}
            <Tooltip id="info-tip" place="top" delayShow={1000} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
