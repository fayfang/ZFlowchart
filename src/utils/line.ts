import { DNode, LineItem, PositionXY } from '../ts/types';
import { drawLine } from './draw';

const LINECOLOR = ['#34495e', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];
// 获取相对位置
function getPosition(fromNode: DNode, toNode: DNode) {
  const position = ['center', 'center'];

  position[0] = fromNode.col > toNode.col ? 'left' : fromNode.col < toNode.col ? 'right' : 'center';
  position[1] = fromNode.level > toNode.level ? 'top' : fromNode.level < toNode.level ? 'bottom' : 'center';

  return position;
}
// 获取位置相对的坐标点
function getPointList(fromNode: DNode, toNode: DNode, obstructs: boolean[]): PositionXY[] {
  const position = getPosition(fromNode, toNode);
  const fromRect: PositionXY[] = [
    [fromNode.levelX, fromNode.levelY - fromNode.vmRect.height / 2],
    [fromNode.levelX + fromNode.vmRect.width / 2, fromNode.levelY],
    [fromNode.levelX, fromNode.levelY + fromNode.vmRect.height / 2],
    [fromNode.levelX - fromNode.vmRect.width / 2, fromNode.levelY],
  ];
  const toRect: PositionXY[] = [
    [toNode.levelX, toNode.levelY - toNode.vmRect.height / 2 - 5],
    [toNode.levelX + toNode.vmRect.width / 2 + 3, toNode.levelY],
    [toNode.levelX, toNode.levelY + toNode.vmRect.height / 2 + 5],
    [toNode.levelX - toNode.vmRect.width / 2 - 3, toNode.levelY],
  ];
  const num = 0;
  const fromRectFold: PositionXY[] = [
    [fromNode.levelX, fromNode.levelY - fromNode.levelHeight / 2 - num],
    [fromNode.levelX + fromNode.levelWidth / 2 + num, fromNode.levelY],
    [fromNode.levelX, fromNode.levelY + fromNode.levelHeight / 2 + num],
    [fromNode.levelX - fromNode.levelWidth / 2 - num, fromNode.levelY],
  ];
  const toRectFold: PositionXY[] = [
    [toNode.levelX, toNode.levelY - toNode.levelHeight / 2 - num],
    [toNode.levelX + toNode.levelWidth / 2 + num, toNode.levelY],
    [toNode.levelX, toNode.levelY + toNode.levelHeight / 2 + num],
    [toNode.levelX - toNode.levelWidth / 2 - num, toNode.levelY],
  ];

  function getPoints(type: string): PositionXY[] {
    const centerMap: any = {
      'center,bottom': [1, 1, 2, 0],
      'center,top': [1, 3, 0, 2],
      'left,center': [0, 2, 3, 1],
      'right,center': [0, 0, 1, 3],
    };
    if (centerMap[type]) {
      const map = centerMap[type];
      if (obstructs[map[0]]) {
        return [fromRect[map[1]], fromRectFold[map[1]], toRectFold[map[1]], toRect[map[1]]];
      } else {
        return [fromRect[map[2]], toRect[map[3]]];
      }
    }
    // 后面的太复杂，直接列举，不整合了，怕以后看晕。有合理的数学模型再整合
    if (type === 'left,top') {
      if (!obstructs[0] && !obstructs[1]) {
        return [fromRect[0], [fromRect[0][0], toRect[1][1]], toRect[1]];
      } else if (!obstructs[2] && !obstructs[3]) {
        return [fromRect[3], [toRect[2][0], fromRect[3][1]], toRect[2]];
      } else if (!obstructs[0]) {
        return [fromRect[3], fromRectFold[3], [fromRectFold[3][0], toRect[1][1]], toRect[1]];
      } else if (!obstructs[1]) {
        return [fromRect[0], [fromRect[0][0], toRectFold[2][1]], toRectFold[2], toRect[2]];
      } else if (!obstructs[2]) {
        return [fromRect[3], [toRectFold[1][0], fromRect[3][1]], toRectFold[1], toRect[1]];
      } else if (!obstructs[3]) {
        return [fromRect[0], fromRectFold[0], [toRect[2][0], fromRectFold[0][1]], toRect[2]];
      } else {
        return [fromRect[0], fromRectFold[0], [toRectFold[1][0], fromRectFold[0][1]], toRectFold[1], toRect[1]];
      }
    }
    if (type === 'right,bottom') {
      if (!obstructs[0] && !obstructs[1]) {
        return [fromRect[1], [toRect[0][0], fromRect[1][1]], toRect[0]];
      } else if (!obstructs[2] && !obstructs[3]) {
        return [fromRect[2], [fromRect[2][0], toRect[3][1]], toRect[3]];
      } else if (!obstructs[0]) {
        return [fromRect[1], [toRectFold[3][0], fromRect[1][1]], toRectFold[3], toRect[3]];
      } else if (!obstructs[1]) {
        return [fromRect[2], fromRectFold[2], [toRect[0][0], fromRectFold[2][1]], toRect[0]];
      } else if (!obstructs[2]) {
        return [fromRect[1], fromRectFold[1], [fromRectFold[1][0], toRect[3][1]], toRect[3]];
      } else if (!obstructs[3]) {
        return [fromRect[2], [fromRect[2][0], toRectFold[0][1]], toRectFold[0], toRect[0]];
      } else {
        return [fromRect[2], fromRectFold[2], [toRectFold[3][0], fromRectFold[2][1]], toRectFold[3], toRect[3]];
      }
    }
    if (type === 'right,top') {
      if (!obstructs[0] && !obstructs[3]) {
        return [fromRect[0], [fromRect[0][0], toRect[3][1]], toRect[3]];
      } else if (!obstructs[1] && !obstructs[2]) {
        return [fromRect[1], [toRect[2][0], fromRect[1][1]], toRect[2]];
      } else if (!obstructs[0]) {
        return [fromRect[1], fromRectFold[1], [fromRectFold[1][0], toRect[3][1]], toRect[3]];
      } else if (!obstructs[1]) {
        return [fromRect[0], fromRectFold[0], [toRect[2][0], fromRectFold[0][1]], toRect[2]];
      } else if (!obstructs[2]) {
        return [fromRect[1], [toRectFold[3][0], fromRect[1][1]], toRectFold[3], toRect[3]];
      } else if (!obstructs[3]) {
        return [fromRect[0], [fromRect[0][0], toRectFold[2][1]], toRectFold[2], toRect[2]];
      } else {
        return [fromRect[1], fromRectFold[1], [fromRectFold[1][0], toRectFold[2][1]], toRectFold[2], toRect[2]];
      }
    }
    if (type === 'left,bottom') {
      if (!obstructs[0] && !obstructs[3]) {
        return [fromRect[3], [toRect[0][0], fromRect[3][1]], toRect[0]];
      } else if (!obstructs[1] && !obstructs[2]) {
        return [fromRect[2], [fromRect[2][0], toRect[1][1]], toRect[1]];
      } else if (!obstructs[0]) {
        return [fromRect[3], [toRectFold[1][0], fromRect[3][1]], toRectFold[1], toRect[1]];
      } else if (!obstructs[1]) {
        return [fromRect[2], [fromRect[2][0], toRectFold[0][1]], toRectFold[0], toRect[0]];
      } else if (!obstructs[2]) {
        return [fromRect[3], fromRect[3], [fromRect[3][0], toRect[1][1]], toRect[1]];
      } else if (!obstructs[3]) {
        return [fromRect[2], fromRectFold[2], [toRect[0][0], fromRectFold[2][1]], toRect[0]];
      } else {
        return [fromRect[3], fromRectFold[3], [fromRectFold[3][0], toRectFold[0][1]], toRectFold[0], toRect[0]];
      }
    }
    return [];
  }

  const posString = position.join(',');

  // 位置
  return getPoints(posString);
}
// 获取两个点的路线上是否有阻隔
function getObstructs(fromNode: DNode, toNode: DNode, nodeTable: any[][]) {
  const fromRowCol = [fromNode.level, fromNode.col];
  const toRowCol = [toNode.level, toNode.col];
  const startRow = Math.min(fromRowCol[0], toRowCol[0]);
  const endRow = Math.max(fromRowCol[0], toRowCol[0]);
  const startCol = Math.min(fromRowCol[1], toRowCol[1]);
  const endCol = Math.max(fromRowCol[1], toRowCol[1]);

  const middleNodes = nodeTable.slice(startRow, endRow + 1).map((item: any[]) => {
    return item.slice(startCol, endCol + 1);
  });

  const topLst = middleNodes[0]
                  .slice(1, middleNodes[0].length - 1)
                  .filter((item: any) => (!!item && item !== toNode && item !== fromNode));
  const rightList = middleNodes
                      .map((row: any[]) => row[row.length - 1])
                      .slice()
                      .filter((item: any) => (!!item && item !== toNode && item !== fromNode));
  const bottomList = middleNodes[middleNodes.length - 1]
                      .slice(1, middleNodes[0].length - 1)
                      .filter((item: any) => (!!item && item !== toNode && item !== fromNode));
  const leftList = middleNodes
                      .map((row: any[]) => row[0])
                      .slice()
                      .filter((item: any) => (!!item && item !== toNode && item !== fromNode));

  const obstructs = [
    Boolean(topLst.length),
    Boolean(rightList.length),
    Boolean(bottomList.length),
    Boolean(leftList.length),
  ];

  return obstructs;
}

