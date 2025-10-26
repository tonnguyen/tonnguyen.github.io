'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Circle } from 'lucide-react';
import { CommandOutput } from './CommandOutput';
import { ThemeToggle } from './ThemeToggle';
import styles from '../styles/Terminal.module.css';

const availableCommands = [
  { name: 'help', description: 'Show available commands' },
  { name: 'whoami', description: 'Display information about me' },
  { name: 'experience', description: 'Show work experience' },
  { name: 'ls projects/', description: 'List all projects' },
  { name: 'cat skills.txt', description: 'Show my skills' },
  { name: 'cat contact.json', description: 'Display contact information' },
  { name: 'clear', description: 'Clear the terminal' },
];

const commandNames = availableCommands.map(cmd => cmd.name);

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    let output;

    switch (trimmedCmd) {
      case 'help':
        output = <HelpOutput />;
        break;
      case 'whoami':
        output = <CommandOutput type="whoami" />;
        break;
      case 'experience':
      case 'work':
        output = <CommandOutput type="experience" />;
        break;
      case 'ls projects/':
      case 'ls projects':
        output = <CommandOutput type="projects" />;
        break;
      case 'cat skills.txt':
      case 'cat skills':
        output = <CommandOutput type="skills" />;
        break;
      case 'cat contact.json':
      case 'cat contact':
        output = <CommandOutput type="contact" />;
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        output = null;
        break;
      default:
        output = (
          <div className={styles.errorMessage}>
            Command not found: {cmd}
            <div className={styles.errorHint}>Type 'help' to see available commands</div>
          </div>
        );
    }

    setHistory([...history, { command: cmd, output }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      handleCommand(currentCommand);
      setCurrentCommand('');
      setCommandHistoryIndex(-1);
    }
  };

  const handleTabCompletion = () => {
    if (!currentCommand.trim()) return;

    const matches = commandNames.filter(cmd => 
      cmd.toLowerCase().startsWith(currentCommand.toLowerCase())
    );

    if (matches.length === 1) {
      // Single match - autocomplete it
      setCurrentCommand(matches[0]);
    } else if (matches.length > 1) {
      // Multiple matches - find common prefix
      const commonPrefix = matches.reduce((prefix, cmd) => {
        let i = 0;
        while (
          i < prefix.length && 
          i < cmd.length && 
          prefix[i].toLowerCase() === cmd[i].toLowerCase()
        ) {
          i++;
        }
        return prefix.slice(0, i);
      });
      
      if (commonPrefix.length > currentCommand.length) {
        setCurrentCommand(commonPrefix);
      } else {
        // Show available matches
        const output = (
          <div className={styles.outputSecondary}>
            {matches.map((cmd, idx) => (
              <span key={idx} style={{ marginRight: '1rem' }}>{cmd}</span>
            ))}
          </div>
        );
        setHistory([...history, { command: currentCommand, output }]);
      }
    }
  };

  const handleKeyDown = (e) => {
    const commands = history.map(h => h.command);
    
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commands.length > 0) {
        const newIndex = commandHistoryIndex < commands.length - 1 
          ? commandHistoryIndex + 1 
          : commandHistoryIndex;
        setCommandHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistoryIndex > 0) {
        const newIndex = commandHistoryIndex - 1;
        setCommandHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      } else if (commandHistoryIndex === 0) {
        setCommandHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className={styles.terminal}>
      {/* Terminal Header */}
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <Circle className={`${styles.terminalButton} ${styles.terminalButtonRed}`} />
          <Circle className={`${styles.terminalButton} ${styles.terminalButtonYellow}`} />
          <Circle className={`${styles.terminalButton} ${styles.terminalButtonGreen}`} />
        </div>
        <span className={styles.terminalTitle}>anonymous@earth ~ %</span>
        <div className={styles.terminalSpacer}></div>
        <div className={styles.terminalControls}>
          <ThemeToggle />
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        className={styles.terminalBody}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome Message */}
        <div className={styles.welcomeMessage}>
          <div className={styles.welcomeTitle}>Ton Nguyen - Portfolio Terminal v1.0.0</div>
          <div className={styles.welcomeSubtitle}>Type 'help' to see available commands</div>
        </div>

        {/* Initial Help */}
        {history.length === 0 && <HelpOutput />}

        {/* Command History */}
        {history.map((item, index) => (
          <div key={index} className={styles.commandHistory}>
            <Prompt command={item.command} />
            {item.output}
          </div>
        ))}

        {/* Current Input */}
        <form onSubmit={handleSubmit} className={styles.commandForm}>
          <ChevronRight className={styles.promptIcon} />
          <span className={styles.promptUser}>anonymous@earth</span>
          <span className={styles.promptSeparator}>:</span>
          <span className={styles.promptPath}>~</span>
          <span className={styles.promptSymbol}>%</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.commandInput}
            autoFocus
            spellCheck={false}
          />
        </form>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}

function Prompt({ command }) {
  return (
    <div className={styles.commandPrompt}>
      <ChevronRight className={styles.promptIcon} />
      <span className={styles.promptUser}>anonymous@earth</span>
      <span className={styles.promptSeparator}>:</span>
      <span className={styles.promptPath}>~</span>
      <span className={styles.promptSymbol}>%</span>
      <span className={styles.commandText}>{command}</span>
    </div>
  );
}

function HelpOutput() {
  return (
    <div className={styles.helpOutput}>
      <div className={styles.helpTitle}>Available Commands:</div>
      <div className={styles.helpCommands}>
        {availableCommands.map((cmd, index) => (
          <div key={index} className={styles.helpCommand}>
            <span className={styles.helpCommandName}>{cmd.name}</span>
            <span className={styles.helpCommandDescription}>{cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
