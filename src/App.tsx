import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import parsePrompt, { PromptMatch } from './utils/parsePrompt';

import './App.scss';
import moment from 'moment';

const App: React.FC = () => {
  const [results, setResults] = useState<PromptMatch | null>(null);
  const [text, setText] = useState('');

  function handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      setResults(parsePrompt(text));
      setText('');
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setResults(null);
    setText((event.target as HTMLInputElement).value);
  }

  return (
    <div className="App">
      <div className="Input">
        <input
          type="text"
          onKeyPress={handleKeypress}
          onChange={handleChange}
          value={text}
          placeholder="remind me to..."
        />
      </div>

      {results !== null && results.time !== null && (
        <div className="Results">
          Okay, I will remind you to {results.rest} in{' '}
          {moment.duration(moment().diff(results.time.date)).humanize()}
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="RawResults">{results !== null && JSON.stringify(results, null, 2)}</div>
      )}
    </div>
  );
};

export default App;
