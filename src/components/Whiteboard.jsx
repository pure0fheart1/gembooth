import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Whiteboard.css';

const Whiteboard = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([{ id: 0, name: 'Board 1', data: null }]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  // Common colors palette
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#00FF7F', '#4B0082'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load saved canvas data if exists
    const currentTab = tabs[activeTab];
    if (currentTab.data) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = currentTab.data;
    }
  }, [activeTab, tabs]);

  // Save current state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Get mouse position relative to canvas
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Start drawing
  const startDrawing = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'text') {
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // Draw on canvas
  const draw = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(pos.x - lineWidth / 2, pos.y - lineWidth / 2, lineWidth * 2, lineWidth * 2);
    }
  };

  // Stop drawing
  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'text') return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw shapes
    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else if (tool === 'fill-rectangle') {
      ctx.fillStyle = color;
      ctx.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'fill-circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    saveToHistory();
  };

  // Add text to canvas
  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `${lineWidth * 8}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput('');
    setShowTextInput(false);
    saveToHistory();
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newStep];
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newStep];
    }
  };

  // Save current tab data
  const saveCurrentTab = () => {
    const canvas = canvasRef.current;
    const newTabs = [...tabs];
    newTabs[activeTab].data = canvas.toDataURL();
    setTabs(newTabs);
  };

  // Switch tab
  const switchTab = (index) => {
    saveCurrentTab();
    setActiveTab(index);
  };

  // Add new tab
  const addTab = () => {
    if (tabs.length >= 5) return;

    saveCurrentTab();
    const newTab = {
      id: tabs.length,
      name: `Board ${tabs.length + 1}`,
      data: null
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  // Close tab
  const closeTab = (index) => {
    if (tabs.length === 1) return;

    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setActiveTab(Math.max(0, index - 1));
  };

  // Download canvas
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  // Save to Gallery
  const saveToGallery = async () => {
    if (!user) {
      alert('Please sign in to save to gallery');
      return;
    }

    try {
      setSaving(true);
      const canvas = canvasRef.current;

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        throw new Error('Failed to create image');
      }

      // Generate unique ID
      const whiteboardId = crypto.randomUUID();
      const fileName = `${user.id}/whiteboards/${whiteboardId}.png`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('whiteboards')
        .insert({
          id: whiteboardId,
          user_id: user.id,
          image_url: publicUrl,
          name: tabs[activeTab].name
        });

      if (dbError) throw dbError;

      alert('✅ Whiteboard saved to gallery!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      alert('Failed to save to gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="whiteboard-container">
      {/* Tabs */}
      <div className="whiteboard-tabs">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`whiteboard-tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => switchTab(index)}
          >
            <span>{tab.name}</span>
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(index);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {tabs.length < 5 && (
          <button className="add-tab-btn" onClick={addTab}>
            + Add Board
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="whiteboard-toolbar">
        {/* Tools */}
        <div className="toolbar-section">
          <h4>Tools</h4>
          <div className="tool-buttons">
            <button
              className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
              onClick={() => setTool('pen')}
              title="Pen"
            >
              ✏️
            </button>
            <button
              className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setTool('eraser')}
              title="Eraser"
            >
              🧹
            </button>
            <button
              className={`tool-btn ${tool === 'line' ? 'active' : ''}`}
              onClick={() => setTool('line')}
              title="Line"
            >
              📏
            </button>
            <button
              className={`tool-btn ${tool === 'rectangle' ? 'active' : ''}`}
              onClick={() => setTool('rectangle')}
              title="Rectangle"
            >
              ▭
            </button>
            <button
              className={`tool-btn ${tool === 'circle' ? 'active' : ''}`}
              onClick={() => setTool('circle')}
              title="Circle"
            >
              ○
            </button>
            <button
              className={`tool-btn ${tool === 'fill-rectangle' ? 'active' : ''}`}
              onClick={() => setTool('fill-rectangle')}
              title="Filled Rectangle"
            >
              ▬
            </button>
            <button
              className={`tool-btn ${tool === 'fill-circle' ? 'active' : ''}`}
              onClick={() => setTool('fill-circle')}
              title="Filled Circle"
            >
              ●
            </button>
            <button
              className={`tool-btn ${tool === 'text' ? 'active' : ''}`}
              onClick={() => setTool('text')}
              title="Text"
            >
              T
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="toolbar-section">
          <h4>Color</h4>
          <div className="color-palette">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-btn ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
              title="Custom color"
            />
          </div>
        </div>

        {/* Line Width */}
        <div className="toolbar-section">
          <h4>Size: {lineWidth}px</h4>
          <input
            type="range"
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="width-slider"
          />
        </div>

        {/* Actions */}
        <div className="toolbar-section">
          <h4>Actions</h4>
          <div className="action-buttons">
            <button onClick={undo} disabled={historyStep === 0} title="Undo">
              ↶ Undo
            </button>
            <button onClick={redo} disabled={historyStep === history.length - 1} title="Redo">
              ↷ Redo
            </button>
            <button onClick={clearCanvas} className="danger" title="Clear">
              🗑️ Clear
            </button>
            <button onClick={downloadCanvas} title="Download">
              💾 Download
            </button>
            <button onClick={saveToGallery} disabled={saving} className="primary" title="Save to Gallery">
              {saving ? '⏳ Saving...' : '📸 Save to Gallery'}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="text-input-modal">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') addText();
                if (e.key === 'Escape') setShowTextInput(false);
              }}
            />
            <button onClick={addText}>Add</button>
            <button onClick={() => setShowTextInput(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
