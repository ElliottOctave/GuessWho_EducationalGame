import React from 'react';

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className="title-container">
      <h2 className="title-text">{text}</h2>
    </div>
  );
};

/* I saw you could use SVG to make it easier to get text that fits a container*/

export default Title;
