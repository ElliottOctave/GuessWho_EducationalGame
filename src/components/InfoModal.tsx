import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faList, faLock, faEye, faTrophy, faStar, faBullseye } from "@fortawesome/free-solid-svg-icons";

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // Only render if visible

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="info-overlay" >
      <div className="info-modal">
      <div className="info-modal-text">
        <h2>HOW TO PLAY</h2>
        <p>Welcome to the Guess Who game! Here's how to play:</p>
        <p>Each round a random character is chosen by the computer and you need to guess them.</p>
      </div>
        <ul>
        <li><FontAwesomeIcon icon={faCheck} /> Choose an attribute (Hair, Gender, etc.)</li>
          <li><FontAwesomeIcon icon={faList} /> Select a question from the list</li>
          <li><FontAwesomeIcon icon={faLock} /> Click the question again to choose it</li>
          <li><FontAwesomeIcon icon={faBullseye} /> Make a guess by double clicking a character</li>
          <li><FontAwesomeIcon icon={faEye} /> See your choices in the decision tree</li>
          <li><FontAwesomeIcon icon={faTrophy} /> Guess the correct character to win! 🎉</li>
          <li><FontAwesomeIcon icon={faStar} /> Get a score based on the how good your questions were</li>
        </ul>

        {/* Optional Tutorial Video 
        <div className="video-container">
          <iframe 
            src="https://www.youtube.com/embed/60vAQZygYuc"
            title="Game Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        */}
        <button className="close-modal-button" onClick={onClose}>Play</button>
      </div>
    </div>
  );
};

export default InfoModal;
