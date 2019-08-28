export interface PositionXY {
  0: number;
  1: number;
  length: 2;
  join: any;
}

export type Status = 'normal' | 'success' | 'warning' | 'error' | 'disabled';

export interface DrawPos {
  x: number;
  y: number;
  width: number;
  height: number;
  halfHeight: number;
  halfWidth: number;
  top: PositionXY;
  right: PositionXY;
  bottom: PositionXY;
  left: PositionXY;
}

export interface LineItem {
  lineNode: DNode;
  lineTYpe: string;
  text?: string;
}

export interface DNode {
  // 盒子层级，同层级高度一样，父层级宽度等于子层级宽度总和
  level: number;
  col: number;
  weight: number;
  // 层级盒子的宽度和高度
  levelWidth: number;
  levelHeight: number;
  // 层级盒子中间点的坐标，在draw阶段初始化
  levelX: number;
  levelY: number;
  vmRect: any;
  $vm: any;
  $parent?: DNode | null;
  children: DNode[];
  // 连线
  toLines?: LineItem[];
  // 上右下左 连线次数
  lineCounts: number[];
}
