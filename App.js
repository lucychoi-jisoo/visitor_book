import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Check, ArrowLeft, Plus, Eye } from 'lucide-react';

const DigitalVisitorsBook = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [currentColor, setCurrentColor] = useState('#2c2c2c');
  const [currentSize, setCurrentSize] = useState(2);
  const [contributions, setContributions] = useState([]);
  const [currentView, setCurrentView] = useState('cover'); // 'cover', 'inside', 'canvas', 'gallery'
  const [showGallery, setShowGallery] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  
  const tools = {
    pencil: { color: '#2c2c2c', size: 2 },
    pen: { color: '#1a1a1a', size: 1.5 },
    marker: { color: '#333333', size: 4 },
    brush: { color: '#4a4a4a', size: 6 }
  };

  // Paper texture CSS
  const paperTexture = {
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, rgba(0,0,0,0.015) 1px, transparent 1px),
      radial-gradient(circle at 60% 40%, rgba(0,0,0,0.01) 1px, transparent 1px)
    `,
    backgroundColor: '#fdfcf8',
    backgroundSize: '8px 8px, 12px 12px, 16px 16px'
  };

  const bookCoverTexture = {
    backgroundColor: '#f5f3f0',
  };

  // Load contributions on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('visitorBookContributions') || '[]');
    setContributions(saved);
  }, []);

  const openBook = () => {
    setCurrentView('inside');
  };

  const getCanvas = () => canvasRef.current;
  const getContext = () => getCanvas()?.getContext('2d');

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const ctx = getContext();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const ctx = getContext();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = getContext();
    const canvas = getCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const selectTool = (tool) => {
    setCurrentTool(tool);
    setCurrentColor(tools[tool].color);
    setCurrentSize(tools[tool].size);
  };

  const saveContribution = () => {
    const canvas = getCanvas();
    const imageData = canvas.toDataURL();
    
    const newContribution = {
      id: Date.now(),
      image: imageData,
      name: visitorName || 'Anonymous',
      timestamp: new Date().toLocaleDateString(),
      rotation: Math.random() * 4 - 2,
    };
    
    const updatedContributions = [...contributions, newContribution];
    setContributions(updatedContributions);
    localStorage.setItem('visitorBookContributions', JSON.stringify(updatedContributions));
    
    clearCanvas();
    setVisitorName('');
    setCurrentView('gallery');
  };

  // Real-life tool components
  const PencilTool = ({ isSelected, onClick }) => (
    <button onClick={onClick} className={`relative transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
      <div className="relative">
        <div className={`w-2 h-20 rounded-full ${isSelected ? 'bg-yellow-400' : 'bg-yellow-300'} relative`}>
          <div className="absolute bottom-3 left-0 right-0 h-3 bg-gray-300 rounded-sm"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-pink-300 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-800 rounded-full -translate-y-1"></div>
        </div>
      </div>
    </button>
  );

  const PenTool = ({ isSelected, onClick }) => (
    <button onClick={onClick} className={`relative transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
      <div className="relative">
        <div className={`w-2.5 h-20 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-blue-500'} relative`}>
          <div className="absolute top-2 -right-1 w-1 h-6 bg-gray-300 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-700 rounded-full -translate-y-2"></div>
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-blue-700"></div>
        </div>
      </div>
    </button>
  );

  const MarkerTool = ({ isSelected, onClick }) => (
    <button onClick={onClick} className={`relative transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
      <div className="relative">
        <div className={`w-3 h-20 rounded-lg ${isSelected ? 'bg-red-500' : 'bg-red-400'} relative`}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gray-800 rounded-sm -translate-y-1"></div>
          <div className="absolute top-4 left-0 right-0 h-1 bg-white opacity-80"></div>
        </div>
      </div>
    </button>
  );

  const BrushTool = ({ isSelected, onClick }) => (
    <button onClick={onClick} className={`relative transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
      <div className="relative">
        <div className={`w-2 h-16 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-amber-500'} relative`}>
          <div className="absolute top-0 left-0 right-0 h-4 bg-gray-400 rounded-t-lg"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-700 rounded-full -translate-y-1"></div>
        </div>
      </div>
    </button>
  );

  const ContributionCard = ({ contribution }) => (
    <div 
      className="relative bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
      style={{
        transform: `rotate(${contribution.rotation}deg)`,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
        width: '200px',
        height: '150px'
      }}
    >
      <div className="p-3">
        <img 
          src={contribution.image} 
          alt={`Contribution by ${contribution.name}`}
          className="w-full h-20 object-contain mb-2"
        />
        <div className="text-xs text-gray-600 font-mono">
          <p className="font-medium truncate">{contribution.name}</p>
          <p className="text-gray-400">{contribution.timestamp}</p>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4">
        <div className="w-full h-full bg-gray-900 transform rotate-45 origin-bottom-left"></div>
      </div>
    </div>
  );

  const DecorativeStars = () => (
    <>
      <div className="absolute top-20 left-10 text-gray-400 text-2xl rotate-12">✦</div>
      <div className="absolute top-40 right-16 text-gray-300 text-lg rotate-45">✧</div>
      <div className="absolute bottom-32 left-20 text-gray-400 text-xl -rotate-12">✦</div>
      <div className="absolute bottom-20 right-32 text-gray-300 text-sm rotate-45">+</div>
    </>
  );

  // Cover View
  if (currentView === 'cover') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden" style={paperTexture}>
        <div className="relative z-10">
          <div 
            className="relative w-96 h-96 rounded-lg shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 overflow-hidden"
            style={bookCoverTexture}
            onClick={openBook}
          >
            {/* Organic Green Shapes inspired by the reference */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              {/* Large organic shape - top left with dotted pattern */}
              <path
                d="M30 60 C90 40, 130 90, 150 130 C170 170, 130 210, 90 190 C50 170, 20 130, 30 60 Z"
                fill="url(#greenDots)"
                opacity="0.8"
              />
              
              {/* Solid green organic shape - center right */}
              <path
                d="M220 80 C280 70, 320 110, 340 150 C360 190, 320 230, 280 220 C240 210, 200 170, 220 80 Z"
                fill="#005500"
                opacity="0.9"
              />
              
              {/* Medium organic shapes with different patterns */}
              <ellipse cx="80" cy="280" rx="35" ry="60" fill="#006600" opacity="0.7" transform="rotate(30 80 280)" />
              <ellipse cx="320" cy="300" rx="25" ry="45" fill="url(#greenDots)" opacity="0.6" transform="rotate(-20 320 300)" />
              
              {/* Small scattered organic shapes */}
              <ellipse cx="180" cy="320" rx="20" ry="35" fill="#005500" opacity="0.8" transform="rotate(45 180 320)" />
              <ellipse cx="300" cy="120" rx="15" ry="28" fill="#007700" opacity="0.6" transform="rotate(-35 300 120)" />
              <ellipse cx="120" cy="180" rx="18" ry="32" fill="url(#greenDots)" opacity="0.5" transform="rotate(60 120 180)" />
              
              {/* Additional small elements */}
              <circle cx="350" cy="80" r="12" fill="#005500" opacity="0.7" />
              <ellipse cx="60" cy="350" rx="25" ry="15" fill="#006600" opacity="0.6" transform="rotate(15 60 350)" />
              
              {/* Dotted pattern definitions */}
              <defs>
                <pattern id="greenDots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="0.8" fill="#005500" opacity="0.6" />
                </pattern>
              </defs>
            </svg>
            
            {/* Subtle border */}
            <div className="absolute inset-2 border border-gray-300 rounded-lg opacity-20"></div>
            
            {/* Title */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center bg-white bg-opacity-95 px-8 py-6 rounded-lg backdrop-blur-sm shadow-lg">
                <h1 
                  className="text-3xl text-gray-800 mb-2"
                  style={{ fontFamily: '"Bradley Hand", cursive' }}
                >
                  Visitor's Book
                </h1>
                <div className="w-20 h-0.5 bg-gray-400 mx-auto mb-2 opacity-60"></div>
                <p className="text-gray-600 text-sm font-mono">
                  Click to Open
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black opacity-20 rounded-lg transform translate-x-2 translate-y-2 -z-10"></div>
        </div>
      </div>
    );
  }

  // Inside Pages View
  if (currentView === 'inside') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden" style={paperTexture}>
        
        <button
          onClick={() => setCurrentView('cover')}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg z-10"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <button
          onClick={() => setCurrentView('canvas')}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg z-10"
        >
          <Plus className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="relative z-10">
          <div className="relative flex" style={{ transformStyle: 'preserve-3d' }}>
            <div 
              className="w-96 h-96 bg-white rounded-l-lg shadow-xl border-r border-gray-300 relative"
              style={{
                transform: 'rotateY(-5deg)',
                transformOrigin: 'right center'
              }}
            >
              <div className="absolute right-0 top-4 bottom-4 w-1 bg-gray-200 opacity-60"></div>
              <div className="absolute right-2 top-8 bottom-8 w-0.5 bg-gray-300 opacity-40"></div>
              
              <div className="p-12 h-full flex flex-col justify-center items-center">
                <div className="text-center">
                  <h2 
                    className="text-3xl text-gray-800 mb-8"
                    style={{ fontFamily: '"Bradley Hand", cursive' }}
                  >
                    Welcome Dear Visitor
                  </h2>
                  
                  <div className="w-24 h-0.5 bg-gray-400 mx-auto mb-8 opacity-60"></div>
                  
                  <div className="mb-8">
                    <div className="text-4xl text-gray-300 opacity-70">✦</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 w-6 h-6 bg-gray-100 transform rotate-45 opacity-30"></div>
            </div>
            
            <div 
              className="w-96 h-96 bg-white rounded-r-lg shadow-xl border-l border-gray-300 relative"
              style={{
                transform: 'rotateY(5deg)',
                transformOrigin: 'left center'
              }}
            >
              <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-200 opacity-60"></div>
              <div className="absolute left-2 top-8 bottom-8 w-0.5 bg-gray-300 opacity-40"></div>
              
              <div className="p-12 h-full flex flex-col justify-center items-center">
                <div className="text-center">
                  <button
                    onClick={() => setCurrentView('canvas')}
                    className="group flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg mb-8"
                    style={{ fontFamily: '"Bradley Hand", cursive' }}
                  >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    Leave My Mark
                  </button>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-6 h-6 bg-gray-100 transform rotate-45 opacity-30"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black opacity-15 rounded-lg transform translate-x-3 translate-y-3 -z-10"></div>
        </div>
      </div>
    );
  }

  // Gallery View
  if (currentView === 'gallery') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={paperTexture}>
        
        <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl text-gray-900 mb-4"
              style={{ fontFamily: '"Bradley Hand", cursive' }}
            >
              Community Gallery
            </h2>
            <div className="w-24 h-0.5 bg-gray-400 mx-auto mb-4 opacity-60"></div>
            <p className="text-gray-600 font-mono mb-8">
              {contributions.length} precious memories collected
            </p>
            
            <button
              onClick={() => setCurrentView('cover')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-mono"
            >
              ← Back to Book
            </button>
          </div>
          
          {contributions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {contributions.map((contribution) => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl text-gray-300 mb-4">📝</div>
              <p className="text-gray-600 font-mono">
                No memories yet. Be the first to leave your mark!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Canvas View
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden" style={paperTexture}>
      
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg">
          <div className="flex items-center gap-6">
            <PencilTool isSelected={currentTool === 'pencil'} onClick={() => selectTool('pencil')} />
            <PenTool isSelected={currentTool === 'pen'} onClick={() => selectTool('pen')} />
            <MarkerTool isSelected={currentTool === 'marker'} onClick={() => selectTool('marker')} />
            <BrushTool isSelected={currentTool === 'brush'} onClick={() => selectTool('brush')} />
            
            <div className="w-px h-12 bg-gray-200"></div>
            
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <div className="text-sm text-gray-600 font-mono">
              <span className="capitalize">{currentTool}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setCurrentView('inside')}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg z-10"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      
      <button
        onClick={() => setCurrentView('gallery')}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg z-10"
      >
        <Eye className="w-6 h-6 text-gray-600" />
      </button>
      
      <div className="relative z-10">
        <div className="relative flex" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="w-96 h-96 bg-white rounded-l-lg shadow-xl border-r border-gray-300 relative overflow-hidden"
            style={{
              transform: 'rotateY(-5deg)',
              transformOrigin: 'right center'
            }}
          >
            <div className="absolute right-0 top-4 bottom-4 w-1 bg-gray-200 opacity-60"></div>
            <div className="absolute right-2 top-8 bottom-8 w-0.5 bg-gray-300 opacity-40"></div>
            
            <div className="p-12 h-full flex flex-col justify-center items-center">
              <div className="text-center w-full">
                <h3 
                  className="text-2xl text-gray-800 mb-8"
                  style={{ fontFamily: '"Bradley Hand", cursive' }}
                >
                  Sign Your Work
                </h3>
                
                <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-8 opacity-60"></div>
                
                <input
                  type="text"
                  placeholder="Your name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-500 font-mono mb-8"
                />
                
                <button
                  onClick={saveContribution}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: '"Bradley Hand", cursive' }}
                >
                  <Check className="w-5 h-5" />
                  Save Memory
                </button>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-100 transform rotate-45 opacity-30"></div>
          </div>
          
          <div 
            className="w-96 h-96 bg-white rounded-r-lg shadow-xl border-l border-gray-300 relative overflow-hidden"
            style={{
              transform: 'rotateY(5deg)',
              transformOrigin: 'left center'
            }}
          >
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-200 opacity-60"></div>
            <div className="absolute left-2 top-8 bottom-8 w-0.5 bg-gray-300 opacity-40"></div>
            
            <div className="p-8 h-full flex flex-col">
              <div className="text-center mb-4">
                <h3 
                  className="text-2xl text-gray-800 mb-2"
                  style={{ fontFamily: '"Bradley Hand", cursive' }}
                >
                  Your Canvas
                </h3>
                <div className="w-16 h-0.5 bg-gray-400 mx-auto opacity-60"></div>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={240}
                  className="border border-gray-200 bg-white cursor-crosshair rounded"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
            
            <div className="absolute top-4 left-4 w-6 h-6 bg-gray-100 transform rotate-45 opacity-30"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-15 rounded-lg transform translate-x-3 translate-y-3 -z-10"></div>
      </div>
    </div>
  );
};

export default DigitalVisitorsBook;
