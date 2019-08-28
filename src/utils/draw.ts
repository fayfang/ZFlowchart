import zrender from 'zrender';
import { PositionXY } from '../ts/types';
import MathMatrix from './math.matrix';
import { StatusColor } from '../vars/vars';

function getTextRect(text: string) {
  const span = document.createElement('span');
  span.innerText = text;
  span.style.fontSize = '12px';
  span.style.position = 'fixed';
  span.style.top = '-9999px';
  span.style.left = '-9999px';
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  document.body.removeChild(span);
  return rect;
}

export const drawLine = (points: PositionXY[], style?: any) => {
  if (points.length < 2) {
    return console.error('at least two point is needed to draw line');
  }

  const length = points.length;
  const lastPoint = points[length - 1];
  const lboPoint = points[length - 2];

  const line = new zrender.Polyline({
    style,
    shape: {
      points,
    },
  });

  // 用向量获取偏转角度
  const v1 = new Float32Array([lboPoint[0], lboPoint[1]]);
  const v2 = new Float32Array([lastPoint[0], lastPoint[1]]);
  const out = new Float32Array(2);
  zrender.vector.sub(out, v2, v1);

  const angle = Math.atan2(out[1], out[0]) - (Math.PI / 6);

  const arrow = new zrender.Isogon({
    shape: {
      x: 0,
      y: 0,
      n: 3,
      r: 5,
    },
    style: {
      fill: style.color,
    },
  });

  // 先原点旋转，再移动
  const rotate = new Float32Array([Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0]);
  const move = new Float32Array([1, 0, 0, 1, lastPoint[0], lastPoint[1]]);

  arrow.transform = MathMatrix.mul(rotate, move);
  arrow.decomposeTransform();

  const group = new zrender.Group();
  group.add(line);
  group.add(arrow);

  return group;
};

export const drawStatus = (text: string, color: string) => {
  const rect = getTextRect(text);
  const radius = Math.max(20, (rect.width + 10) / 2);

  const circle = new zrender.Circle({
    draggable: true,
    shape: {
      r: radius,
    },
    style: {
      text,
      fill: 'none',
      stroke: color,
    },
  });

  return circle;
};

export const drawJudgment = (text: string) => {
  const rect = getTextRect(text);

  const polygon = new zrender.Polygon({
    shape: {
      points: [
        [0, 0],
        [rect.width + 60, 0],
        [rect.width + 60, rect.height + 20],
        [0, rect.height + 20],
      ],
    },
    style: {
      text,
      fill: 'none',
      stroke: StatusColor.normal,
    },
  });

  return polygon;
};

export const drawProcess = (text: string) => {
  const rect = getTextRect(text);

  const square = new zrender.Rect({
    shape: {
      r: [5, 5, 5, 5],
      width: rect.width + 15,
      height: rect.height + 10,
    },
    style: {
      text,
      fill: 'none',
      stroke: StatusColor.normal,
    },
  });

  return square;
};

export default {
  drawLine,
  drawStatus,
  drawJudgment,
  drawProcess,
};
