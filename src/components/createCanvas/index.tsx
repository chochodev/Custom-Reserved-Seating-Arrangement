import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './SeatingArrangement.css';

const SeatingArrangement: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [number, setNumber] = useState<number>(1);

  const grid = 30;
  const backgroundColor = '#f8f8f8';
  const lineStroke = '#ebebeb';
  const tableFill = 'rgba(150, 111, 51, 0.7)';
  const tableStroke = '#694d23';
  const tableShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
  const chairFill = 'rgba(67, 42, 4, 0.7)';
  const chairStroke = '#32230b';
  const chairShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
  const barFill = 'rgba(0, 93, 127, 0.7)';
  const barStroke = '#003e54';
  const barShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
  const barText = 'Bar';
  const wallFill = 'rgba(136, 136, 136, 0.7)';
  const wallStroke = '#686868';
  const wallShadow = 'rgba(0, 0, 0, 0.4) 5px 5px 20px';

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: backgroundColor,
      width: 302,
      height: 812,
    });

    initCanvas.setBackgroundImage(
      'https://presspack.rte.ie/wp-content/blogs.dir/2/files/2015/04/AMC_TWD_Maggie_Portraits_4817_V1.jpg',
      initCanvas.renderAll.bind(initCanvas)
    );

    for (let i = 0; i < (initCanvas.height! / grid); i++) {
      const lineX = new fabric.Line([0, i * grid, initCanvas.width!, i * grid], {
        stroke: lineStroke,
        selectable: false,
      });
      const lineY = new fabric.Line([i * grid, 0, i * grid, initCanvas.height!], {
        stroke: lineStroke,
        selectable: false,
      });
      initCanvas.add(lineX);
      initCanvas.add(lineY);
    }

    const snapToGrid = (target: fabric.Object) => {
      target.set({
        left: Math.round((target.left || 0) / grid) * grid,
        top: Math.round((target.top || 0) / grid) * grid,
      });
    };

    initCanvas.on('object:moving', (e) => snapToGrid(e.target));

    setCanvas(initCanvas);
  }, [canvasRef]);

  const addRect = (left: number, top: number, width: number, height: number) => {
    const id = generateId();
    const o = new fabric.Rect({
      width,
      height,
      fill: tableFill,
      stroke: tableStroke,
      strokeWidth: 2,
      shadow: tableShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
    });
    const t = new fabric.IText(number.toString(), {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });
    const g = new fabric.Group([o, t], {
      left,
      top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'table',
      id,
      number,
    });
    canvas?.add(g);
    setNumber((prev) => prev + 1);
    return g;
  };

  const addCircle = (left: number, top: number, radius: number) => {
    const id = generateId();
    const o = new fabric.Circle({
      radius,
      fill: tableFill,
      stroke: tableStroke,
      strokeWidth: 2,
      shadow: tableShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
    });
    const t = new fabric.IText(number.toString(), {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });
    const g = new fabric.Group([o, t], {
      left,
      top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'table',
      id,
      number,
    });
    canvas?.add(g);
    setNumber((prev) => prev + 1);
    return g;
  };

  const addChair = (left: number, top: number) => {
    const o = new fabric.Rect({
      left,
      top,
      width: 30,
      height: 30,
      fill: chairFill,
      stroke: chairStroke,
      strokeWidth: 2,
      shadow: chairShadow,
      originX: 'left',
      originY: 'top',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'chair',
      id: generateId(),
    });
    canvas?.add(o);
    return o;
  };

  const addBar = (left: number, top: number, width: number, height: number) => {
    const o = new fabric.Rect({
      width,
      height,
      fill: barFill,
      stroke: barStroke,
      strokeWidth: 2,
      shadow: barShadow,
      originX: 'center',
      originY: 'center',
      type: 'bar',
      id: generateId(),
    });
    const t = new fabric.IText(barText, {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });
    const g = new fabric.Group([o, t], {
      left,
      top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'bar',
    });
    canvas?.add(g);
    return g;
  };

  const addWall = (left: number, top: number, width: number, height: number) => {
    const o = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: wallFill,
      stroke: wallStroke,
      strokeWidth: 2,
      shadow: wallShadow,
      originX: 'left',
      originY: 'top',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'wall',
      id: generateId(),
    });
    canvas?.add(o);
    return o;
  };

  const generateId = () => Math.random().toString(36).substr(2, 8);

  const resizeCanvas = () => {
    const widthEl = document.getElementById('width') as HTMLInputElement;
    const heightEl = document.getElementById('height') as HTMLInputElement;
    if (canvas) {
      canvas.setWidth(parseInt(widthEl.value) || 302);
      canvas.setHeight(parseInt(heightEl.value) || 812);
      canvas.renderAll();
    }
  };

  const removeObject = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      canvas?.remove(activeObject);
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }
  };

  const toggleCustomerMode = () => {
    const adminMenu = document.querySelector('.admin-menu') as HTMLElement;
    const customerMenu = document.querySelector('.customer-menu') as HTMLElement;
    adminMenu.style.display = 'none';
    customerMenu.style.display = 'block';
    canvas?.getObjects().forEach((obj) => {
      obj.hasControls = false;
      obj.lockMovementX = true;
      obj.lockMovementY = true;
      if (obj.type === 'chair' || obj.type === 'bar' || obj.type === 'wall') {
        obj.selectable = false;
      }
    });
    canvas!.selection = false;
    canvas!.hoverCursor = 'pointer';
    canvas!.discardActiveObject();
    canvas!.renderAll();
  };

  const toggleAdminMode = () => {
    const adminMenu = document.querySelector('.admin-menu') as HTMLElement;
    const customerMenu = document.querySelector('.customer-menu') as HTMLElement;
    adminMenu.style.display = 'block';
    customerMenu.style.display = 'none';
    canvas?.getObjects().forEach((obj) => {
      obj.hasControls = true;
      obj.lockMovementX = false;
      obj.lockMovementY = false;
      if (obj.type === 'chair' || obj.type === 'bar' || obj.type === 'wall') {
        obj.selectable = true;
      }
    });
    canvas!.selection = true;
    canvas!.hoverCursor = 'move';
    canvas!.discardActiveObject();
    canvas!.renderAll();
  };

  return (
    <div className="container-fluid text-center">
      <h1>
        <a href="http://fabricjs.com/" target="_blank">
          Fabric.js
        </a>{' '}
        Restaurant reservation system
      </h1>
      <p className="text-muted">
        There is no need to use jQuery or Bootstrap at all, it's used only to show modals and make buttons look better. I have also used{' '}
        <a href="https://refreshless.com/nouislider/" target="_blank">
          noUiSlider
        </a>{' '}
        for time selection.
      </p>
      <div className="form-group admin-menu">
        <div className="row">
          <div className="col-sm-2 col-sm-offset-3 form-group">
            <label>Width (px)</label>
            <input type="number" id="width" className="form-control" defaultValue="302" onChange={resizeCanvas} />
          </div>
          <div className="col-sm-2 form-group">
            <label>Height (px)</label>
            <input type="number" id="height" className="form-control" defaultValue="812" onChange={resizeCanvas} />
          </div>
          <div className="col-sm-2 form-group">
            <label>&nbsp;</label>
            <br />
            <button className="btn btn-primary" onClick={resizeCanvas}>
              Save
            </button>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary rectangle" onClick={() => addRect(0, 0, 60, 60)}>
            + &#9647; Table
          </button>
          <button className="btn btn-primary circle" onClick={() => addCircle(0, 0, 30)}>
            + &#9711; Table
          </button>
          <button className="btn btn-primary chair" onClick={() => addChair(0, 0)}>
            + Chair
          </button>
          <button className="btn btn-primary bar" onClick={() => addBar(0, 0, 180, 60)}>
            + Bar
          </button>
          <button className="btn btn-default wall" onClick={() => addWall(0, 0, 60, 180)}>
            + Wall
          </button>
          <button className="btn btn-danger remove" onClick={removeObject}>
            Remove
          </button>
          <button className="btn btn-warning customer-mode" onClick={toggleCustomerMode}>
            Customer mode
          </button>
        </div>
      </div>
      <div className="form-group customer-menu" style={{ display: 'none' }}>
        <div className="btn-group">
          <button className="btn btn-success submit">Submit reservation</button>
          <button className="btn btn-warning admin-mode" onClick={toggleAdminMode}>
            Admin mode
          </button>
        </div>
        <br />
        <br />
        <div id="slider"></div>
        <div id="slider-value"></div>
      </div>
      <canvas ref={canvasRef} id="canvas" width="302" height="812"></canvas>
    </div>
  );
};

export default SeatingArrangement;
