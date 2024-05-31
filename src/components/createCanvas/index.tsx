import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const SeatingArrangement: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement);

    // Define seating rows and columns
    const rows = 5;
    const columns = 10;
    const seatSize = 30;
    const seatSpacing = 10;

    const seats: fabric.Rect[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const seat = new fabric.Rect({
          left: col * (seatSize + seatSpacing),
          top: row * (seatSize + seatSpacing),
          fill: 'green',
          width: seatSize,
          height: seatSize,
          hasControls: false,
        });

        seat.on('mousedown', () => {
          if (seat.fill === 'green') {
            seat.set('fill', 'red'); // Reserved
          } else {
            seat.set('fill', 'green'); // Available
          }
          canvas.renderAll();
        });

        seats.push(seat);
        canvas.add(seat);
      }
    }

    // Enable dragging for the seats
    canvas.on('object:moving', (options) => {
      const seat: any = options.target as fabric.Rect;
      seat.set({
        left: Math.round(seat.left / (seatSize + seatSpacing)) * (seatSize + seatSpacing),
        top: Math.round(seat.top / (seatSize + seatSpacing)) * (seatSize + seatSpacing),
      });
    });

    // Clean up on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default SeatingArrangement;
