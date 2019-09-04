# zflowchart
flowchart base on [ZRender](https://ecomfe.github.io/zrender-doc/public/).

``` node
  npm install zflowchart
```

online [demo](https://jsfiddle.net/a1g0upnm/5/)

## example
``` typeScript
import FlowChart from 'zflowchart';

const fc = new FlowChart(document.getElementById('flowchart') as Element);
const start = fc.status('开始', 'success');
const process1 = fc.process('想出去走走');
const judgment1 = fc.judgment('是否有钱');
const judgment2 = fc.judgment('是否有假');
const process2 = fc.process('准备辞职');
const judgment3 = fc.judgment('是否裸辞');
const process3 = fc.process('哈哈哈');
const process5 = fc.process('呵呵呵');
const process6 = fc.process('666');
const judgment4 = fc.judgment('再来个判断');
const process7 = fc.process('777');
const process8 = fc.process('888');
const process4 = fc.process('走起，去哪里？');
const switch1 = fc.switch('选择目的地');
const destination1 = fc.process('欧洲');
const destination2 = fc.process('日本');
const destination3 = fc.process('西藏');
const end = fc.status('结束', 'error');

start.next(process1);
process1.next(judgment1);
judgment1.logicTrue(judgment2);
judgment1.logicFalse(end);
judgment2.logicTrue(process4);
judgment2.logicFalse(process2);
process2.next(judgment3);
process4.next(switch1);
switch1.pushCase(destination1);
switch1.pushCase(destination2);
switch1.pushCase(destination3);
destination2.next(end);
judgment3.logicTrue(process3);
judgment3.logicFalse(process5);
process5.next(process6);
process6.next(judgment4);
judgment4.logicTrue(process7);
judgment4.logicFalse(process8);

fc.draw(start);
```

