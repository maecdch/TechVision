import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface LatexRendererProps {
  formula: string;
  className?: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ formula, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        containerRef.current.innerText = formula;
      }
    }
  }, [formula]);

  return <div ref={containerRef} className={className} />;
};
