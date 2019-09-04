import { DNode } from '../ts/types';
import ZFC from '../index';

export class Step {
  public type!: string;
  public zrVm!: any;
  public $zfc: ZFC;
  public isInit = false;
  public sdNode!: DNode;
  public rectLines = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  constructor(type: string, zrVm: any, zfc: ZFC) {
    this.type = type;
    this.zrVm = zrVm;
    this.$zfc = zfc;
  }
  public draw(node: DNode): void {
    return undefined;
  }
  public chainInit($parent?: DNode): DNode | null {
    if (this.isInit) {
      return null;
    }
    this.isInit = true;

    const node: DNode = {
      level: 0,
      col: 0,
      weight: 0,
      levelWidth: 0,
      levelHeight: 0,
      levelX: 0,
      levelY: 0,
      vmRect: this.zrVm.getBoundingRect(),
      $vm: this,
      $parent: null,
      children: [],
      toLines: [],
      lineCounts: [0, 0, 0, 0],
    };
    this.sdNode = node;

    if ($parent) {
      node.$parent = $parent;
      node.level = $parent.level + 1;
    }
    // 构建渲染行
    if (!this.$zfc.nodeTable[node.level]) {
      this.$zfc.nodeTable[node.level] = [];
    }
    const levels = this.$zfc.nodeTable[node.level];
    levels.push(node);

    // 初始化子节点
    this.childrenInit(node.children, node);

    if (node.children.length) {
      node.weight = node.children.reduce((value: number, item: DNode) => {
        return value += item.weight;
      }, 0);
    } else {
      node.weight = 1;
    }
    // 最后重置 nodeTable 为一个n * m的矩阵
    if (!$parent) {
      // 先根据权重重置col
      function setCols(colNode: DNode, colNum: number) {
        colNode.col = colNum;
        let addNum: number = colNum;
        colNode.children.forEach((ccolNode: DNode, ccIndex: number) => {
          setCols(ccolNode, addNum);
          addNum += ccolNode.weight;
        });
      }
      setCols(node, 0);
      // 生成n * m的矩阵
      const cpTable = this.$zfc.nodeTable.slice();
      this.$zfc.nodeTable = [];
      const rowLength = cpTable.length;
      const collength = Math.max(...cpTable.map((item: any[]) => {
        return Math.max(...item.map((cItem: any) => cItem.col + 1));
      }));
      this.$zfc.nodeTable = Array.from({length: rowLength}).map(() => Array.from({length: collength}));

      cpTable.forEach((level1: DNode[], index1: number) => {
        level1.forEach((level2: DNode) => {
          this.$zfc.nodeTable[index1][level2.col] = level2;
        });
      });
      // 拿到一个n * m的矩阵后，设置各个node的高和宽
      const nodeTable = this.$zfc.nodeTable;
      const whInfo = this.$zfc.whInfo;
      // 设置层高
      function SetHeight() {
        nodeTable.forEach((tree: DNode[], index: number) => {
          const maxHeight = Math.max(...tree.map((item: DNode) => (item ? item.vmRect.height + 30 : 0)));
          whInfo[`row${index}`] = maxHeight;
          tree.forEach((item: DNode) => {
            if (item) {
              item.levelHeight = maxHeight;
            }
          });
        });
      }
      SetHeight();

      // 设置列宽
      function SetWidth() {
        for (let i = 0; i < collength; i++) {
          const cols = nodeTable.map((row: any[]) => row[i]);
          const maxWidth = Math.max(...cols.map((item: DNode) => (item ? item.vmRect.width + 30 : 0)));
          whInfo[`col${i}`] = maxWidth;
          cols.forEach((item: DNode) => {
            if (item) {
              item.levelWidth = maxWidth;
            }
          });
        }
      }
      SetWidth();
    }

    return node;
  }
  public childrenInit(children: DNode[], parent: DNode): void {
    return undefined;
  }
}

export class StatusStep extends Step {
  private nextVm!: Step;
  constructor(type: string, vm: any, zfc: any) {
    super(type, vm, zfc);
  }
  public next(nextVm: Step) {
    this.nextVm = nextVm;
  }
  public childrenInit(children: DNode[], parent: DNode) {
    if (this.nextVm) {
      let cNode = this.nextVm.chainInit(parent);
      if (cNode) {
        children.push(cNode);
      } else {
        cNode = this.nextVm.sdNode;
      }

      parent.toLines = [{
        lineNode: cNode,
        lineType: 'main',
      }];
    }
  }
  public draw(node: DNode) {
    const x = node.levelX;
    const y = node.levelY;
    this.zrVm.attr('position', [x, y]);
    this.$zfc.zr.add(this.zrVm);
  }
}

