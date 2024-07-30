import React, { useEffect, useRef, useState } from 'react';
import '../../styles/MouseTrail.css';

interface IConfetto {
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  gravity: number;
  drag: number;
  timeToLive: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (deltaTime: number) => void;
}

class Confetto implements IConfetto {
  public size: number;
  public color: string;
  public gravity: number;
  public drag: number;
  public timeToLive: number;
  private colors: string[];

  constructor(
    public x: number,
    public y: number,
    public velocityX: number,
    public velocityY: number
  ) {
    this.size = Math.random() * 15;
    this.colors = ['white', 'lightpink'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.gravity = 0.02;
    this.drag = 0.97;
    this.timeToLive = 500;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    const spikes = 4;
    const outerRadius = this.size;
    const innerRadius = this.size / 2;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / spikes) * Math.PI;

      const x = this.x + Math.cos(angle) * radius;
      const y = this.y + Math.sin(angle) * radius;

      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  };

  update = (deltaTime: number) => {
    this.x += this.velocityX;
    this.velocityX *= this.drag;
    this.y += this.velocityY;
    this.velocityY += this.gravity;
    this.size = Math.max(
      0,
      this.size - (this.size * deltaTime) / this.timeToLive
    );
  };
}

const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [confetti, setConfetti] = useState<(IConfetto | Confetto)[]>([]);
  const trailingElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const resizeHandler = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', resizeHandler);

    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;

    const addConfettoAndTrail = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      mouseVelocityX = e.clientX - lastMouseX;
      mouseVelocityY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      const randomOffsetX = (Math.random() - 0.5) * 100;
      const randomOffsetY = (Math.random() - 0.5) * 100;

      setConfetti((prevConfetti) => [
        ...prevConfetti,
        new Confetto(
          e.clientX - rect.left,
          e.clientY - rect.top,
          mouseVelocityX + randomOffsetX,
          mouseVelocityY + randomOffsetY
        ),
      ]);

      const trail = document.createElement('div');
      trail.classList.add('trail');
      trail.style.top = `${e.clientY - rect.top}px`;
      trail.style.left = `${e.clientX - rect.left}px`;

      container.appendChild(trail);

      trailingElementsRef.current.push(trail);

      if (trailingElementsRef.current.length > 4) {
        const removedTrail = trailingElementsRef.current.shift();
        if (removedTrail) {
          removedTrail.remove();
        }
      }
    };

    container.addEventListener('mousemove', addConfettoAndTrail);

    let lastTime = 0;

    const update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      setConfetti((prevConfetti) => {
        const updatedConfetti = prevConfetti.map((confetto) => {
          confetto.update(deltaTime);
          confetto.draw(ctx);
          return confetto;
        });

        return updatedConfetti.filter(
          (confetto) =>
            confetto.size > 0 &&
            confetto.y < height &&
            confetto.x > 0 &&
            confetto.x < width
        );
      });

      requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      container.removeEventListener('mousemove', addConfettoAndTrail);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} className="flow"></canvas>
    </div>
  );
};

export default MouseTrail;
