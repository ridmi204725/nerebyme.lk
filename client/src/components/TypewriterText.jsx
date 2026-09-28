import React, { useState, useEffect } from 'react';

const TypewriterText = () => {
  const words = ["Experiences", "Food", "Travel", "Movies", "Events", "Adventures"];
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    const type = () => {
      setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));

      let speed = isDeleting ? 50 : 120;

      if (!isDeleting && text === currentWord) {
        speed = 2000;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        speed = 500;
      }

      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, isDeleting ? 50 : 120);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 after:content-['|'] after:animate-[blink_0.8s_infinite] after:text-orange-500 after:absolute after:-right-4">
      {text}
    </span>
  );
};

export default TypewriterText;
