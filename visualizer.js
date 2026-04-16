// visualizer.js — renders algorithm visualizations

const Visualizer = (() => {

  function render(type, area) {
    area.innerHTML = '';
    switch (type) {
      case 'greedy-activity': return renderActivitySelection(area);
      case 'bfs-grid': return renderBFSGrid(area);
      case 'bfs-tree': return renderBFSTree(area);
      case 'dfs-islands': return renderDFSIslands(area);
      case 'dp-lcs': return renderDPTable(area);
      case 'bst-validate': return renderBST(area);
      case 'merge-sort': return renderMergeSort(area);
      case 'binary-search': return renderBinarySearch(area);
      case 'coins': return renderCoins(area);
      default:
        area.innerHTML = '<p style="color:var(--text3);font-size:12px;padding:8px">No visualizer for this problem yet.</p>';
    }
  }

  // ---- ACTIVITY SELECTION ----
  function renderActivitySelection(area) {
    const activities = [
      {start:1,end:4},{start:3,end:5},{start:0,end:6},
      {start:5,end:7},{start:3,end:9},{start:5,end:9},
      {start:6,end:10},{start:8,end:11},{start:8,end:12},{start:2,end:14}
    ];
    const sorted = [...activities].sort((a,b)=>a.end-b.end);
    const selected = [];
    let lastEnd = -Infinity;
    for (const a of sorted) {
      if (a.start >= lastEnd) { selected.push(a); lastEnd = a.end; }
    }

    const maxT = 15;
    const W = area.clientWidth || 300;
    const scale = (W - 60) / maxT;

    area.innerHTML = `<div class="viz-title">Activity Timeline</div>`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${W} ${(sorted.length+1)*22+30}`);
    svg.style.width = '100%';

    // time axis
    for (let t=0;t<=maxT;t++) {
      const x = 50+t*scale;
      const tick = document.createElementNS('http://www.w3.org/2000/svg','text');
      tick.setAttribute('x',x); tick.setAttribute('y',18);
      tick.setAttribute('font-size','9'); tick.setAttribute('fill','var(--text3)');
      tick.setAttribute('text-anchor','middle'); tick.textContent = t;
      svg.appendChild(tick);
    }

    sorted.forEach((act,i) => {
      const isSel = selected.includes(act);
      const y = 28 + i*22;
      const x1 = 50+act.start*scale, x2 = 50+act.end*scale;
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x',x1); rect.setAttribute('y',y);
      rect.setAttribute('width',x2-x1); rect.setAttribute('height',16);
      rect.setAttribute('rx','3');
      rect.setAttribute('fill', isSel ? 'var(--green)' : 'var(--bg3)');
      rect.setAttribute('stroke', isSel ? 'var(--green)' : 'var(--border2)');
      rect.setAttribute('stroke-width','1');
      rect.style.opacity = isSel ? '1' : '0.5';
      svg.appendChild(rect);

      const label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x',(x1+x2)/2); label.setAttribute('y',y+11);
      label.setAttribute('font-size','9'); label.setAttribute('text-anchor','middle');
      label.setAttribute('fill', isSel ? '#000' : 'var(--text3)');
      label.textContent = `${act.start}-${act.end}`;
      svg.appendChild(label);
    });

    area.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.cssText='display:flex;gap:12px;margin-top:6px;font-size:11px;color:var(--text3)';
    legend.innerHTML=`<span style="color:var(--green)">■</span> Selected &nbsp;<span style="color:var(--border2)">■</span> Rejected`;
    area.appendChild(legend);
  }

  // ---- BFS GRID ----
  function renderBFSGrid(area) {
    const grid = [[0,0,1,0],[1,0,1,0],[1,0,0,0],[0,0,1,0]];
    const path = [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3]];
    const pathSet = new Set(path.map(([r,c])=>`${r},${c}`));

    area.innerHTML = `<div class="viz-title">BFS Shortest Path (7 steps)</div>`;
    const wrap = document.createElement('div');
    wrap.style.cssText='display:inline-grid;gap:3px;grid-template-columns:repeat(4,34px)';

    for (let r=0;r<4;r++) {
      for (let c=0;c<4;c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const key = `${r},${c}`;
        if (grid[r][c]===1) cell.classList.add('wall');
        else if (key==='0,0') { cell.classList.add('start'); cell.textContent='S'; }
        else if (key==='3,3') { cell.classList.add('end'); cell.textContent='E'; }
        else if (pathSet.has(key)) { cell.classList.add('path'); cell.textContent='·'; }
        area.appendChild ? null : null;
        wrap.appendChild(cell);
      }
    }
    area.appendChild(wrap);

    const legend = document.createElement('div');
    legend.style.cssText='margin-top:10px;font-size:10px;color:var(--text3);display:flex;gap:10px;flex-wrap:wrap';
    legend.innerHTML=`<span style="color:var(--amber)">S</span> Start &nbsp;<span style="color:var(--red)">E</span> End &nbsp;<span style="color:var(--green)">·</span> Path &nbsp;■ Wall`;
    area.appendChild(legend);
  }

  // ---- BFS TREE ----
  function renderBFSTree(area) {
    area.innerHTML = `<div class="viz-title">Level-order traversal</div>`;
    const W = area.clientWidth || 300;
    const nodes = [
      {val:1,x:W/2,y:30,level:0},
      {val:2,x:W/3,y:90,level:1},{val:3,x:2*W/3,y:90,level:1},
      {val:4,x:W/6,y:150,level:2},{val:5,x:W/2.5,y:150,level:2},
      {val:6,x:W/1.7,y:150,level:2},{val:7,x:5*W/6,y:150,level:2},
    ];
    const edges=[[[W/2,30],[W/3,90]],[[W/2,30],[2*W/3,90]],
                 [[W/3,90],[W/6,150]],[[W/3,90],[W/2.5,150]],
                 [[2*W/3,90],[W/1.7,150]],[[2*W/3,90],[5*W/6,150]]];
    const colors=['var(--amber)','var(--accent)','var(--accent)','var(--green)','var(--green)','var(--green)','var(--green)'];

    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${W} 190`);
    svg.style.width='100%';

    edges.forEach(([[x1,y1],[x2,y2]])=>{
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',x1);line.setAttribute('y1',y1);
      line.setAttribute('x2',x2);line.setAttribute('y2',y2);
      line.setAttribute('stroke','var(--border2)');line.setAttribute('stroke-width','1.5');
      svg.appendChild(line);
    });

    nodes.forEach((n,i)=>{
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',n.x);circle.setAttribute('cy',n.y);circle.setAttribute('r','15');
      circle.setAttribute('fill','var(--bg3)');circle.setAttribute('stroke',colors[i]);circle.setAttribute('stroke-width','2');
      const text = document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('x',n.x);text.setAttribute('y',n.y+5);
      text.setAttribute('text-anchor','middle');text.setAttribute('font-size','13');
      text.setAttribute('fill','var(--text)');text.setAttribute('font-family','var(--font-mono)');
      text.textContent=n.val;
      g.appendChild(circle);g.appendChild(text);
      svg.appendChild(g);
    });
    area.appendChild(svg);

    const info = document.createElement('div');
    info.style.cssText='font-size:11px;color:var(--text3);margin-top:4px';
    info.innerHTML = `<span style="color:var(--amber)">■</span> L0: [1] &nbsp;<span style="color:var(--accent)">■</span> L1: [2,3] &nbsp;<span style="color:var(--green)">■</span> L2: [4,5,6,7]`;
    area.appendChild(info);
  }

  // ---- DFS ISLANDS ----
  function renderDFSIslands(area) {
    const grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];
    const islandColors = ['var(--accent)','var(--green)','var(--amber)'];
    const colorGrid = Array.from({length:4},()=>new Array(5).fill(-1));
    let islandId = 0;

    function dfsColor(r,c,id,g) {
      if (r<0||r>=4||c<0||c>=5||g[r][c]!=='1'||colorGrid[r][c]!==-1) return;
      colorGrid[r][c]=id;
      dfsColor(r+1,c,id,g);dfsColor(r-1,c,id,g);
      dfsColor(r,c+1,id,g);dfsColor(r,c-1,id,g);
    }

    const tempGrid = grid.map(r=>[...r]);
    for (let r=0;r<4;r++) for (let c=0;c<5;c++)
      if (colorGrid[r][c]===-1 && tempGrid[r][c]==='1') { dfsColor(r,c,islandId++,tempGrid); }

    area.innerHTML=`<div class="viz-title">DFS Island Coloring — 3 islands found</div>`;
    const wrap = document.createElement('div');
    wrap.style.cssText='display:inline-grid;gap:3px;grid-template-columns:repeat(5,30px)';

    for (let r=0;r<4;r++) for (let c=0;c<5;c++) {
      const cell = document.createElement('div');
      cell.className='grid-cell';
      cell.style.width='30px';cell.style.height='30px';
      if (grid[r][c]==='1') {
        const id = colorGrid[r][c];
        cell.style.background = `color-mix(in srgb, ${islandColors[id]} 30%, var(--bg3))`;
        cell.style.borderColor = islandColors[id];
        cell.style.color = islandColors[id];
        cell.textContent = id+1;
      }
      wrap.appendChild(cell);
    }
    area.appendChild(wrap);
  }

  // ---- DP LCS TABLE ----
  function renderDPTable(area) {
    const str1 = 'ABCB', str2 = 'BCAB';
    const m=str1.length, n=str2.length;
    const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
      dp[i][j]=str1[i-1]===str2[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);

    area.innerHTML=`<div class="viz-title">LCS DP Table (ABCB vs BCAB)</div>`;
    const table = document.createElement('table');
    table.className='dp-table';

    const hrow=document.createElement('tr');
    ['','','...',...str2.split('')].forEach((ch,i)=>{
      const th=document.createElement('th'); th.textContent=ch; hrow.appendChild(th);
    });
    table.appendChild(hrow);

    for(let i=0;i<=m;i++){
      const row=document.createElement('tr');
      const rh=document.createElement('th');
      rh.textContent=i===0?'':str1[i-1]; row.appendChild(rh);
      const idx=document.createElement('th');
      idx.textContent=i; row.appendChild(idx);
      for(let j=0;j<=n;j++){
        const td=document.createElement('td');
        td.textContent=dp[i][j];
        if(dp[i][j]>0) td.classList.add('filled');
        if(i>0&&j>0&&dp[i][j]>dp[i-1][j-1]&&str1[i-1]===str2[j-1]) td.classList.add('current');
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    area.appendChild(table);
    const note=document.createElement('div');
    note.style.cssText='font-size:10px;color:var(--text3);margin-top:6px';
    note.textContent=`LCS = ${dp[m][n]} characters`;
    area.appendChild(note);
  }

  // ---- BST ----
  function renderBST(area) {
    area.innerHTML=`<div class="viz-title">Valid BST — bounds propagate down</div>`;
    const W=area.clientWidth||300;
    const nodes=[
      {val:5,x:W/2,y:30,min:'-∞',max:'∞',ok:true},
      {val:3,x:W/3,y:90,min:'-∞',max:'5',ok:true},
      {val:8,x:2*W/3,y:90,min:'5',max:'∞',ok:true},
      {val:1,x:W/6,y:150,min:'-∞',max:'3',ok:true},
      {val:4,x:W/2.5,y:150,min:'3',max:'5',ok:true},
      {val:7,x:W/1.7,y:150,min:'5',max:'8',ok:true},
      {val:9,x:5*W/6,y:150,min:'8',max:'∞',ok:true},
    ];
    const edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
    const idxs=nodes;

    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${W} 195`); svg.style.width='100%';

    edges.forEach(([a,b])=>{
      const l=document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1',idxs[a].x);l.setAttribute('y1',idxs[a].y);
      l.setAttribute('x2',idxs[b].x);l.setAttribute('y2',idxs[b].y);
      l.setAttribute('stroke','var(--border2)');l.setAttribute('stroke-width','1.5');
      svg.appendChild(l);
    });

    nodes.forEach(n=>{
      const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',n.x);circle.setAttribute('cy',n.y);circle.setAttribute('r','16');
      circle.setAttribute('fill','var(--bg3)');circle.setAttribute('stroke','var(--green)');circle.setAttribute('stroke-width','2');
      const text=document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('x',n.x);text.setAttribute('y',n.y+5);
      text.setAttribute('text-anchor','middle');text.setAttribute('font-size','13');
      text.setAttribute('fill','var(--text)');text.setAttribute('font-family','var(--font-mono)');
      text.textContent=n.val;
      const bound=document.createElementNS('http://www.w3.org/2000/svg','text');
      bound.setAttribute('x',n.x);bound.setAttribute('y',n.y+30);
      bound.setAttribute('text-anchor','middle');bound.setAttribute('font-size','8');
      bound.setAttribute('fill','var(--text3)');
      bound.textContent=`(${n.min},${n.max})`;
      svg.appendChild(circle);svg.appendChild(text);svg.appendChild(bound);
    });
    area.appendChild(svg);
  }

  // ---- MERGE SORT ----
  function renderMergeSort(area) {
    const arr=[38,27,43,3,9,82,10];
    area.innerHTML=`<div class="viz-title">Merge sort visualization</div>`;

    const stages=[
      {label:'Original', data:[38,27,43,3,9,82,10]},
      {label:'Split L1', data:[38,27,43]},
      {label:'Split L2', data:[38]},
      {label:'Merge', data:[27,38,43]},
      {label:'Merge all', data:[3,9,10,27,38,43,82]},
    ];

    const maxVal=Math.max(...arr);
    stages.forEach(stage=>{
      const label=document.createElement('div');
      label.style.cssText='font-size:10px;color:var(--text3);margin-top:10px;margin-bottom:4px';
      label.textContent=stage.label;
      area.appendChild(label);

      const bars=document.createElement('div');
      bars.className='bar-chart';
      bars.style.height='70px';
      stage.data.forEach((v,i)=>{
        const bar=document.createElement('div');
        bar.className='bar';
        bar.style.height=`${(v/maxVal)*65}px`;
        const lbl=document.createElement('span');
        lbl.className='bar-label'; lbl.textContent=v;
        bar.appendChild(lbl);
        if(stage.label==='Merge all') bar.classList.add('active');
        bars.appendChild(bar);
      });
      area.appendChild(bars);
    });
  }

  // ---- BINARY SEARCH ----
  function renderBinarySearch(area) {
    const arr=[2,5,8,12,16,23,38,56,72,91];
    const target=23;
    const steps=[];
    let lo=0,hi=arr.length-1;
    while(lo<=hi){
      const mid=Math.floor((lo+hi)/2);
      steps.push({lo,mid,hi,val:arr[mid]});
      if(arr[mid]===target) break;
      else if(arr[mid]<target) lo=mid+1;
      else hi=mid-1;
    }

    let step=0;

    function draw() {
      area.innerHTML=`<div class="viz-title">Binary search for ${target}</div>`;
      const s=steps[step];
      const row=document.createElement('div');
      row.style.cssText='display:flex;gap:3px;flex-wrap:wrap;margin:8px 0';

      arr.forEach((v,i)=>{
        const cell=document.createElement('div');
        cell.style.cssText=`width:28px;height:28px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;border:1px solid var(--border);transition:all 0.2s`;
        if(i<s.lo||i>s.hi){cell.style.opacity='0.3';cell.style.background='var(--bg3)';}
        else if(i===s.mid){cell.style.background=(v===target?'var(--green)':'var(--amber)');cell.style.color='#000';cell.style.borderColor=(v===target?'var(--green)':'var(--amber)');}
        else{cell.style.background='var(--bg3)';cell.style.color='var(--text2)';}
        cell.textContent=v;
        row.appendChild(cell);
      });
      area.appendChild(row);

      const info=document.createElement('div');
      info.style.cssText='font-size:11px;color:var(--text3);margin-bottom:8px';
      info.innerHTML=`Step ${step+1}/${steps.length} &nbsp;·&nbsp; lo=${s.lo} mid=<span style="color:var(--amber)">${s.mid}</span> hi=${s.hi} &nbsp;·&nbsp; arr[${s.mid}]=${s.val} ${s.val===target?'✓ found!':s.val<target?'< target, go right':'> target, go left'}`;
      area.appendChild(info);

      const ctrl=document.createElement('div');
      ctrl.className='step-controls';
      const prev=document.createElement('button');prev.className='step-btn';prev.textContent='← Prev';
      prev.onclick=()=>{if(step>0){step--;draw();}};
      const next=document.createElement('button');next.className='step-btn';next.textContent='Next →';
      next.onclick=()=>{if(step<steps.length-1){step++;draw();}};
      ctrl.appendChild(prev);ctrl.appendChild(next);
      area.appendChild(ctrl);
    }
    draw();
  }

  // ---- COINS ----
  function renderCoins(area) {
    const coins=[25,10,5,1];
    const amount=41;
    const result=[];
    let rem=amount;
    for(const c of coins) while(rem>=c){result.push(c);rem-=c;}

    area.innerHTML=`<div class="viz-title">Greedy: making 41¢</div>`;
    const row=document.createElement('div');
    row.style.cssText='display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px';
    result.forEach((c,i)=>{
      const coin=document.createElement('div');
      coin.style.cssText=`width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;border:2px solid`;
      const colMap={25:'var(--amber)',10:'var(--cyan)',5:'var(--green)',1:'var(--text3)'};
      coin.style.borderColor=colMap[c];
      coin.style.color=colMap[c];
      coin.style.background=`color-mix(in srgb,${colMap[c]} 12%, var(--bg3))`;
      coin.textContent=c+'¢';
      row.appendChild(coin);
      if(i<result.length-1){
        const plus=document.createElement('span');
        plus.style.cssText='font-size:12px;color:var(--text3)';plus.textContent='+';
        row.appendChild(plus);
      }
    });
    area.appendChild(row);
    const total=document.createElement('div');
    total.style.cssText='margin-top:8px;font-size:11px;color:var(--green)';
    total.textContent=`= ${amount}¢ using ${result.length} coins`;
    area.appendChild(total);
  }

  return { render };
})();
