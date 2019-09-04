import zrender from 'zrender';
import draw from './utils/draw';
import { StatusColor } from './vars/vars';
import { Status } from './ts/types';
import { StatusStep, JudgmentStep, ProcessStep, SwitchStep, Step } from './step/step';
import { DNode } from './ts/types';
import DrawLine from './utils/line';

export default class FlowChart {
  public zr!: any;
  public $dNode!: DNode;
  public nodeTable: any[][] = [];
  public whInfo: any = {};
  constructor(el: Element) {
    this.zr = zrender.init(el);
  }
  public status(text: string, type: Status = 'normal'): StatusStep {
    const circle = draw.drawStatus(text, StatusColor[type]);
    const element = new StatusStep('status', circle, this);
    return element;
  }
  public judgment(text: string): JudgmentStep {
    const Polyline = draw.drawJudgment(text);
    const element = new JudgmentStep('judgment', Polyline, this);
    return element;
  }
  public process(text: string): ProcessStep {
    const square = draw.drawProcess(text);
    const element = new ProcessStep('process', square, this);
    return element;
  }
  public switch(text: string): SwitchStep {
    const Polyline = draw.drawSwitch(text);
    const element = new SwitchStep('switch', Polyline, this);
    return element;
  }
  public draw(step: Step) {
    if (step.isInit) {
      throw Error('step is inited');
    }
    this.nodeTable = [];
    this.zr.clear();

    this.$dNode = step.chainInit() as DNode;

    // 根据dNode逐层计算所占位置
    const node = this.$dNode;

    // draw的同时计算位置信息
    const nodeTable = this.nodeTable;
    const whInfo = this.whInfo;
    function StartDraw(pItem: DNode) {
      pItem.$vm.draw(pItem);
      pItem.children.forEach((item: DNode) => {
        item.levelY = pItem.levelY + (pItem.levelHeight / 2) + (item.levelHeight / 2);

        if (pItem.col === item.col) {
          item.levelX = pItem.levelX;
        } else {
          const middleCols = nodeTable[item.level].slice(pItem.col + 1, item.col);
          const widthSum = middleCols.reduce((value: number, mNode: any, index: number) => {
            return whInfo[`col${pItem.col + 1 + index}`] + value;
          }, 0);
          item.levelX = pItem.levelX + (pItem.levelWidth / 2) + (item.levelWidth / 2) + widthSum;
        }

        StartDraw(item);
      });
    }

    node.levelX = (this.zr.getWidth() - node.levelWidth) / 2 - (node.levelWidth / 2);
    node.levelY = node.levelHeight / 2;
    StartDraw(node);

    // 画线
    DrawLine(nodeTable, this.zr);
    console.log(nodeTable);
  }
}