export class JudgmentStep extends Step {
  public trueText: string = '是';
  public falseText: string = '否';
  private trueVm!: Step;
  private falseVm!: Step;
  constructor(type: string, vm: any, zfc: any) {
    super(type, vm, zfc);
  }
  public setText(textList: string[]) {
    this.trueText = textList[0];
    this.falseText = textList[1];
  }
  public logicTrue(trueVm: Step) {
    this.trueVm = trueVm;
  }
  public logicFalse(falseVm: Step) {
    this.falseVm = falseVm;
  }
  public childrenInit(children: DNode[], parent: DNode) {
    parent.toLines = [];
    if (this.trueVm) {
      let cNode = this.trueVm.chainInit(parent);
      if (cNode) {
        children.push(cNode);
      } else {
        cNode = this.trueVm.sdNode;
      }

      parent.toLines.push({
        lineNode: cNode,
        lineType: 'main',
        text: this.trueText,
      });
    }
    if (this.falseVm) {
      let cNode = this.falseVm.chainInit(parent);
      if (cNode) {
        children.push(cNode);
      } else {
        cNode = this.falseVm.sdNode;
      }

      parent.toLines.push({
        lineNode: cNode,
        lineType: 'minor',
        text: this.falseText,
      });
    }
  }
  public draw(node: DNode) {
    const x = node.levelX;
    const y = node.levelY;
    const width = node.vmRect.width;
    const height = node.vmRect.height;

    const points = [
      [x, y - height / 2],
      [x + width / 2, y],
      [x, y + height / 2],
      [x - width / 2, y],
      [x, y - height / 2],
    ];

    this.zrVm.attr({
      shape: {
        points,
      },
    });

    this.$zfc.zr.add(this.zrVm);
  }
}

export class ProcessStep extends Step {
  private nextVm!: Step;
  constructor(type: string, vm: any, zfc: any) {
    super(type, vm, zfc);
  }
  public next(nextVm: Step) {
    this.nextVm = nextVm;
  }
  public childrenInit(children: DNode[], parent: DNode) {
    if (this.nextVm) {
      let cNode = this.nextVm.chainInit(parent);
      if (cNode) {
        children.push(cNode);
      } else {
        cNode = this.nextVm.sdNode;
      }

      parent.toLines = [{
        lineType: 'main',
        lineNode: cNode,
      }];
    }
  }
  public draw(node: DNode) {
    const x = node.levelX - node.vmRect.width / 2;
    const y = node.levelY - node.vmRect.height / 2;
    this.zrVm.attr({
      shape: {
        x,
        y,
      },
    });
    this.$zfc.zr.add(this.zrVm);
  }
}

export class SwitchStep extends Step {
  private caseList: Step[] = [];
  constructor(type: string, vm: any, zfc: any) {
    super(type, vm, zfc);
  }
  public pushCase(sCase: Step) {
    this.caseList.push(sCase);
  }
  public childrenInit(children: DNode[], parent: DNode) {
    parent.toLines = [];
    this.caseList.forEach((item: Step) => {
      let cNode = item.chainInit(parent);
      if (cNode) {
        children.push(cNode);
      } else {
        cNode = item.sdNode;
      }

      parent.toLines.push({
        lineNode: cNode,
        lineType: 'main',
      });
    });
  }
  public draw(node: DNode) {
    const x = node.levelX;
    const y = node.levelY;
    const width = node.vmRect.width;
    const height = node.vmRect.height;

    const points = [
      [x - width / 2, y],
      [x - width / 2 + 10, y - height / 2],
      [x + width / 2 - 10, y - height / 2],
      [x + width / 2, y],
      [x + width / 2 - 10, y + height / 2],
      [x - width / 2 + 10, y + height / 2],
      [x - width / 2, y],
    ];

    this.zrVm.attr({
      shape: {
        points,
      },
    });

    this.$zfc.zr.add(this.zrVm);
  }
}