function getLIneStyle(fromNode: DNode, points: PositionXY[], lineItem: LineItem) {
  const fromRect: PositionXY[] = [
    [fromNode.levelX, fromNode.levelY - fromNode.vmRect.height / 2],
    [fromNode.levelX + fromNode.vmRect.width / 2, fromNode.levelY],
    [fromNode.levelX, fromNode.levelY + fromNode.vmRect.height / 2],
    [fromNode.levelX - fromNode.vmRect.width / 2, fromNode.levelY],
  ];

  let lineIndex = 0;
  fromRect.forEach((item: PositionXY, index: number) => {
    if (item.join(',') === points[0].join(',')) {
      lineIndex = index;
    }
  });

  const lineColor = LINECOLOR[fromNode.lineCounts[lineIndex] % LINECOLOR.length];

  // 根据points计算文字的位置信息
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const initStart = 5;
  const offset = 14;
  const position = [initStart, initStart];
  if (firstPoint[0] > lastPoint[0] && firstPoint[1] > lastPoint[1]) {
    position[0] = firstPoint[0] - lastPoint[0] - initStart;
    position[1] = firstPoint[1] - lastPoint[1] - initStart;
  } else if (firstPoint[0] > lastPoint[0]) {
    position[0] = firstPoint[0] - lastPoint[0] - initStart;
  } else if (firstPoint[1] > lastPoint[1]) {
    position[1] = firstPoint[1] - lastPoint[1] - initStart;
  }
  if (lineIndex === 0) {
    position[1] -= fromNode.lineCounts[lineIndex] * offset;
  } else {
    position[1] += fromNode.lineCounts[lineIndex] * offset;
  }

  fromNode.lineCounts[lineIndex]++;

  return {
    text: lineItem.text,
    stroke: lineColor,
    textFill: lineColor,
    color: lineColor,
    textPosition: position,
  };
}

function normalDrawLine(fromNode: DNode, lineItem: LineItem, nodeTable: any[][]): any {
  const toNode = lineItem.lineNode;
  const obstructs = getObstructs(fromNode, toNode, nodeTable);
  const points = getPointList(fromNode, toNode, obstructs);
  const style = getLIneStyle(fromNode, points, lineItem);
  return drawLine(points, style);
}

export default function DrawLine(nodeTable: any[][], zr: any) {
  nodeTable.forEach((rows: any[]) => {
    rows.forEach((node: DNode | void) => {
      if (node && node.toLines && node.toLines.length) {
        node.toLines.forEach((lineItem: LineItem) => {
          const line = normalDrawLine(node, lineItem, nodeTable);
          if (line) {
            zr.add(line);
          }
        });
      }
    });
  });
}
