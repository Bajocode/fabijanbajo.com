import React from 'react';
import LightAsync from 'react-syntax-highlighter';

// const styles = require('react-syntax-highlighter/dist/esm/styles/hljs');

interface ICodeRendererProps {
  value: string,
  language: string,
}

const CodeRenderer: React.FC<ICodeRendererProps> = ({ value, language }: ICodeRendererProps) => (
  <LightAsync language={language} style={override()}>
    {value}
  </LightAsync>
);

function override() {
  irBlackStyle.hljs.background = '#101010'
  irBlackStyle.hljs.padding = '2em'

  return irBlackStyle
}

const irBlackStyle = {
  'hljs': {
    'display': 'block',
    'overflowX': 'auto',
    'padding': '0.5em',
    'background': '#000',
    'color': '#f8f8f8'
  },
  'hljs-comment': {
    'color': '#7c7c7c'
  },
  'hljs-quote': {
    'color': '#7c7c7c'
  },
  'hljs-meta': {
    'color': '#7c7c7c'
  },
  'hljs-keyword': {
    'color': '#96cbfe'
  },
  'hljs-selector-tag': {
    'color': '#96cbfe'
  },
  'hljs-tag': {
    'color': '#96cbfe'
  },
  'hljs-name': {
    'color': '#96cbfe'
  },
  'hljs-attribute': {
    'color': '#ffffb6'
  },
  'hljs-selector-id': {
    'color': '#ffffb6'
  },
  'hljs-string': {
    'color': '#a8ff60'
  },
  'hljs-selector-attr': {
    'color': '#a8ff60'
  },
  'hljs-selector-pseudo': {
    'color': '#a8ff60'
  },
  'hljs-addition': {
    'color': '#a8ff60'
  },
  'hljs-subst': {
    'color': '#daefa3'
  },
  'hljs-regexp': {
    'color': '#e9c062'
  },
  'hljs-link': {
    'color': '#e9c062'
  },
  'hljs-title': {
    'color': '#ffffb6'
  },
  'hljs-section': {
    'color': '#ffffb6'
  },
  'hljs-type': {
    'color': '#ffffb6'
  },
  'hljs-doctag': {
    'color': '#ffffb6'
  },
  'hljs-symbol': {
    'color': '#c6c5fe'
  },
  'hljs-bullet': {
    'color': '#c6c5fe'
  },
  'hljs-variable': {
    'color': '#c6c5fe'
  },
  'hljs-template-variable': {
    'color': '#c6c5fe'
  },
  'hljs-literal': {
    'color': '#c6c5fe'
  },
  'hljs-number': {
    'color': '#ff73fd'
  },
  'hljs-deletion': {
    'color': '#ff73fd'
  },
  'hljs-emphasis': {
    'fontStyle': 'italic'
  },
  'hljs-strong': {
    'fontWeight': 'bold'
  }
};


export default CodeRenderer;
