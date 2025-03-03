import React, { useState } from "react";

interface TruncatedTextProps {
  text: string;
  maxWords: number;
  maxLetters?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxWords,
  maxLetters,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const words = typeof text === "string" ? text?.split(" ") : [];

  const isTruncatedByWords = words?.length > maxWords;

  // Truncate by maxWords first
  let truncatedText = isTruncatedByWords
    ? `${words?.slice(0, maxWords).join(" ")}`
    : text;

  const isTruncatedByLetters = maxLetters && truncatedText.length > maxLetters;

  // Further truncate by maxLetters only if maxLetters is defined
  if (isTruncatedByLetters) {
    truncatedText = `${truncatedText.slice(0, maxLetters)}...`;
  }

  const isTruncated = isTruncatedByWords || isTruncatedByLetters;

  return (
    <div
      className="relative"
      onMouseEnter={() => isTruncated && setIsHovered(true)}
      onMouseLeave={() => isTruncated && setIsHovered(false)}>
      <p className={className}>{truncatedText}</p>
      {isHovered && (
        <div className="absolute top-full mt-1 p-2 bg-black text-white text-xs rounded shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

export default TruncatedText;
