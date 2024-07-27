import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import './index.css';

const AddSeat = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [number, setNumber] = useState(1);
  const [width, setWidth] = useState(302);
  const [height, setHeight] = useState(812);
  const grid = 30;
  const colors = {
    backgroundColor: '#f8f8f8',
    lineStroke: '#ebebeb',
    tableFill: 'rgba(150, 111, 51, 0.7)',
    tableStroke: '#694d23',
    tableShadow: 'rgba(0, 0, 0, 0.4) 3px 3px 7px',
    chairFill: 'rgba(67, 42, 4, 0.7)',
    chairStroke: '#32230b',
    chairShadow: 'rgba(0, 0, 0, 0.4) 3px 3px 7px',
    barFill: 'rgba(0, 93, 127, 0.7)',
    barStroke: '#003e54',
    barShadow: 'rgba(0, 0, 0, 0.4) 3px 3px 7px',
    barText: 'Bar',
    wallFill: 'rgba(136, 136, 136, 0.7)',
    wallStroke: '#686868',
    wallShadow: 'rgba(0, 0, 0, 0.4) 5px 5px 20px'
  };

  useEffect(() => {
    initCanvas();
    const slider = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: 1200,
      step: 15,
      connect: 'lower',
      range: {
        min: 0,
        max: 1425
      }
    });
    slider.noUiSlider.on('update', function (values, handle) {
      const sliderValue = document.getElementById('slider-value');
      sliderValue.innerHTML = formatTime(values[handle]);
    });
  }, []);

  useEffect(() => {
    resizeCanvas();
  }, [width, height]);

  const initCanvas = () => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current);
      setCanvas(newCanvas);
      newCanvas.backgroundColor = colors.backgroundColor;
      newCanvas.setBackgroundImage('https://presspack.rte.ie/wp-content/blogs.dir/2/files/2015/04/AMC_TWD_Maggie_Portraits_4817_V1.jpg', newCanvas.renderAll.bind(newCanvas));

      for (let i = 0; i < (newCanvas.height / grid); i++) {
        const lineX = new fabric.Line([0, i * grid, newCanvas.height, i * grid], {
          stroke: colors.lineStroke,
          selectable: false,
          type: 'line'
        });
        const lineY = new fabric.Line([i * grid, 0, i * grid, newCanvas.height], {
          stroke: colors.lineStroke,
          selectable: false,
          type: 'line'
        });
        sendLinesToBack(newCanvas);
        newCanvas.add(lineX);
        newCanvas.add(lineY);
      }

      newCanvas.on('object:moving', (e) => snapToGrid(e.target));
      newCanvas.on('object:scaling', (e) => handleObjectScaling(e));
      newCanvas.on('object:modified', (e) => handleObjectModified(e, newCanvas));
      newCanvas.observe('object:moving', (e) => checkBoundingBox(e, newCanvas));
      newCanvas.observe('object:rotating', (e) => checkBoundingBox(e, newCanvas));
      newCanvas.observe('object:scaling', (e) => checkBoundingBox(e, newCanvas));

      addDefaultObjects(newCanvas);
    }
  };

  const resizeCanvas = () => {
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  };

  const snapToGrid = (target) => {
    target.set({
      left: Math.round(target.left / (grid / 2)) * grid / 2,
      top: Math.round(target.top / (grid / 2)) * grid / 2
    });
  };

  const handleObjectScaling = (e) => {
    if (e.target.scaleX > 5) e.target.scaleX = 5;
    if (e.target.scaleY > 5) e.target.scaleY = 5;
    if (!e.target.strokeWidthUnscaled && e.target.strokeWidth) {
      e.target.strokeWidthUnscaled = e.target.strokeWidth;
    }
    if (e.target.strokeWidthUnscaled) {
      e.target.strokeWidth = e.target.strokeWidthUnscaled / e.target.scaleX;
      if (e.target.strokeWidth === e.target.strokeWidthUnscaled) {
        e.target.strokeWidth = e.target.strokeWidthUnscaled / e.target.scaleY;
      }
    }
  };

  const handleObjectModified = (e, canvas) => {
    e.target.scaleX = e.target.scaleX >= 0.25 ? (Math.round(e.target.scaleX * 2) / 2) : 0.5;
    e.target.scaleY = e.target.scaleY >= 0.25 ? (Math.round(e.target.scaleY * 2) / 2) : 0.5;
    snapToGrid(e.target);
    if (e.target.type === 'table') {
      canvas.bringToFront(e.target);
    } else {
      canvas.sendToBack(e.target);
    }
    sendLinesToBack(canvas);
  };

  const checkBoundingBox = (e, canvas) => {
    const obj = e.target;
    if (!obj) return;
    obj.setCoords();
    const objBoundingBox = obj.getBoundingRect();
    if (objBoundingBox.top < 0) {
      obj.set('top', 0);
      obj.setCoords();
    }
    if (objBoundingBox.left > canvas.width - objBoundingBox.width) {
      obj.set('left', canvas.width - objBoundingBox.width);
      obj.setCoords();
    }
    if (objBoundingBox.top > canvas.height - objBoundingBox.height) {
      obj.set('top', canvas.height - objBoundingBox.height);
      obj.setCoords();
    }
    if (objBoundingBox.left < 0) {
      obj.set('left', 0);
      obj.setCoords();
    }
  };

  const sendLinesToBack = (canvas) => {
    canvas.getObjects().map(o => {
      if (o.type === 'line') {
        canvas.sendToBack(o);
      }
    });
  };

  const generateId = () => Math.random().toString(36).substr(2, 8);

  const addShape = (shapeType, left, top, width, height, radius) => {
    const id = generateId();
    let o;
    switch (shapeType) {
      case 'rect':
        o = new fabric.Rect({
          width,
          height,
          fill: colors.tableFill,
          stroke: colors.tableStroke,
          strokeWidth: 2,
          shadow: colors.tableShadow,
          originX: 'center',
          originY: 'center',
          centeredRotation: true,
          snapAngle: 45,
          selectable: true
        });
        break;
      case 'circle':
        o = new fabric.Circle({
          radius,
          fill: colors.tableFill,
          stroke: colors.tableStroke,
          strokeWidth: 2,
          shadow: colors.tableShadow,
          originX: 'center',
          originY: 'center',
          centeredRotation: true
        });
        break;
      case 'triangle':
        o = new fabric.Triangle({
          radius,
          fill: colors.tableFill,
          stroke: colors.tableStroke,
          strokeWidth: 2,
          shadow: colors.tableShadow,
          originX: 'center',
          originY: 'center',
          centeredRotation: true
        });
        break;
      default:
        return;
    }
    const t = new fabric.IText(number.toString(), {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    const g = new fabric.Group([o, t], {
      left,
      top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'table',
      id,
      number
    });
    canvas.add(g);
    setNumber(prevNumber => prevNumber + 1);
  };

  const addChair = (left, top) => {
    const o = new fabric.Rect({
      left,
      top,
      width: 30,
      height: 30,
      fill: colors.chairFill,
      stroke: colors.chairStroke,
      strokeWidth: 2,
      shadow: colors.chairShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true
    });
    o.setControlsVisibility({
      mtr: false
    });
    canvas.add(o);
  };

  const addBar = (left, top) => {
    const o = new fabric.Rect({
      left,
      top,
      width: 120,
      height: 60,
      fill: colors.barFill,
      stroke: colors.barStroke,
      strokeWidth: 2,
      shadow: colors.barShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true
    });
    const t = new fabric.IText(colors.barText, {
      fontFamily: 'Calibri',
      fontSize: 24,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    const g = new fabric.Group([o, t], {
      left,
      top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'bar',
      id: generateId()
    });
    canvas.add(g);
  };

  const addWall = (left, top) => {
    const o = new fabric.Rect({
      left,
      top,
      width: 30,
      height: 300,
      fill: colors.wallFill,
      stroke: colors.wallStroke,
      strokeWidth: 2,
      shadow: colors.wallShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true
    });
    o.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: false
    });
    canvas.add(o);
  };

  const formatTime = (time) => {
    const num = Number(time);
    const hours = Math.floor(num / 60);
    const minutes = Math.floor(num % 60);
    const hoursStr = (hours < 10) ? '0' + hours : hours;
    const minutesStr = (minutes < 10) ? '0' + minutes : minutes;
    return `${hoursStr}:${minutesStr}`;
  };

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      <div id="slider"></div>
      <div id="slider-value"></div>
    </div>
  );
};

export default AddSeat;
