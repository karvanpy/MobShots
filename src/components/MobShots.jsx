import React, { useState, useRef } from 'react';
import { Upload, Sliders, Image, Download, X, ChevronDown, ChevronUp } from 'lucide-react';

const MobShots = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [frameSettings, setFrameSettings] = useState({
    device: 'iphone',
    borderWidth: 3,
    borderColor: '#000000',
    borderStyle: 'solid',
    borderRadius: 16
  });
  const [shadowSettings, setShadowSettings] = useState({
    blur: 10,
    opacity: 30,
    color: '#000000',
    offsetX: 5,
    offsetY: 5
  });
  const [bgSettings, setBgSettings] = useState({
    type: 'solid',
    color: '#F5F5F5',
    gradientColor1: '#F5F5F5',
    gradientColor2: '#E6E6FA',
    gradientAngle: 45
  });
  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    resolution: 'original',
    transparent: false
  });
  
  const [panels, setPanels] = useState({
    frame: true,
    shadow: false,
    background: false,
    export: false
  });

  const deviceFrames = {
    iphone: { name: 'iPhone 13', padding: '5%', radius: '16px' },
    android: { name: 'Android', padding: '3%', radius: '8px' },
    pixel: { name: 'Google Pixel', padding: '4%', radius: '10px' },
    samsung: { name: 'Samsung Galaxy', padding: '3.5%', radius: '12px' }
  };

  const paletteColors = [
    '#F5F5F5', '#E6E6FA', '#F0F8FF', '#F9F9F9', '#F0F0F0', '#FAFAFA',
    '#D3D3D3', '#E0FFFF', '#FFF0F5', '#F0FFF0', '#FFF5EE'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePanel = (panel) => {
    setPanels({
      ...panels,
      [panel]: !panels[panel]
    });
  };

  const getShadowStyle = () => {
    const { blur, opacity, color, offsetX, offsetY } = shadowSettings;
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha/100})`;
    };
    
    return `${offsetX}px ${offsetY}px ${blur}px ${hexToRgba(color, opacity)}`;
  };

  const getBackgroundStyle = () => {
    const { type, color, gradientColor1, gradientColor2, gradientAngle } = bgSettings;
    if (type === 'solid') {
      return { backgroundColor: color };
    } else {
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`
      };
    }
  };

  const getBorderStyle = () => {
    const { borderWidth, borderColor, borderStyle, borderRadius } = frameSettings;
    let style = 'solid';
    
    if (borderStyle === 'dashed') {
      style = 'dashed';
    } else if (borderStyle === 'dotted') {
      style = 'dotted';
    }
    
    return {
      border: `${borderWidth}px ${style} ${borderColor}`,
      borderRadius: `${borderRadius}px`
    };
  };

  const PanelHeader = ({ title, isOpen, onClick }) => (
    <div 
      className="flex justify-between items-center p-3 bg-gray-100 rounded-t-md cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-medium">{title}</h3>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 p-4 bg-white shadow-md overflow-auto">
        <h1 className="text-xl font-bold mb-6 text-center">Screenshot Mockup Generator</h1>
        
        {/* Upload Section */}
        <div className="mb-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {image ? 'Change image' : 'Upload screenshot (PNG, JPG, WEBP)'}
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Frame Settings */}
        <div className="mb-3 border rounded-md overflow-hidden">
          <PanelHeader 
            title="Frame Settings" 
            isOpen={panels.frame} 
            onClick={() => togglePanel('frame')}
          />
          
          {panels.frame && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={frameSettings.device}
                  onChange={e => setFrameSettings({...frameSettings, device: e.target.value})}
                >
                  {Object.entries(deviceFrames).map(([key, device]) => (
                    <option key={key} value={key}>{device.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Width ({frameSettings.borderWidth}px)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={frameSettings.borderWidth}
                  onChange={e => setFrameSettings({...frameSettings, borderWidth: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Radius ({frameSettings.borderRadius}px)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={frameSettings.borderRadius}
                  onChange={e => setFrameSettings({...frameSettings, borderRadius: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Style</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={frameSettings.borderStyle}
                  onChange={e => setFrameSettings({...frameSettings, borderStyle: e.target.value})}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Color</label>
                <input 
                  type="color" 
                  value={frameSettings.borderColor}
                  onChange={e => setFrameSettings({...frameSettings, borderColor: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Shadow Settings */}
        <div className="mb-3 border rounded-md overflow-hidden">
          <PanelHeader 
            title="Shadow Effects" 
            isOpen={panels.shadow} 
            onClick={() => togglePanel('shadow')}
          />
          
          {panels.shadow && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Blur Radius ({shadowSettings.blur}px)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={shadowSettings.blur}
                  onChange={e => setShadowSettings({...shadowSettings, blur: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Opacity ({shadowSettings.opacity}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={shadowSettings.opacity}
                  onChange={e => setShadowSettings({...shadowSettings, opacity: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">X Offset ({shadowSettings.offsetX}px)</label>
                  <input 
                    type="range" 
                    min="-50" 
                    max="50" 
                    value={shadowSettings.offsetX}
                    onChange={e => setShadowSettings({...shadowSettings, offsetX: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Y Offset ({shadowSettings.offsetY}px)</label>
                  <input 
                    type="range" 
                    min="-50" 
                    max="50" 
                    value={shadowSettings.offsetY}
                    onChange={e => setShadowSettings({...shadowSettings, offsetY: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shadow Color</label>
                <input 
                  type="color" 
                  value={shadowSettings.color}
                  onChange={e => setShadowSettings({...shadowSettings, color: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Background Settings */}
        <div className="mb-3 border rounded-md overflow-hidden">
          <PanelHeader 
            title="Background Settings" 
            isOpen={panels.background} 
            onClick={() => togglePanel('background')}
          />
          
          {panels.background && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Background Type</label>
                <div className="flex gap-2">
                  <button 
                    className={`px-3 py-1 rounded flex-1 ${bgSettings.type === 'solid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setBgSettings({...bgSettings, type: 'solid'})}
                  >
                    Solid
                  </button>
                  <button 
                    className={`px-3 py-1 rounded flex-1 ${bgSettings.type === 'gradient' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setBgSettings({...bgSettings, type: 'gradient'})}
                  >
                    Gradient
                  </button>
                </div>
              </div>
              
              {bgSettings.type === 'solid' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input 
                    type="color" 
                    value={bgSettings.color}
                    onChange={e => setBgSettings({...bgSettings, color: e.target.value})}
                    className="w-full mb-2"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {paletteColors.map(color => (
                      <div 
                        key={color} 
                        className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() => setBgSettings({...bgSettings, color})}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Color 1</label>
                    <input 
                      type="color" 
                      value={bgSettings.gradientColor1}
                      onChange={e => setBgSettings({...bgSettings, gradientColor1: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color 2</label>
                    <input 
                      type="color" 
                      value={bgSettings.gradientColor2}
                      onChange={e => setBgSettings({...bgSettings, gradientColor2: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Angle ({bgSettings.gradientAngle}°)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      value={bgSettings.gradientAngle}
                      onChange={e => setBgSettings({...bgSettings, gradientAngle: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      ['#F5F5F5', '#E6E6FA'],
                      ['#F0F8FF', '#FAFAFA'],
                      ['#F0FFF0', '#FFF5EE'],
                      ['#E0FFFF', '#FFF0F5'],
                      ['#D3D3D3', '#F9F9F9'],
                      ['#F0F0F0', '#E6E6FA']
                    ].map((pair, i) => (
                      <button 
                        key={i}
                        className="h-8 rounded border border-gray-300"
                        style={{ background: `linear-gradient(45deg, ${pair[0]}, ${pair[1]})` }}
                        onClick={() => setBgSettings({
                          ...bgSettings,
                          gradientColor1: pair[0],
                          gradientColor2: pair[1]
                        })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Export Settings */}
        <div className="mb-3 border rounded-md overflow-hidden">
          <PanelHeader 
            title="Export Options" 
            isOpen={panels.export} 
            onClick={() => togglePanel('export')}
          />
          
          {panels.export && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <div className="flex gap-2">
                  <button 
                    className={`px-3 py-1 rounded flex-1 ${exportSettings.format === 'png' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setExportSettings({...exportSettings, format: 'png'})}
                  >
                    PNG
                  </button>
                  <button 
                    className={`px-3 py-1 rounded flex-1 ${exportSettings.format === 'jpg' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setExportSettings({...exportSettings, format: 'jpg'})}
                  >
                    JPG
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Resolution</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={exportSettings.resolution}
                  onChange={e => setExportSettings({...exportSettings, resolution: e.target.value})}
                >
                  <option value="original">Original Size</option>
                  <option value="1x">1x (Standard)</option>
                  <option value="2x">2x (High-DPI)</option>
                  <option value="3x">3x (Ultra HD)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="transparent" 
                  checked={exportSettings.transparent}
                  onChange={e => setExportSettings({...exportSettings, transparent: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="transparent" className="text-sm">Transparent background</label>
              </div>
              
              <button className="w-full py-2 bg-blue-500 text-white rounded-md flex items-center justify-center gap-2">
                <Download size={18} />
                Download {exportSettings.format.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Area */}
      <div 
        className="flex-1 p-4 flex items-center justify-center"
        style={exportSettings.transparent ? {} : getBackgroundStyle()}
      >
        <div className="relative">
          {image ? (
            <div 
              className="relative"
              style={{
                boxShadow: getShadowStyle(),
                ...getBorderStyle(),
                padding: deviceFrames[frameSettings.device].padding
              }}
            >
              <img 
                src={image} 
                alt="Mockup Preview"
                className="max-w-xs max-h-full object-contain"
                style={{
                  display: 'block'
                }}
              />
            </div>
          ) : (
            <div className="bg-gray-100 border border-gray-300 rounded-md p-16 text-center">
              <Image className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-500">Upload a screenshot to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobShots;
