import React, { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';
import parsePrompt, { PromptMatch } from './utils/parsePrompt';

import './App.scss';
import moment from 'moment';

const App: React.FC = () => {
  const [results, setResults] = useState<PromptMatch | null>(null);
  const [text, setText] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

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
          ref={ref}
        />
      </div>

      {results !== null && results.time !== null && (
        <div className="Results">
          Okay, I will remind you to {results.rest} in{' '}
          {moment.duration(moment().diff(results.time.date)).humanize()}
        </div>
      )}

      <div className="RawResults">{results !== null && JSON.stringify(results, null, 2)}</div>
    </div>
  );
};

export default App;
