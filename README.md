# zflowchart
flowchart base on [ZRender](https://ecomfe.github.io/zrender-doc/public/).

``` node
  npm install zflowchart
```

## example
``` typeScript
import FlowChart from 'zflowchart';

const fc = new FlowChart(document.getElementById('flowchart'));
const middle0 = fc.process('先搞点事情');
const start = fc.status('开始', 'success');
const process1 = fc.judgment('是否验证通过?');
const middle1 = fc.process('我很高\n我很高\n我很高\n我很高\n我很高');
const process2 = fc.judgment('是否结束?');
const process3 = fc.judgment('验证三');
const process4 = fc.judgment('验证四');
const end = fc.status('结束', 'error');
const middle2 = fc.process('我很胖,我很胖,我很胖,我很胖,我很胖,我很胖');
const process5 = fc.judgment('这里再判断一下?');
const status1 = fc.status('状态1');
const middle3 = fc.process('操作3');

start.next(middle0);
middle0.next(process1);
process1.logicTrue(middle1);
process1.logicFalse(process3);
process3.logicTrue(process4);
process3.logicFalse(status1);
process4.logicTrue(middle3);
process4.logicFalse(status1);
middle3.next(status1);
middle1.next(process2);
process2.logicTrue(end);
process2.logicFalse(middle2);
middle2.next(process5);
process5.logicTrue(end);
process5.logicFalse(process1);

fc.draw(start);
```

