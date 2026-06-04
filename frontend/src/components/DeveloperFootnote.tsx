import React from 'react';

interface DeveloperFootnoteProps {
  fontSize?: string;
  opacity?: number;
  absolute?: boolean;
}

export default function DeveloperFootnote({
  fontSize = "12px",
  opacity = 0.7,
  absolute = false,
}: DeveloperFootnoteProps) {
  const absoluteStyles: React.CSSProperties = absolute
    ? {
        position: 'absolute',
        bottom: '1.5rem',
        left: 0,
        right: 0,
      }
    : {
        marginTop: '0.75rem',
      };

  return (
    <div
      style={{
        fontSize,
        opacity,
        textAlign: 'center',
        color: 'var(--text-muted)',
        ...absoluteStyles,
      }}
    >
      Engineered by Shujaullah Qazi with 💖
    </div>
  );
}