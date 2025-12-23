'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Circle, Search } from 'lucide-react';
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
  { name: 'skateboards', description: 'List all skateboards' },
  { name: 'buy <number>', description: 'Buy a skateboard by index number' },
  { name: 'clear', description: 'Clear the terminal' },
];

const commandNames = availableCommands.map(cmd => cmd.name);

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Check for Polar checkout redirect
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutStatus = urlParams.get('checkout');
      const customerSessionToken = urlParams.get('customer_session_token');
      const checkoutId = urlParams.get('checkout_id');
      
      console.log('Checking for checkout redirect:', { checkoutStatus, customerSessionToken, checkoutId });
      
      if (checkoutStatus === 'success') {
        // Try to get checkout_id from URL, localStorage, or use customer_session_token
        const storedCheckoutId = localStorage.getItem('polar_checkout_id');
        const finalCheckoutId = checkoutId || storedCheckoutId;
        
        console.log('Checkout success detected, calling handleCheckoutSuccess', {
          checkoutId: finalCheckoutId,
          customerSessionToken,
          storedCheckoutId
        });
        
        handleCheckoutSuccess(customerSessionToken, finalCheckoutId);
        
        // Clean up localStorage
        if (storedCheckoutId) {
          localStorage.removeItem('polar_checkout_id');
          localStorage.removeItem('polar_checkout_product');
        }
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (checkoutStatus === 'cancelled') {
        // Show cancellation message
        const output = (
          <div className={styles.outputSecondary}>
            <div className={styles.outputSuccess} style={{ marginBottom: '0.5rem' }}>
              Checkout cancelled
            </div>
            <div className={styles.outputMuted}>
              The checkout was cancelled. You can try again anytime.
            </div>
          </div>
        );
        setHistory((prev) => [...prev, { command: '', output }]);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCheckoutSuccess = async (customerSessionToken, checkoutId) => {
    console.log('handleCheckoutSuccess called with:', { customerSessionToken, checkoutId });
    
    // Show success message immediately
    const initialOutput = (
      <div className={styles.checkoutSuccess}>
        <div className={styles.outputSuccess} style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
          ✓ Order placed successfully!
        </div>
        <div className={styles.outputMuted}>
          Fetching order details...
        </div>
      </div>
    );
    setHistory((prev) => {
      console.log('Adding initial success message to history');
      return [...prev, { command: '', output: initialOutput }];
    });

    try {
      let response;
      let data;
      
      // Try to get checkout details - use checkout_id if available
      if (checkoutId) {
        console.log('Fetching checkout details using checkout_id:', checkoutId);
        response = await fetch(`/api/polar/checkout/status?id=${checkoutId}`);
        data = await response.json();
      } else {
        // No checkout_id available - show basic success message
        console.log('No checkout_id available, showing basic success message');
        const storedProduct = typeof window !== 'undefined' ? localStorage.getItem('polar_checkout_product') : null;
        const output = (
          <div className={styles.checkoutSuccess}>
            <div className={styles.outputSuccess} style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
              ✓ Order placed successfully!
            </div>
            {storedProduct && (
              <div className={styles.checkoutDetail}>
                <span className={styles.outputLabel}>Product:</span>
                <span className={styles.outputText}> {storedProduct}</span>
              </div>
            )}
            <div className={styles.outputMuted} style={{ marginTop: '0.5rem' }}>
              Your order has been processed. Check your email for confirmation.
            </div>
            <div className={styles.outputMuted} style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
              Check your Polar dashboard for order details.
            </div>
          </div>
        );
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { command: '', output };
          return newHistory;
        });
        return;
      }

      if (!response.ok) {
        // Update the last history entry with error message
        const output = (
          <div className={styles.checkoutSuccess}>
            <div className={styles.outputSuccess} style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
              ✓ Order placed successfully!
            </div>
            <div className={styles.outputMuted}>
              Unable to fetch detailed order information. Your order has been processed successfully.
            </div>
            <div className={styles.outputMuted} style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
              Check your Polar dashboard or email for order details.
            </div>
            {customerSessionToken && (
              <div className={styles.outputMuted} style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                Session Token: {customerSessionToken.substring(0, 30)}...
              </div>
            )}
          </div>
        );
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { command: '', output };
          return newHistory;
        });
        return;
      }

      const checkout = data.checkout || data;
      const output = (
        <div className={styles.checkoutSuccess}>
          <div className={styles.outputSuccess} style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
            ✓ Order placed successfully!
          </div>
          
          {checkout.id && (
            <div className={styles.checkoutDetail}>
              <span className={styles.outputLabel}>Checkout ID:</span>
              <span className={styles.outputText}> {checkout.id}</span>
            </div>
          )}
          
          {checkout.status && (
            <div className={styles.checkoutDetail}>
              <span className={styles.outputLabel}>Status:</span>
              <span className={styles.outputText}> {checkout.status}</span>
            </div>
          )}
          
          {checkout.amount_total && checkout.currency && (
            <div className={styles.checkoutDetail}>
              <span className={styles.outputLabel}>Total:</span>
              <span className={styles.outputText}>
                {' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: checkout.currency.toUpperCase()
                }).format(checkout.amount_total / 100)}
              </span>
            </div>
          )}
          
          {checkout.customer_email && (
            <div className={styles.checkoutDetail}>
              <span className={styles.outputLabel}>Email:</span>
              <span className={styles.outputText}> {checkout.customer_email}</span>
            </div>
          )}
          
          {checkout.products && checkout.products.length > 0 && (
            <div className={styles.checkoutDetail} style={{ marginTop: '0.5rem' }}>
              <div className={styles.outputLabel} style={{ marginBottom: '0.25rem' }}>Products:</div>
              {checkout.products.map((product, idx) => (
                <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>
                  <span className={styles.outputText}>• {product.name || product.id}</span>
                  {product.price_amount && product.price_currency && (
                    <span className={styles.outputMuted} style={{ marginLeft: '0.5rem' }}>
                      ({new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.price_currency.toUpperCase()
                      }).format(product.price_amount / 100)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {checkout.created_at && (
            <div className={styles.checkoutDetail} style={{ marginTop: '0.5rem' }}>
              <span className={styles.outputMuted}>
                Order placed at: {new Date(checkout.created_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      );
      
      // Update the last history entry with full details
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { command: '', output };
        return newHistory;
      });
    } catch (error) {
      // Update the last history entry with error message
      const output = (
        <div className={styles.checkoutSuccess}>
          <div className={styles.outputSuccess} style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
            ✓ Order placed successfully!
          </div>
          <div className={styles.outputMuted}>
            Unable to fetch detailed order information. Your order has been processed successfully.
          </div>
          <div className={styles.outputMuted} style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
            Check your Polar dashboard or email for order details.
          </div>
          {customerSessionToken && (
            <div className={styles.outputMuted} style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
              Session Token: {customerSessionToken.substring(0, 30)}...
            </div>
          )}
        </div>
      );
      setHistory((prev) => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = { command: '', output };
        } else {
          newHistory.push({ command: '', output });
        }
        return newHistory;
      });
    }
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    let output;

    // Handle "buy <number>" command
    if (trimmedCmd.startsWith('buy ')) {
      const index = parseInt(trimmedCmd.replace('buy ', ''), 10);
      if (isNaN(index)) {
        output = (
          <div className={styles.errorMessage}>
            Invalid index. Use 'buy &lt;number&gt;' where number is the product index.
            <div className={styles.errorHint}>Type 'skateboards' to see available products</div>
          </div>
        );
      } else {
        output = <CommandOutput type="buy" index={index} />;
      }
    } else {
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
        case 'skateboards':
          output = <CommandOutput type="skateboards" />;
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
          {isMounted && <span id="bubblav-search" className="!pr-2"></span>}
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
