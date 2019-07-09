import React from 'react';
import LightAsync from 'react-syntax-highlighter';

const styles = require('react-syntax-highlighter/dist/esm/styles/hljs');

interface ICodeRendererProps {
  value: string,
  language: string,
}

const CodeRenderer: React.FC<ICodeRendererProps> = ({ value, language }: ICodeRendererProps) => (
  <LightAsync language={language} style={styles.irBlack}>
    {value}
  </LightAsync>
);

export default CodeRenderer;
