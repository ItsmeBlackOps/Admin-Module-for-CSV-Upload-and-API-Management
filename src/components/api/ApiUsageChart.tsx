import React, { useEffect, useRef } from 'react';
import { BarChart3 } from 'lucide-react';

export const ApiUsageChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Generate mock data for API usage
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Mock API calls data for the past week
    const apiCalls = [320, 250, 400, 350, 500, 450, 380];
    
    // Set canvas dimensions
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
    
    // Chart dimensions
    const chartWidth = canvasRef.current.width - 60;
    const chartHeight = canvasRef.current.height - 60;
    const barWidth = chartWidth / apiCalls.length - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw chart background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(40, 20, chartWidth, chartHeight);
    
    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, 20 + chartHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();
    
    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(40, 20 + chartHeight);
    ctx.lineTo(40 + chartWidth, 20 + chartHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();
    
    // Draw horizontal gridlines
    const maxValue = Math.max(...apiCalls);
    const gridLines = 5;
    
    for (let i = 0; i <= gridLines; i++) {
      const y = 20 + chartHeight - (i * (chartHeight / gridLines));
      
      // Draw gridline
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(40 + chartWidth, y);
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
      
      // Draw value label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText((maxValue * (i / gridLines)).toFixed(0), 35, y + 3);
    }
    
    // Draw bars
    const maxBarHeight = chartHeight;
    
    apiCalls.forEach((value, index) => {
      const barHeight = (value / maxValue) * maxBarHeight;
      const x = 40 + (index * ((chartWidth) / apiCalls.length)) + 10;
      const y = 20 + (chartHeight - barHeight);
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#6366f1');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw day label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(days[index], x + barWidth / 2, 20 + chartHeight + 15);
    });
    
    // Chart title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('API Requests (Last 7 Days)', canvasRef.current.width / 2, 15);
    
  }, []);
  
  return (
    <div className="relative h-full w-full">
      {/* Fallback if canvas is not supported */}
      <div className="absolute flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center text-slate-400">
          <BarChart3 size={40} className="mb-2" />
          <span className="text-sm">API Usage Chart</span>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="relative h-full w-full" 
      />
    </div>
  );
};