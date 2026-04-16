// problems.js — all problem definitions

const PROBLEMS = {
  greedy: [
    {
      title: "Activity Selection",
      difficulty: "Medium",
      description: "Given n activities with start and end times, select the maximum number of non-overlapping activities. This is the classic greedy scheduling problem — always pick the activity that finishes earliest.",
      sampleInput: "activities = [\n  {start:1, end:4},\n  {start:3, end:5},\n  {start:0, end:6},\n  {start:5, end:7},\n  {start:3, end:9},\n  {start:5, end:9},\n  {start:6, end:10},\n  {start:8, end:11},\n  {start:8, end:12},\n  {start:2, end:14}\n]",
      sampleOutput: "Selected: [{1,4}, {5,7}, {8,11}]\nCount: 3",
      hint: "Sort by end time first. Then greedily pick each activity whose start time >= last selected end time.",
      starterJS: `function activitySelection(activities) {
  // Sort by end time (greedy choice!)
  activities.sort((a, b) => a.end - b.end);

  const selected = [];
  let lastEnd = -Infinity;

  for (const act of activities) {
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
    }
  }

  return selected;
}

// Test it:
const activities = [
  {start:1,end:4},{start:3,end:5},{start:0,end:6},
  {start:5,end:7},{start:3,end:9},{start:5,end:9},
  {start:6,end:10},{start:8,end:11},{start:8,end:12},{start:2,end:14}
];

const result = activitySelection(activities);
console.log("Selected activities:", result.length);
result.forEach(a => console.log(\`  {start:\${a.start}, end:\${a.end}}\`));
`,
      solutionJS: `function activitySelection(activities) {
  activities.sort((a, b) => a.end - b.end);
  const selected = [];
  let lastEnd = -Infinity;
  for (const act of activities) {
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
    }
  }
  return selected;
}
const activities = [{start:1,end:4},{start:3,end:5},{start:0,end:6},{start:5,end:7},{start:3,end:9},{start:5,end:9},{start:6,end:10},{start:8,end:11},{start:8,end:12},{start:2,end:14}];
const result = activitySelection(activities);
console.log("Selected activities:", result.length);
result.forEach(a => console.log(\`  {start:\${a.start}, end:\${a.end}}\`));`,
      starterPY: `def activity_selection(activities):
    # Sort by end time (greedy choice!)
    activities.sort(key=lambda x: x['end'])
    
    selected = []
    last_end = float('-inf')
    
    for act in activities:
        if act['start'] >= last_end:
            selected.append(act)
            last_end = act['end']
    
    return selected

# Test it:
activities = [
    {'start':1,'end':4},{'start':3,'end':5},{'start':0,'end':6},
    {'start':5,'end':7},{'start':3,'end':9},{'start':5,'end':9},
    {'start':6,'end':10},{'start':8,'end':11},{'start':8,'end':12},{'start':2,'end':14}
]

result = activity_selection(activities)
print(f"Selected activities: {len(result)}")
for a in result:
    print(f"  {{start:{a['start']}, end:{a['end']}}}")
`,
      visualizer: "greedy-activity"
    },
    {
      title: "Coin Change (Greedy)",
      difficulty: "Easy",
      description: "Given coin denominations [1, 5, 10, 25] (pennies, nickels, dimes, quarters), find the minimum number of coins to make a target amount. Use the greedy approach: always take the largest coin possible.",
      sampleInput: "coins = [25, 10, 5, 1]\namount = 41",
      sampleOutput: "25 + 10 + 5 + 1 = 41\nTotal coins: 4",
      hint: "Sort coins in descending order. Keep picking the largest coin that fits into the remaining amount.",
      starterJS: `function greedyCoinChange(coins, amount) {
  // Sort descending
  coins.sort((a, b) => b - a);
  
  const result = [];
  let remaining = amount;
  
  for (const coin of coins) {
    while (remaining >= coin) {
      result.push(coin);
      remaining -= coin;
    }
  }
  
  return remaining === 0 ? result : null;
}

const coins = [25, 10, 5, 1];
const amount = 41;
const result = greedyCoinChange(coins, amount);

if (result) {
  console.log("Coins used:", result.join(" + "), "=", amount);
  console.log("Total coins:", result.length);
} else {
  console.log("No solution found");
}
`,
      solutionJS: `function greedyCoinChange(coins, amount) {
  coins.sort((a, b) => b - a);
  const result = [];
  let remaining = amount;
  for (const coin of coins) {
    while (remaining >= coin) { result.push(coin); remaining -= coin; }
  }
  return remaining === 0 ? result : null;
}
const result = greedyCoinChange([25,10,5,1], 41);
console.log("Coins used:", result.join(" + "), "= 41");
console.log("Total coins:", result.length);`,
      starterPY: `def greedy_coin_change(coins, amount):
    coins.sort(reverse=True)
    result = []
    remaining = amount
    
    for coin in coins:
        while remaining >= coin:
            result.append(coin)
            remaining -= coin
    
    return result if remaining == 0 else None

coins = [25, 10, 5, 1]
amount = 41
result = greedy_coin_change(coins, amount)

if result:
    print("Coins used:", " + ".join(map(str, result)), "=", amount)
    print("Total coins:", len(result))
`,
      visualizer: "coins"
    },
    {
      title: "Fractional Knapsack",
      difficulty: "Medium",
      description: "You have a knapsack with capacity W. Given items with weights and values, maximize the total value. Unlike 0/1 knapsack, you can take fractions of an item. Greedy strategy: sort by value/weight ratio.",
      sampleInput: "capacity = 50\nitems = [\n  {weight:10, value:60},\n  {weight:20, value:100},\n  {weight:30, value:120}\n]",
      sampleOutput: "Take: item1(full) + item2(full) + item3(2/3)\nMax value: 240.0",
      hint: "Calculate value-per-weight ratio for each item. Sort descending. Fill the knapsack greedily.",
      starterJS: `function fractionalKnapsack(capacity, items) {
  // Calculate ratio and sort
  const sorted = items
    .map((item, i) => ({ ...item, ratio: item.value / item.weight, id: i+1 }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let remaining = capacity;
  const taken = [];

  for (const item of sorted) {
    if (remaining <= 0) break;
    
    const take = Math.min(item.weight, remaining);
    const fraction = take / item.weight;
    totalValue += fraction * item.value;
    remaining -= take;
    taken.push({ id: item.id, fraction, value: fraction * item.value });
  }

  return { totalValue, taken };
}

const items = [
  {weight:10, value:60},
  {weight:20, value:100},
  {weight:30, value:120}
];

const { totalValue, taken } = fractionalKnapsack(50, items);
taken.forEach(t => {
  console.log(\`Item \${t.id}: \${(t.fraction*100).toFixed(0)}% → value \${t.value.toFixed(1)}\`);
});
console.log("Max value:", totalValue.toFixed(1));
`,
      solutionJS: `function fractionalKnapsack(capacity, items) {
  const sorted = items.map((item,i)=>({...item,ratio:item.value/item.weight,id:i+1})).sort((a,b)=>b.ratio-a.ratio);
  let totalValue=0, remaining=capacity; const taken=[];
  for (const item of sorted) {
    if(remaining<=0) break;
    const take=Math.min(item.weight,remaining), frac=take/item.weight;
    totalValue+=frac*item.value; remaining-=take;
    taken.push({id:item.id,fraction:frac,value:frac*item.value});
  }
  return {totalValue,taken};
}
const {totalValue,taken}=fractionalKnapsack(50,[{weight:10,value:60},{weight:20,value:100},{weight:30,value:120}]);
taken.forEach(t=>console.log(\`Item \${t.id}: \${(t.fraction*100).toFixed(0)}% → value \${t.value.toFixed(1)}\`));
console.log("Max value:", totalValue.toFixed(1));`,
      starterPY: `def fractional_knapsack(capacity, items):
    # Add ratio and sort by value/weight
    sorted_items = sorted(
        enumerate(items),
        key=lambda x: x[1]['value'] / x[1]['weight'],
        reverse=True
    )
    
    total_value = 0
    remaining = capacity
    taken = []
    
    for i, item in sorted_items:
        if remaining <= 0:
            break
        take = min(item['weight'], remaining)
        fraction = take / item['weight']
        total_value += fraction * item['value']
        remaining -= take
        taken.append({'id': i+1, 'fraction': fraction, 'value': fraction * item['value']})
    
    return total_value, taken

items = [
    {'weight': 10, 'value': 60},
    {'weight': 20, 'value': 100},
    {'weight': 30, 'value': 120}
]

total_value, taken = fractional_knapsack(50, items)
for t in taken:
    print(f"Item {t['id']}: {t['fraction']*100:.0f}% → value {t['value']:.1f}")
print(f"Max value: {total_value:.1f}")
`,
      visualizer: null
    }
  ],

  bfs: [
    {
      title: "Shortest Path in Grid",
      difficulty: "Medium",
      description: "Given a 2D grid where 0 = open cell and 1 = wall, find the shortest path from the top-left (0,0) to the bottom-right corner. Use BFS — it guarantees the shortest path in unweighted graphs.",
      sampleInput: "grid = [\n  [0, 0, 1, 0],\n  [1, 0, 1, 0],\n  [1, 0, 0, 0],\n  [0, 0, 1, 0]\n]",
      sampleOutput: "Shortest path length: 7\nPath: (0,0)→(0,1)→(1,1)→(2,1)→(2,2)→(2,3)→(3,3)",
      hint: "Use a queue. Start at (0,0), enqueue neighbors. Track visited cells and parent pointers to reconstruct the path.",
      starterJS: `function bfsShortestPath(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  
  // Queue stores [row, col, path]
  const queue = [[0, 0, [[0,0]]]];
  const visited = Array.from({length:rows}, () => new Array(cols).fill(false));
  visited[0][0] = true;

  while (queue.length > 0) {
    const [r, c, path] = queue.shift();
    
    if (r === rows-1 && c === cols-1) {
      return path; // Found!
    }
    
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols 
          && !visited[nr][nc] && grid[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc, [...path, [nr, nc]]]);
      }
    }
  }
  
  return null; // No path
}

const grid = [
  [0,0,1,0],
  [1,0,1,0],
  [1,0,0,0],
  [0,0,1,0]
];

const path = bfsShortestPath(grid);
if (path) {
  console.log("Shortest path length:", path.length);
  console.log("Path:", path.map(([r,c]) => \`(\${r},\${c})\`).join("→"));
} else {
  console.log("No path found");
}
`,
      solutionJS: `function bfsShortestPath(grid) {
  const rows=grid.length, cols=grid[0].length;
  const dirs=[[0,1],[1,0],[0,-1],[-1,0]];
  const queue=[[0,0,[[0,0]]]];
  const vis=Array.from({length:rows},()=>new Array(cols).fill(false));
  vis[0][0]=true;
  while(queue.length){
    const[r,c,path]=queue.shift();
    if(r===rows-1&&c===cols-1) return path;
    for(const[dr,dc] of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&!vis[nr][nc]&&grid[nr][nc]===0){
        vis[nr][nc]=true; queue.push([nr,nc,[...path,[nr,nc]]]);
      }
    }
  }
  return null;
}
const grid=[[0,0,1,0],[1,0,1,0],[1,0,0,0],[0,0,1,0]];
const path=bfsShortestPath(grid);
if(path){console.log("Shortest path length:",path.length);console.log("Path:",path.map(([r,c])=>\`(\${r},\${c})\`).join("→"));}`,
      starterPY: `from collections import deque

def bfs_shortest_path(grid):
    rows, cols = len(grid), len(grid[0])
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    
    queue = deque([(0, 0, [(0,0)])])
    visited = [[False]*cols for _ in range(rows)]
    visited[0][0] = True
    
    while queue:
        r, c, path = queue.popleft()
        
        if r == rows-1 and c == cols-1:
            return path
        
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and not visited[nr][nc] and grid[nr][nc]==0:
                visited[nr][nc] = True
                queue.append((nr, nc, path + [(nr,nc)]))
    
    return None

grid = [
    [0,0,1,0],
    [1,0,1,0],
    [1,0,0,0],
    [0,0,1,0]
]

path = bfs_shortest_path(grid)
if path:
    print(f"Shortest path length: {len(path)}")
    print("Path:", "→".join(f"({r},{c})" for r,c in path))
else:
    print("No path found")
`,
      visualizer: "bfs-grid"
    },
    {
      title: "Level Order Traversal",
      difficulty: "Easy",
      description: "Given a binary tree, return its level-order traversal (BFS). Each level's nodes should be grouped together in the output array.",
      sampleInput: "Tree:\n      1\n    /   \\\n   2     3\n  / \\   / \\\n 4   5 6   7",
      sampleOutput: "[[1], [2,3], [4,5,6,7]]",
      hint: "Use a queue. Process nodes level by level using the queue's current size to know where each level ends.",
      starterJS: `class TreeNode {
  constructor(val, left=null, right=null) {
    this.val = val; this.left = left; this.right = right;
  }
}

function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}

// Build tree: 1 -> [2,3] -> [4,5,6,7]
const root = new TreeNode(1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, new TreeNode(6), new TreeNode(7))
);

const levels = levelOrder(root);
console.log("Level order traversal:");
levels.forEach((level, i) => console.log(\`Level \${i}: [\${level.join(", ")}]\`));
`,
      solutionJS: `class TreeNode{constructor(v,l=null,r=null){this.val=v;this.left=l;this.right=r;}}
function levelOrder(root){if(!root)return[];const result=[],queue=[root];while(queue.length){const sz=queue.length,level=[];for(let i=0;i<sz;i++){const n=queue.shift();level.push(n.val);if(n.left)queue.push(n.left);if(n.right)queue.push(n.right);}result.push(level);}return result;}
const root=new TreeNode(1,new TreeNode(2,new TreeNode(4),new TreeNode(5)),new TreeNode(3,new TreeNode(6),new TreeNode(7)));
const levels=levelOrder(root);
levels.forEach((l,i)=>console.log(\`Level \${i}: [\${l.join(", ")}]\`));`,
      starterPY: `from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        
        result.append(level)
    
    return result

root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, TreeNode(6), TreeNode(7))
)

levels = level_order(root)
for i, level in enumerate(levels):
    print(f"Level {i}: {level}")
`,
      visualizer: "bfs-tree"
    }
  ],

  dfs: [
    {
      title: "Number of Islands",
      difficulty: "Medium",
      description: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically. Use DFS to flood-fill each island.",
      sampleInput: "grid = [\n  ['1','1','0','0','0'],\n  ['1','1','0','0','0'],\n  ['0','0','1','0','0'],\n  ['0','0','0','1','1']\n]",
      sampleOutput: "Number of islands: 3",
      hint: "When you find a '1', do a DFS to mark all connected '1's as visited (change to '0'). Count how many times you start a new DFS.",
      starterJS: `function numIslands(grid) {
  let count = 0;
  
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
    if (grid[r][c] !== '1') return;
    
    grid[r][c] = '0'; // Mark visited
    dfs(r+1, c);
    dfs(r-1, c);
    dfs(r, c+1);
    dfs(r, c-1);
  }
  
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  
  return count;
}

const grid = [
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1']
];

console.log("Number of islands:", numIslands(grid));
`,
      solutionJS: `function numIslands(grid){let count=0;function dfs(r,c){if(r<0||r>=grid.length||c<0||c>=grid[0].length||grid[r][c]!=='1')return;grid[r][c]='0';dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++)if(grid[r][c]==='1'){count++;dfs(r,c);}return count;}
const grid=[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];
console.log("Number of islands:",numIslands(grid));`,
      starterPY: `def num_islands(grid):
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= len(grid): return
        if c < 0 or c >= len(grid[0]): return
        if grid[r][c] != '1': return
        
        grid[r][c] = '0'  # Mark visited
        dfs(r+1, c); dfs(r-1, c)
        dfs(r, c+1); dfs(r, c-1)
    
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count

grid = [
    ['1','1','0','0','0'],
    ['1','1','0','0','0'],
    ['0','0','1','0','0'],
    ['0','0','0','1','1']
]

print("Number of islands:", num_islands(grid))
`,
      visualizer: "dfs-islands"
    },
    {
      title: "Detect Cycle in Graph",
      difficulty: "Hard",
      description: "Given a directed graph as an adjacency list, detect if there is a cycle. Use DFS with a 'currently in recursion stack' set — the key insight for cycle detection in directed graphs.",
      sampleInput: "graph = {\n  0: [1, 2],\n  1: [2],\n  2: [3],\n  3: [1]  // cycle: 1→2→3→1\n}",
      sampleOutput: "Cycle detected: true\nCycle: 1 → 2 → 3 → 1",
      hint: "Use two sets: 'visited' and 'recStack'. A cycle exists when DFS visits a node that's already in the current recursion stack.",
      starterJS: `function hasCycle(graph) {
  const visited = new Set();
  const recStack = new Set();
  
  function dfs(node) {
    visited.add(node);
    recStack.add(node);
    
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true; // Back edge = cycle!
      }
    }
    
    recStack.delete(node); // Done with this node
    return false;
  }
  
  for (const node of Object.keys(graph)) {
    if (!visited.has(parseInt(node))) {
      if (dfs(parseInt(node))) return true;
    }
  }
  
  return false;
}

const graph = {
  0: [1, 2],
  1: [2],
  2: [3],
  3: [1]
};

console.log("Cycle detected:", hasCycle(graph));
`,
      solutionJS: `function hasCycle(graph){const visited=new Set(),recStack=new Set();function dfs(node){visited.add(node);recStack.add(node);for(const n of(graph[node]||[])){if(!visited.has(n)){if(dfs(n))return true;}else if(recStack.has(n))return true;}recStack.delete(node);return false;}for(const node of Object.keys(graph)){if(!visited.has(parseInt(node)))if(dfs(parseInt(node)))return true;}return false;}
const graph={0:[1,2],1:[2],2:[3],3:[1]};
console.log("Cycle detected:",hasCycle(graph));`,
      starterPY: `def has_cycle(graph):
    visited = set()
    rec_stack = set()
    
    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True  # Back edge!
        
        rec_stack.remove(node)
        return False
    
    for node in graph:
        if node not in visited:
            if dfs(node):
                return True
    
    return False

graph = {
    0: [1, 2],
    1: [2],
    2: [3],
    3: [1]
}

print("Cycle detected:", has_cycle(graph))
`,
      visualizer: null
    }
  ],

  dp: [
    {
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      description: "Given two strings, find the length of their longest common subsequence (LCS). A subsequence is formed by deleting some (or no) characters without changing the order. This is a classic 2D DP problem.",
      sampleInput: 'str1 = "ABCBDAB"\nstr2 = "BDCABA"',
      sampleOutput: 'LCS length: 4\nLCS: "BCBA" (or "BDAB")',
      hint: "Build a 2D table dp[i][j] = LCS of str1[0..i] and str2[0..j]. If characters match: dp[i][j] = dp[i-1][j-1] + 1. Otherwise: max(dp[i-1][j], dp[i][j-1]).",
      starterJS: `function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Build DP table
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  // Backtrack to find the actual LCS
  let result = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i-1] === str2[j-1]) {
      result = str1[i-1] + result;
      i--; j--;
    } else if (dp[i-1][j] > dp[i][j-1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return { length: dp[m][n], sequence: result };
}

const str1 = "ABCBDAB";
const str2 = "BDCABA";
const { length, sequence } = lcs(str1, str2);
console.log("LCS length:", length);
console.log("LCS:", sequence);
`,
      solutionJS: `function lcs(s1,s2){const m=s1.length,n=s2.length,dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=s1[i-1]===s2[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);let res='',i=m,j=n;while(i>0&&j>0){if(s1[i-1]===s2[j-1]){res=s1[i-1]+res;i--;j--;}else if(dp[i-1][j]>dp[i][j-1])i--;else j--;}return{length:dp[m][n],sequence:res};}
const{length,sequence}=lcs("ABCBDAB","BDCABA");
console.log("LCS length:",length);console.log("LCS:",sequence);`,
      starterPY: `def lcs(str1, str2):
    m, n = len(str1), len(str2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    
    for i in range(1, m+1):
        for j in range(1, n+1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack
    result = ''
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            result = str1[i-1] + result
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return dp[m][n], result

length, sequence = lcs("ABCBDAB", "BDCABA")
print(f"LCS length: {length}")
print(f"LCS: {sequence}")
`,
      visualizer: "dp-lcs"
    },
    {
      title: "0/1 Knapsack",
      difficulty: "Hard",
      description: "You have a knapsack with capacity W. Given n items each with a weight and value, find the maximum value you can achieve. Each item can only be taken once (0/1). Classic DP problem — build a table of optimal values for each capacity.",
      sampleInput: "capacity = 6\nweights = [1, 2, 3, 5]\nvalues  = [1, 6, 10, 16]",
      sampleOutput: "Max value: 17\nItems taken: item2 (w=2,v=6) + item3 (w=3,v=10) = w:5, v:16... wait\nActually: item1+item2+item3 = 1+2+3=6 → 1+6+10=17",
      hint: "dp[i][w] = max value using first i items with capacity w. For each item: either skip it (dp[i-1][w]) or take it if it fits (dp[i-1][w-weight[i]] + value[i]).",
      starterJS: `function knapsack(capacity, weights, values) {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(capacity+1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Skip item i
      dp[i][w] = dp[i-1][w];
      // Take item i (if it fits)
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
      }
    }
  }
  
  // Find items taken (backtrack)
  const taken = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i-1][w]) {
      taken.push(i-1);
      w -= weights[i-1];
    }
  }
  
  return { maxValue: dp[n][capacity], items: taken.reverse() };
}

const capacity = 6;
const weights = [1, 2, 3, 5];
const values  = [1, 6, 10, 16];

const { maxValue, items } = knapsack(capacity, weights, values);
console.log("Max value:", maxValue);
console.log("Items taken (0-indexed):", items.join(", "));
items.forEach(i => console.log(\`  Item \${i+1}: weight=\${weights[i]}, value=\${values[i]}\`));
`,
      solutionJS: `function knapsack(cap,wt,val){const n=wt.length,dp=Array.from({length:n+1},()=>new Array(cap+1).fill(0));for(let i=1;i<=n;i++)for(let w=0;w<=cap;w++){dp[i][w]=dp[i-1][w];if(wt[i-1]<=w)dp[i][w]=Math.max(dp[i][w],dp[i-1][w-wt[i-1]]+val[i-1]);}const taken=[];let w=cap;for(let i=n;i>0;i--)if(dp[i][w]!==dp[i-1][w]){taken.push(i-1);w-=wt[i-1];}return{maxValue:dp[n][cap],items:taken.reverse()};}
const {maxValue,items}=knapsack(6,[1,2,3,5],[1,6,10,16]);
console.log("Max value:",maxValue);items.forEach(i=>console.log(\`  Item \${i+1}: w=\${[1,2,3,5][i]}, v=\${[1,6,10,16][i]}\`));`,
      starterPY: `def knapsack(capacity, weights, values):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    
    for i in range(1, n+1):
        for w in range(capacity+1):
            dp[i][w] = dp[i-1][w]  # skip
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
    
    taken = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            taken.append(i-1)
            w -= weights[i-1]
    
    return dp[n][capacity], list(reversed(taken))

capacity = 6
weights = [1, 2, 3, 5]
values = [1, 6, 10, 16]

max_val, items = knapsack(capacity, weights, values)
print(f"Max value: {max_val}")
for i in items:
    print(f"  Item {i+1}: weight={weights[i]}, value={values[i]}")
`,
      visualizer: null
    }
  ],

  tree: [
    {
      title: "Validate BST",
      difficulty: "Medium",
      description: "Given a binary tree, determine if it is a valid Binary Search Tree (BST). A valid BST requires every left subtree value < node value, every right subtree value > node value, and both subtrees must also be valid BSTs.",
      sampleInput: "    5\n   / \\\n  3   8\n / \\ / \\\n1  4 7   9",
      sampleOutput: "Is valid BST: true",
      hint: "Don't just check parent-child relationships! Pass down min and max bounds as you recurse. Left children must be < node, right must be > node — and these bounds cascade down the tree.",
      starterJS: `class TreeNode {
  constructor(val, left=null, right=null) {
    this.val = val; this.left = left; this.right = right;
  }
}

function isValidBST(root, min=-Infinity, max=Infinity) {
  if (!root) return true;
  
  if (root.val <= min || root.val >= max) return false;
  
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}

// Valid BST
const validTree = new TreeNode(5,
  new TreeNode(3, new TreeNode(1), new TreeNode(4)),
  new TreeNode(8, new TreeNode(7), new TreeNode(9))
);

// Invalid BST (6 is in left subtree of 5 but > 5)
const invalidTree = new TreeNode(5,
  new TreeNode(3, new TreeNode(1), new TreeNode(6)),
  new TreeNode(8, new TreeNode(7), new TreeNode(9))
);

console.log("Valid tree:", isValidBST(validTree));
console.log("Invalid tree:", isValidBST(invalidTree));
`,
      solutionJS: `class TreeNode{constructor(v,l=null,r=null){this.val=v;this.left=l;this.right=r;}}
function isValidBST(root,min=-Infinity,max=Infinity){if(!root)return true;if(root.val<=min||root.val>=max)return false;return isValidBST(root.left,min,root.val)&&isValidBST(root.right,root.val,max);}
const vt=new TreeNode(5,new TreeNode(3,new TreeNode(1),new TreeNode(4)),new TreeNode(8,new TreeNode(7),new TreeNode(9)));
const it=new TreeNode(5,new TreeNode(3,new TreeNode(1),new TreeNode(6)),new TreeNode(8,new TreeNode(7),new TreeNode(9)));
console.log("Valid tree:",isValidBST(vt));console.log("Invalid tree:",isValidBST(it));`,
      starterPY: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    
    if root.val <= min_val or root.val >= max_val:
        return False
    
    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))

valid_tree = TreeNode(5,
    TreeNode(3, TreeNode(1), TreeNode(4)),
    TreeNode(8, TreeNode(7), TreeNode(9))
)

invalid_tree = TreeNode(5,
    TreeNode(3, TreeNode(1), TreeNode(6)),
    TreeNode(8, TreeNode(7), TreeNode(9))
)

print("Valid tree:", is_valid_bst(valid_tree))
print("Invalid tree:", is_valid_bst(invalid_tree))
`,
      visualizer: "bst-validate"
    }
  ],

  sorting: [
    {
      title: "Merge Sort",
      difficulty: "Medium",
      description: "Implement merge sort — a divide-and-conquer algorithm with O(n log n) time complexity. Split the array in half recursively until single elements, then merge back in sorted order.",
      sampleInput: "arr = [38, 27, 43, 3, 9, 82, 10]",
      sampleOutput: "Sorted: [3, 9, 10, 27, 38, 43, 82]\nTime: O(n log n) | Space: O(n)",
      hint: "Base case: array of length ≤ 1 is already sorted. Recursive case: split → sort left → sort right → merge. The merge step walks two sorted arrays with two pointers.",
      starterJS: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

const arr = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", arr.join(", "));
console.log("Sorted:  ", mergeSort(arr).join(", "));
`,
      solutionJS: `function mergeSort(arr){if(arr.length<=1)return arr;const mid=Math.floor(arr.length/2);return merge(mergeSort(arr.slice(0,mid)),mergeSort(arr.slice(mid)));}
function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length)res.push(l[i]<=r[j]?l[i++]:r[j++]);return res.concat(l.slice(i)).concat(r.slice(j));}
const arr=[38,27,43,3,9,82,10];
console.log("Original:",arr.join(", "));console.log("Sorted:  ",mergeSort(arr).join(", "));`,
      starterPY: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    
    return result + left[i:] + right[j:]

arr = [38, 27, 43, 3, 9, 82, 10]
print("Original:", arr)
print("Sorted:  ", merge_sort(arr))
`,
      visualizer: "merge-sort"
    }
  ],

  "binary-search": [
    {
      title: "Classic Binary Search",
      difficulty: "Easy",
      description: "Search for a target value in a sorted array. Binary search cuts the search space in half each step, achieving O(log n) time — far better than linear O(n) search.",
      sampleInput: "arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\ntarget = 23",
      sampleOutput: "Found at index: 5\nSteps taken: 3",
      hint: "Maintain lo and hi pointers. At each step check mid = (lo+hi)/2. If arr[mid] == target, done. If target < arr[mid], search left (hi=mid-1). Otherwise search right (lo=mid+1).",
      starterJS: `function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  let steps = 0;
  
  while (lo <= hi) {
    steps++;
    const mid = Math.floor((lo + hi) / 2);
    
    console.log(\`Step \${steps}: checking index \${mid}, value \${arr[mid]}\`);
    
    if (arr[mid] === target) {
      return { index: mid, steps };
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  
  return { index: -1, steps };
}

const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const target = 23;

const { index, steps } = binarySearch(arr, target);
if (index !== -1) {
  console.log(\`\\nFound \${target} at index \${index}\`);
  console.log(\`Steps taken: \${steps} (vs \${arr.length} for linear search)\`);
} else {
  console.log(\`\${target} not found\`);
}
`,
      solutionJS: `function binarySearch(arr,target){let lo=0,hi=arr.length-1,steps=0;while(lo<=hi){steps++;const mid=Math.floor((lo+hi)/2);console.log(\`Step \${steps}: idx \${mid}, val \${arr[mid]}\`);if(arr[mid]===target)return{index:mid,steps};else if(arr[mid]<target)lo=mid+1;else hi=mid-1;}return{index:-1,steps};}
const arr=[2,5,8,12,16,23,38,56,72,91];const{index,steps}=binarySearch(arr,23);
if(index!==-1)console.log(\`\\nFound at index \${index}, steps: \${steps}\`);`,
      starterPY: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    steps = 0
    
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        
        print(f"Step {steps}: checking index {mid}, value {arr[mid]}")
        
        if arr[mid] == target:
            return mid, steps
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    
    return -1, steps

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23

index, steps = binary_search(arr, target)
if index != -1:
    print(f"\\nFound {target} at index {index}")
    print(f"Steps: {steps} (vs {len(arr)} for linear search)")
else:
    print(f"{target} not found")
`,
      visualizer: "binary-search"
    }
  ]
};
