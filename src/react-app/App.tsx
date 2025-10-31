import { useEffect, useRef, useState } from "react";
const spriteUrl = new URL("./as/sprite.png", import.meta.url).href;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("unknown");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cnv = canvas as HTMLCanvasElement;
    const maybeCtx = cnv.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx as CanvasRenderingContext2D;

    ctx.font = "bold 30px sans-serif";
    ctx.lineWidth = 4;

    const image = new Image();
    image.src = spriteUrl as string;

    const maxStones = 6;
    const size = 40;
    let angle = -Math.PI / 2;

    let x: number;
    let y: number;
    let frame: number;
    let currentStone: number;
    let mode: "wait" | "pointerdown" | "stickFall" | "run" | "gameOver";
    let run: number;
    let offset: number;
    let stickLength: number;
    let stones: Array<{ x: number; width: number }>;

    let rafId: number | null = null;

    function reset() {
      currentStone = 0;
      x = 100;
      y = 360;
      frame = 0;
      stones = [];
      stickLength = 0;
      offset = 0;
      run = 0;
      for (let i = 0; i < maxStones; i++) {
        stones[i] = {
          x: i * 300 + Math.floor(Math.random() * 80),
          width: 50 + Math.floor(Math.random() * 50),
        };
      }
      stones[0].x = 80;
      mode = "wait";
    }

    function animate() {
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.fillText(
        "Distance remaining: " + (maxStones - currentStone - 1),
        250,
        100
      );
      stones.forEach((stone) => {
        ctx.fillRect(stone.x - offset, 398, stone.width, 600);
      });

      ctx.drawImage(
        image,
        Math.floor(frame) * size,
        0,
        size,
        size,
        x + size / 2,
        y,
        size,
        size
      );
      switch (mode) {
        case "pointerdown":
          stickLength++;
          break;
        case "stickFall":
          angle = angle + Math.PI / 64;
          if (angle >= 0) mode = "run";
          break;
        case "run":
          offset++;
          run++;
          frame = frame + 0.5;
          if (frame == 20) frame = 0;
          if (stickLength == run) {
            mode = "wait";
            angle = -Math.PI / 2;
            stickLength = 0;
            run = 0;
            let gameOver = true;
            stones.forEach((stone, index) => {
              if (
                offset + x + size > stone.x &&
                offset + x < stone.x + stone.width - size
              ) {
                gameOver = false;
                currentStone = Math.max(currentStone, index);
                if (currentStone == maxStones - 1) {
                  mode = "gameOver";
                  frame = 21;
                }
              }
            });
            if (gameOver) {
              mode = "gameOver";
              frame = 20;
            }
          }
          break;
        case "gameOver":
          if (currentStone < maxStones - 1) {
            y++;
            ctx.fillText("Game over. Click to restart", 20, 60);
          } else ctx.fillText("You win! Click to restart", 20, 60);
      }
      const x2 = x + (stickLength - run) * Math.cos(angle);
      const y2 = y + (stickLength - run) * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(x + size - run, y + size);
      ctx.lineTo(x2 + size, y2 + size);
      ctx.stroke();
      rafId = window.requestAnimationFrame(animate);
    }

    const handlePointerDown = () => {
      switch (mode) {
        case "wait":
          mode = "pointerdown";
          break;
        case "gameOver":
          mode = "wait";
          reset();
      }
    };

    const handlePointerUp = () => {
      if (mode === "pointerdown") mode = "stickFall";
    };

    reset();
    rafId = window.requestAnimationFrame(animate);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
      </div>
      <h2>Stick Runner</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        style={{
          width: "100%",
          maxWidth: 600,
          border: "1px solid #eee",
        }}
      />
    </>
  );
};

export default App;
