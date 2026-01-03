import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Target, Zap, Award } from 'lucide-react';

const VimQuest = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState('normal'); // normal, insert, visual
  const [cursorPos, setCursorPos] = useState({ row: 0, col: 0 });
  const [text, setText] = useState([]);
  const [keystrokes, setKeystrokes] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [commandBuffer, setCommandBuffer] = useState('');
  const [yankRegister, setYankRegister] = useState([]);
  const [showEfficiencyWarning, setShowEfficiencyWarning] = useState(false);
  const textAreaRef = useRef(null);

  const levels = [
    {
      title: "Level 1: Basic Movement",
      goal: "Move to the 'X' and press space",
      initial: [
        "Start here",
        "Move down with j",
        "Then right with l → X"
      ],
      target: { row: 2, col: 18 },
      optimalStrokes: 3,
      hint: "Use: j (down), l (right)"
    },
    {
      title: "Level 2: Word Navigation",
      goal: "Jump to 'TARGET' using word movement",
      initial: [
        "Skip these boring words and jump to TARGET quickly",
        "Using w key is faster than l l l l l"
      ],
      target: { row: 0, col: 40 },
      optimalStrokes: 6,
      hint: "Use: w (next word), b (back word)"
    },
    {
      title: "Level 3: Delete a Word",
      goal: "Delete the word 'REMOVE'",
      initial: [
        "Keep this but delete REMOVE and keep this too"
      ],
      solution: [
        "Keep this but delete and keep this too"
      ],
      optimalStrokes: 4,
      hint: "Use: w to move, dw to delete word"
    },
    {
      title: "Level 4: Line Operations",
      goal: "Delete the entire middle line",
      initial: [
        "Keep this line",
        "DELETE THIS ENTIRE LINE",
        "Keep this line too"
      ],
      solution: [
        "Keep this line",
        "Keep this line too"
      ],
      optimalStrokes: 2,
      hint: "Use: j to move down, dd to delete line"
    },
    {
      title: "Level 5: Insert Mode",
      goal: "Add your name after 'Hello '",
      initial: [
        "Hello "
      ],
      requiresInsert: true,
      optimalStrokes: 10,
      hint: "Use: $ (end of line), a (append), type name, ESC"
    },
    {
      title: "Level 6: Change Word",
      goal: "Change 'bad' to 'good'",
      initial: [
        "This is a bad example of text"
      ],
      solution: [
        "This is a good example of text"
      ],
      optimalStrokes: 8,
      hint: "Use: w to move to 'bad', cw to change word, type 'good', ESC"
    },
    {
      title: "Level 7: Delete Inside",
      goal: "Delete everything inside the quotes",
      initial: [
        'The message was "delete this text" in the log'
      ],
      solution: [
        'The message was "" in the log'
      ],
      optimalStrokes: 4,
      hint: "Use: f\" to find quote, di\" to delete inside quotes"
    },
    {
      title: "Level 8: Find Character",
      goal: "Jump to the @ symbol",
      initial: [
        "Contact us at email@example.com for info"
      ],
      target: { row: 0, col: 19 },
      optimalStrokes: 2,
      hint: "Use: f@ to find the @ character, then space"
    },
    {
      title: "Level 9: Copy and Paste Line",
      goal: "Duplicate the middle line",
      initial: [
        "First line",
        "Copy this line",
        "Last line"
      ],
      solution: [
        "First line",
        "Copy this line",
        "Copy this line",
        "Last line"
      ],
      optimalStrokes: 3,
      hint: "Use: j to move to middle line, yy to copy (yank), p to paste"
    },
    {
      title: "Level 10: Replace Character",
      goal: "Replace all 'X' with 'O'",
      initial: [
        "X marks the spot, X marks treasure"
      ],
      solution: [
        "O marks the spot, O marks treasure"
      ],
      optimalStrokes: 4,
      hint: "Use: r to replace character under cursor (rO), then f to find next X"
    },
    {
      title: "Level 11: Delete to End of Line",
      goal: "Delete from 'remove' to end of line",
      initial: [
        "Keep this part but remove everything from here"
      ],
      solution: [
        "Keep this part but "
      ],
      optimalStrokes: 5,
      hint: "Use: w or f to move to 'remove', D to delete to end of line"
    },
    {
      title: "Level 12: Change Inside Parentheses",
      goal: "Change the number inside parentheses to 100",
      initial: [
        "The value is (42) which needs updating"
      ],
      solution: [
        "The value is (100) which needs updating"
      ],
      optimalStrokes: 9,
      hint: "Use: f( to find paren, ci( to change inside, type 100, ESC"
    }
  ];

  const level = levels[currentLevel];

  useEffect(() => {
    setText([...level.initial]);
    setCursorPos({ row: 0, col: 0 });
    setKeystrokes(0);
    setLevelComplete(false);
    setMessage(level.hint);
    setCommandBuffer('');
    setMode('normal');
    setYankRegister([]);
    setShowEfficiencyWarning(false);
  }, [currentLevel]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    checkLevelComplete();
  }, [cursorPos, text]);

  useEffect(() => {
    // Show efficiency warning when exceeding optimal by 2
    if (keystrokes > level.optimalStrokes + 2 && !levelComplete && !showEfficiencyWarning) {
      setShowEfficiencyWarning(true);
      setTimeout(() => setShowEfficiencyWarning(false), 3000);
    }
  }, [keystrokes]);

  const checkLevelComplete = () => {
    if (level.target) {
      if (cursorPos.row === level.target.row && cursorPos.col === level.target.col) {
        setLevelComplete(true);
        const efficiency = Math.round((level.optimalStrokes / keystrokes) * 100);
        setMessage(`🎉 Level Complete! Efficiency: ${efficiency}%`);
      }
    } else if (level.solution) {
      const textMatches = JSON.stringify(text) === JSON.stringify(level.solution);
      if (textMatches) {
        setLevelComplete(true);
        const efficiency = Math.round((level.optimalStrokes / keystrokes) * 100);
        setMessage(`🎉 Level Complete! Efficiency: ${efficiency}%`);
      }
    } else if (level.requiresInsert) {
      if (text[0].length > level.initial[0].length + 2) {
        setLevelComplete(true);
        const efficiency = Math.round((level.optimalStrokes / keystrokes) * 100);
        setMessage(`🎉 Level Complete! Efficiency: ${efficiency}%`);
      }
    }
  };

  const moveCursor = (newRow, newCol) => {
    const maxRow = text.length - 1;
    const boundedRow = Math.max(0, Math.min(newRow, maxRow));
    const maxCol = Math.max(0, text[boundedRow].length - 1);
    const boundedCol = Math.max(0, Math.min(newCol, maxCol));
    setCursorPos({ row: boundedRow, col: boundedCol });
  };

  const handleKeyPress = (e) => {
    e.preventDefault();
    
    // Ignore modifier keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      return;
    }
    
    setKeystrokes(k => k + 1);

    if (mode === 'insert') {
      if (e.key === 'Escape') {
        setMode('normal');
        setMessage('-- NORMAL --');
        return;
      }
      
      if (e.key === 'Backspace') {
        const newText = [...text];
        if (cursorPos.col > 0) {
          newText[cursorPos.row] = 
            newText[cursorPos.row].slice(0, cursorPos.col - 1) + 
            newText[cursorPos.row].slice(cursorPos.col);
          setText(newText);
          moveCursor(cursorPos.row, cursorPos.col - 1);
        }
        return;
      }

      if (e.key.length === 1) {
        const newText = [...text];
        newText[cursorPos.row] = 
          newText[cursorPos.row].slice(0, cursorPos.col) + 
          e.key + 
          newText[cursorPos.row].slice(cursorPos.col);
        setText(newText);
        moveCursor(cursorPos.row, cursorPos.col + 1);
      }
      return;
    }

    // Normal mode
    // Don't lowercase keys that have different meanings when uppercase in Vim
    const specialUppercase = ['D', 'C', 'A', 'I', 'P', 'Y', 'O'];
    const key = (e.key.length === 1 && /[a-zA-Z]/.test(e.key) && !specialUppercase.includes(e.key)) 
      ? e.key.toLowerCase() 
      : e.key;
    
    console.log('Key pressed:', e.key, '→ processed as:', key, 'Special?', specialUppercase.includes(e.key));
    
    switch(key) {
      case 'h':
        moveCursor(cursorPos.row, cursorPos.col - 1);
        break;
      case 'j':
        moveCursor(cursorPos.row + 1, cursorPos.col);
        break;
      case 'k':
        moveCursor(cursorPos.row - 1, cursorPos.col);
        break;
      case 'l':
        moveCursor(cursorPos.row, cursorPos.col + 1);
        break;
      case 'b': {
        const line = text[cursorPos.row];
        let newCol = cursorPos.col - 1;
        while (newCol > 0 && line[newCol] === ' ') newCol--;
        while (newCol > 0 && line[newCol - 1] !== ' ') newCol--;
        moveCursor(cursorPos.row, Math.max(0, newCol));
        break;
      }
      case '$':
        moveCursor(cursorPos.row, text[cursorPos.row].length - 1);
        break;
      case '0':
        moveCursor(cursorPos.row, 0);
        break;
      case 'i':
        if (commandBuffer === 'd' || commandBuffer === 'c') {
          // Building di or ci command
          setCommandBuffer(commandBuffer + 'i');
          setMessage(commandBuffer + 'i');
        } else {
          setMode('insert');
          setMessage('-- INSERT --');
        }
        break;
      case 'a':
        if (commandBuffer === 'd' || commandBuffer === 'c') {
          // Building da or ca command
          setCommandBuffer(commandBuffer + 'a');
          setMessage(commandBuffer + 'a');
        } else {
          setMode('insert');
          setMessage('-- INSERT --');
          moveCursor(cursorPos.row, cursorPos.col + 1);
        }
        break;
      case 'd':
        if (commandBuffer === 'd') {
          const newText = [...text];
          newText.splice(cursorPos.row, 1);
          if (newText.length === 0) newText.push('');
          setText(newText);
          moveCursor(Math.min(cursorPos.row, newText.length - 1), 0);
          setCommandBuffer('');
        } else {
          setCommandBuffer('d');
          setMessage('d');
        }
        break;
      case 'c':
        if (commandBuffer === 'c') {
          // cc - change entire line
          const newText = [...text];
          newText[cursorPos.row] = '';
          setText(newText);
          setCursorPos({ row: cursorPos.row, col: 0 });
          setMode('insert');
          setMessage('-- INSERT --');
          setCommandBuffer('');
        } else {
          setCommandBuffer('c');
          setMessage('c');
        }
        break;
      case 'y':
        if (commandBuffer === 'y') {
          // yy - yank (copy) entire line
          setYankRegister([text[cursorPos.row]]);
          setMessage('1 line yanked');
          setCommandBuffer('');
        } else {
          setCommandBuffer('y');
          setMessage('y');
        }
        break;
      case 'p':
        // paste after cursor
        if (yankRegister.length > 0) {
          const newText = [...text];
          newText.splice(cursorPos.row + 1, 0, ...yankRegister);
          setText(newText);
          moveCursor(cursorPos.row + 1, 0);
        }
        break;
      case 'r':
        setCommandBuffer('r');
        setMessage('r');
        break;
      case 'f':
        setCommandBuffer('f');
        setMessage('f');
        break;
      case 't':
        setCommandBuffer('t');
        setMessage('t');
        break;
      case 'D':
        // Delete to end of line
        const newText = [...text];
        newText[cursorPos.row] = newText[cursorPos.row].slice(0, cursorPos.col);
        setText(newText);
        break;
      case 'w':
        if (commandBuffer === 'd' || commandBuffer === 'c') {
          // Delete/change word
          const newText = [...text];
          const line = newText[cursorPos.row];
          let endCol = cursorPos.col;
          while (endCol < line.length && line[endCol] !== ' ') endCol++;
          while (endCol < line.length && line[endCol] === ' ') endCol++;
          newText[cursorPos.row] = line.slice(0, cursorPos.col) + line.slice(endCol);
          setText(newText);
          
          if (commandBuffer === 'c') {
            setMode('insert');
            setMessage('-- INSERT --');
          }
          
          setCommandBuffer('');
          setMessage(commandBuffer === 'd' ? '' : '-- INSERT --');
        } else {
          // Normal w movement
          const line = text[cursorPos.row];
          let newCol = cursorPos.col + 1;
          while (newCol < line.length && line[newCol] !== ' ') newCol++;
          while (newCol < line.length && line[newCol] === ' ') newCol++;
          moveCursor(cursorPos.row, Math.min(newCol, line.length - 1));
        }
        break;
      case ' ':
        if (level.target) {
          checkLevelComplete();
        }
        break;
      default:
        // Handle command buffer combinations
        if (commandBuffer === 'r' && e.key.length === 1) {
          // Replace character - preserve case
          const newText = [...text];
          const line = newText[cursorPos.row];
          newText[cursorPos.row] = line.slice(0, cursorPos.col) + e.key + line.slice(cursorPos.col + 1);
          setText(newText);
          setCommandBuffer('');
          setMessage('');
        } else if (commandBuffer === 'f' && e.key.length === 1) {
          // Find character on line - preserve case
          const line = text[cursorPos.row];
          const foundIdx = line.indexOf(e.key, cursorPos.col + 1);
          if (foundIdx !== -1) {
            moveCursor(cursorPos.row, foundIdx);
          }
          setCommandBuffer('');
          setMessage('');
        } else if (commandBuffer === 't' && e.key.length === 1) {
          // Find till character (one before) - preserve case
          const line = text[cursorPos.row];
          const foundIdx = line.indexOf(e.key, cursorPos.col + 1);
          if (foundIdx !== -1) {
            moveCursor(cursorPos.row, foundIdx - 1);
          }
          setCommandBuffer('');
          setMessage('');
        } else if (commandBuffer === 'di' || commandBuffer === 'ci' || commandBuffer === 'da' || commandBuffer === 'ca') {
          // Text objects
          const isDelete = commandBuffer[0] === 'd';
          const isInner = commandBuffer[1] === 'i';
          
          console.log('Text object command:', commandBuffer, 'Key pressed:', key, 'Key code:', e.key, 'Char code:', e.key.charCodeAt(0));
          
          if (key === '"' || key === "'" || key === '(' || key === ')' || key === '{' || key === '}') {
            const quoteChar = key === '(' || key === ')' ? '(' : key === '{' || key === '}' ? '{' : key;
            const closeChar = quoteChar === '(' ? ')' : quoteChar === '{' ? '}' : quoteChar;
            const line = text[cursorPos.row];
            
            console.log('Matched quote char:', quoteChar, 'Line:', line);
            
            // Find the enclosing pair - for quotes, find the pair that surrounds cursor
            let openIdx = -1;
            let closeIdx = -1;
            
            if (quoteChar === '"' || quoteChar === "'") {
              // For quotes, find pairs on the line
              const indices = [];
              for (let i = 0; i < line.length; i++) {
                if (line[i] === quoteChar) {
                  indices.push(i);
                }
              }
              
              console.log('Found quote indices:', indices, 'Cursor at:', cursorPos.col);
              
              // Find the pair that encloses the cursor
              for (let i = 0; i < indices.length - 1; i += 2) {
                if (indices[i] <= cursorPos.col && cursorPos.col <= indices[i + 1]) {
                  openIdx = indices[i];
                  closeIdx = indices[i + 1];
                  break;
                }
              }
              
              // If not found, use the first pair
              if (openIdx === -1 && indices.length >= 2) {
                openIdx = indices[0];
                closeIdx = indices[1];
              }
              
              console.log('Selected openIdx:', openIdx, 'closeIdx:', closeIdx);
            } else {
              // For parens/braces, search backwards and forwards
              for (let i = cursorPos.col; i >= 0; i--) {
                if (line[i] === quoteChar) {
                  openIdx = i;
                  break;
                }
              }
              
              for (let i = cursorPos.col; i < line.length; i++) {
                if (line[i] === closeChar) {
                  closeIdx = i;
                  break;
                }
              }
            }
            
            if (openIdx !== -1 && closeIdx !== -1 && openIdx < closeIdx) {
              const newText = [...text];
              if (isInner) {
                // Delete/change inside (preserve delimiters)
                newText[cursorPos.row] = line.slice(0, openIdx + 1) + line.slice(closeIdx);
                setText(newText);
                moveCursor(cursorPos.row, openIdx + 1);
              } else {
                // Delete/change around (include delimiters)
                newText[cursorPos.row] = line.slice(0, openIdx) + line.slice(closeIdx + 1);
                setText(newText);
                moveCursor(cursorPos.row, openIdx);
              }
              
              if (!isDelete) {
                setMode('insert');
                setMessage('-- INSERT --');
              } else {
                setMessage('Text deleted!');
              }
            } else {
              setMessage('Could not find matching quotes');
            }
            setCommandBuffer('');
          } else {
            // Show what key was pressed for debugging
            setMessage(`Got key: "${key}" (code: ${e.key.charCodeAt(0)}) - expected ", ', (, ), {, or }`);
            setCommandBuffer('');
          }
        } else if (commandBuffer === 'd' || commandBuffer === 'c') {
          setCommandBuffer(commandBuffer + key);
          setMessage(commandBuffer + key);
        }
        break;
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setMessage("🏆 Congratulations! You've completed all levels!");
    }
  };

  const resetLevel = () => {
    setText([...level.initial]);
    setCursorPos({ row: 0, col: 0 });
    setKeystrokes(0);
    setLevelComplete(false);
    setMessage(level.hint);
    setCommandBuffer('');
    setMode('normal');
    setYankRegister([]);
    setShowEfficiencyWarning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Efficiency Warning Popup */}
        {showEfficiencyWarning && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-yellow-500 text-black px-6 py-4 rounded-lg shadow-2xl border-4 border-yellow-600">
              <div className="flex items-center gap-3">
                <Zap className="text-black" size={24} />
                <div>
                  <div className="font-bold text-lg">Vim is about efficiency!</div>
                  <div className="text-sm">Try to complete this in {level.optimalStrokes} keystrokes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Zap className="text-yellow-400" />
            VimQuest
            <Zap className="text-yellow-400" />
          </h1>
          <p className="text-gray-400">Master Vim Through Interactive Challenges</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-1">{level.title}</h2>
              <p className="text-gray-300 flex items-center gap-2">
                <Target size={16} />
                {level.goal}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Level {currentLevel + 1}/{levels.length}</div>
              <div className="text-sm text-gray-400">Keystrokes: {keystrokes}</div>
              <div className="text-sm text-yellow-400">Optimal: {level.optimalStrokes}</div>
            </div>
          </div>

          <div 
            ref={textAreaRef}
            tabIndex={0}
            onKeyDown={handleKeyPress}
            className="bg-black p-4 rounded border-2 border-green-600 focus:outline-none focus:border-green-400 min-h-[200px] cursor-default"
          >
            {text.map((line, rowIdx) => (
              <div key={rowIdx} className="leading-relaxed">
                {line.split('').map((char, colIdx) => (
                  <span
                    key={colIdx}
                    className={`${
                      rowIdx === cursorPos.row && colIdx === cursorPos.col
                        ? 'bg-green-400 text-black'
                        : level.target && rowIdx === level.target.row && colIdx === level.target.col
                        ? 'bg-yellow-400 text-black font-bold'
                        : ''
                    }`}
                  >
                    {char}
                  </span>
                ))}
                {line.length === 0 && rowIdx === cursorPos.row && cursorPos.col === 0 && (
                  <span className="bg-green-400 text-black"> </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-900 rounded">
            <div className="text-sm mb-1">
              <span className="text-yellow-400">Mode:</span> {mode.toUpperCase()}
            </div>
            <div className="text-sm text-gray-300">
              {message}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={resetLevel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              Reset Level
            </button>
            {levelComplete && (
              <button
                onClick={nextLevel}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition flex items-center gap-2"
              >
                <Award size={16} />
                Next Level
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-sm">
          <h3 className="font-bold mb-2 text-yellow-400">Quick Reference:</h3>
          <div className="grid grid-cols-2 gap-2 text-gray-300">
            <div><span className="text-green-400">h/j/k/l</span> - Move left/down/up/right</div>
            <div><span className="text-green-400">w/b</span> - Next/previous word</div>
            <div><span className="text-green-400">0/$</span> - Start/end of line</div>
            <div><span className="text-green-400">i/a</span> - Insert before/after cursor</div>
            <div><span className="text-green-400">dd</span> - Delete line</div>
            <div><span className="text-green-400">dw</span> - Delete word</div>
            <div><span className="text-green-400">cw</span> - Change word</div>
            <div><span className="text-green-400">D</span> - Delete to end of line</div>
            <div><span className="text-green-400">yy</span> - Copy (yank) line</div>
            <div><span className="text-green-400">p</span> - Paste after cursor</div>
            <div><span className="text-green-400">r</span> - Replace character</div>
            <div><span className="text-green-400">f/t</span> - Find/till character</div>
            <div><span className="text-green-400">di"/ci"</span> - Delete/change inside quotes</div>
            <div><span className="text-green-400">di(/ci(</span> - Delete/change inside parens</div>
            <div><span className="text-green-400">ESC</span> - Return to normal mode</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VimQuest;
