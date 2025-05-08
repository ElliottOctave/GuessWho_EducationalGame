import { useState } from "react";

export default function Tutorial({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  const next = () => setStep(step + 1);

  const steps = [
    {
      title: "Welcome to the Guess Who: Educational Game!",
      text: "You're about to play a guessing game. Your goal is to figure out the secret character by asking smart yes/no questions.",
    },
    {
      title: "What is Entropy?",
      text: "Entropy is how uncertain you are. If all characters are possible, entropy is high. We want to reduce that uncertainty by asking smart questions.",
    },
    {
      title: "Try Asking a Question",
      text: "For example: 'Does the character wear glasses?' If half do and half don't, that's a great question, it splits the group and reduces entropy a lot!",
    },
    {
      title: "What is Information Gain?",
      text: "It's how much your uncertainty goes down after asking a question. The better the question splits the group, the more information you gain.",
    },
    {
      title: "You're Ready!",
      text: "Now go ahead and play! Try to ask questions that split the characters as evenly as possible. Good luck!",
    },
  ];

  return (
    <div className="tutorial-container">
      <h2>{steps[step].title}</h2>
      <p>{steps[step].text}</p>
      <button onClick={step < steps.length - 1 ? next : onFinish}>
        {step < steps.length - 1 ? "Next" : "Start Game"}
      </button>
    </div>
  );
}
