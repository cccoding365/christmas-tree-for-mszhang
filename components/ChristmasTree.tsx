
import React, { useRef, useEffect } from 'react';

const ChristmasTree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 基础配置
    const particleCount = 1500;
    const lightCount = 320; // 螺旋灯带数量
    const ornamentCount = 50; // 礼物/装饰物数量
    
    const treeParticles: any[] = [];
    const fairyLights: any[] = [];
    const ornaments: any[] = [];
    
    const width = 500;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 基础树粒子类
    class Particle {
      angle: number;
      r: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      twinkle: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.y = Math.random() * 450; 
        const maxRadius = (1 - (this.y / 450)) * 160; 
        this.r = Math.random() * maxRadius;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.01 + 0.005;
        this.twinkle = Math.random() * 0.1;
        
        const isYellow = Math.random() > 0.6;
        this.color = isYellow 
          ? `rgba(${250 + Math.random() * 5}, ${200 + Math.random() * 55}, ${20 + Math.random() * 30},` 
          : `rgba(${30 + Math.random() * 40}, ${180 + Math.random() * 70}, ${60 + Math.random() * 40},`;
      }

      update() {
        this.angle += this.speed;
        this.twinkle += 0.05;
      }

      draw(context: CanvasRenderingContext2D, rotationAngle: number) {
        const currentAngle = this.angle + rotationAngle;
        const x = Math.cos(currentAngle) * this.r;
        const z = Math.sin(currentAngle) * this.r;
        const perspective = (z + 200) / 400;
        const screenX = width / 2 + x;
        const screenY = height - 100 - this.y;
        const opacity = (Math.sin(this.twinkle) * 0.5 + 0.5) * 0.8 * (0.5 + perspective);

        context.beginPath();
        context.arc(screenX, screenY, this.size * perspective * 1.5, 0, Math.PI * 2);
        context.fillStyle = this.color + opacity + ')';
        context.fill();
        if (this.color.includes('250')) {
          context.shadowBlur = 5;
          context.shadowColor = 'rgba(251, 191, 36, 0.3)';
        } else {
          context.shadowBlur = 0;
        }
      }
    }

    // 螺旋彩灯类
    class FairyLight {
      y: number;
      phase: number;
      color: string;
      constructor(index: number) {
        // 沿高度分布
        this.y = (index / lightCount) * 450;
        // 螺旋相位：随高度旋转多次
        this.phase = (index / lightCount) * Math.PI * 12; 
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff', '#ff00ff'];
        this.color = colors[index % colors.length];
      }

      draw(context: CanvasRenderingContext2D, rotationAngle: number) {
        const currentAngle = this.phase + rotationAngle;
        const r = (1 - (this.y / 450)) * 165; // 稍微比树宽一点
        const x = Math.cos(currentAngle) * r;
        const z = Math.sin(currentAngle) * r;
        const perspective = (z + 200) / 400;
        const screenX = width / 2 + x;
        const screenY = height - 100 - this.y;
        
        const flicker = Math.sin(Date.now() / 200 + this.y) * 0.5 + 0.5;

        context.beginPath();
        context.arc(screenX, screenY, 3 * perspective, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.globalAlpha = flicker * perspective;
        context.shadowBlur = 15;
        context.shadowColor = this.color;
        context.fill();
        context.globalAlpha = 1.0;
        context.shadowBlur = 0;
      }
    }

    // 挂在树上的装饰物/礼物
    class Ornament {
      angle: number;
      y: number;
      r: number;
      type: string;
      color: string;
      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.y = Math.random() * 420 + 20; 
        this.r = (1 - (this.y / 450)) * 160;
        const types = ['🎁', '🍬', '🎈', '🔔', '❄️'];
        this.type = types[Math.floor(Math.random() * types.length)];
        this.color = ['#f43f5e', '#fbbf24', '#ffffff', '#60a5fa'][Math.floor(Math.random() * 4)];
      }

      draw(context: CanvasRenderingContext2D, rotationAngle: number) {
        const currentAngle = this.angle + rotationAngle;
        const x = Math.cos(currentAngle) * this.r;
        const z = Math.sin(currentAngle) * this.r;
        const perspective = (z + 200) / 400;
        
        // 只绘制正面的装饰物，增加立体感
        if (z < -20) return;

        const screenX = width / 2 + x;
        const screenY = height - 100 - this.y;

        context.font = `${Math.floor(16 * perspective)}px serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = this.color;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(255,255,255,0.5)';
        context.fillText(this.type, screenX, screenY);
        context.shadowBlur = 0;
      }
    }

    // 初始化所有元素
    for (let i = 0; i < particleCount; i++) treeParticles.push(new Particle());
    for (let i = 0; i < lightCount; i++) fairyLights.push(new FairyLight(i));
    for (let i = 0; i < ornamentCount; i++) ornaments.push(new Ornament());

    let rotation = 0;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.012; // 稍微快一点的旋转

      // 1. 绘制背景层粒子 (z < 0)
      treeParticles.forEach(p => {
        const z = Math.sin(p.angle + rotation) * p.r;
        if (z < 0) {
          p.update();
          p.draw(ctx, rotation);
        }
      });

      // 2. 绘制螺旋彩灯
      fairyLights.forEach(l => l.draw(ctx, rotation));

      // 3. 绘制装饰物
      ornaments.forEach(o => o.draw(ctx, rotation));

      // 4. 绘制前景层粒子 (z >= 0)
      treeParticles.forEach(p => {
        const z = Math.sin(p.angle + rotation) * p.r;
        if (z >= 0) {
          p.update();
          p.draw(ctx, rotation);
        }
      });

      // 5. 绘制顶部的星星
      const starOpacity = Math.sin(Date.now() / 500) * 0.2 + 0.8;
      ctx.font = '44px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#fcd34d';
      ctx.fillStyle = `rgba(255, 215, 0, ${starOpacity})`;
      ctx.fillText('🌟', width / 2, height - 100 - 465);
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="filter drop-shadow-[0_0_40px_rgba(34,197,94,0.4)]"
        style={{ width: '450px', height: '550px' }}
      />
    </div>
  );
};

export default ChristmasTree;
