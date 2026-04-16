# || AlgoForge — Algorithm Playground ||

An interactive browser-based algorithm learning playground. Write and run code, solve problems, and see visual explanations — all in one place.

## Features of this program

- **7 algorithm categories**: Greedy, BFS, DFS, Dynamic Programming, Tree, Sorting, Binary Search
- **15+ problems** with descriptions, hints, and reference solutions
- **Live code execution** (JavaScript runs in-browser instantly)
- **Step-by-step visualizations** for each algorithm
- **Python starter code** included for every problem
- **Dark/light theme** toggle

```javascript
{
  title: "Your Problem Title",
  difficulty: "Easy",          // Easy | Medium | Hard
  description: "Explain the problem here...",
  sampleInput: "input = ...",
  sampleOutput: "output = ...",
  hint: "Tip for solving it...",
  starterJS: `// Your JavaScript starter code here`,
  solutionJS: `// Reference solution`,
  starterPY: `# Python starter code here`,
  visualizer: null             // or a key matching visualizer.js
}
```

---

## File Structure

```
algorithm-playground/
├── index.html      — page structure and layout
├── style.css       — all styles and theming
├── problems.js     — all problem definitions
├── visualizer.js   — algorithm visualizations
└── app.js          — application logic (tabs, running code, etc.)
```

---

## Algorithm Categories

| Category | Problems Included |
|---|---|
| Greedy | Activity Selection, Coin Change, Fractional Knapsack |
| BFS | Shortest Path in Grid, Level Order Traversal |
| DFS | Number of Islands, Detect Cycle in Graph |
| Dynamic Programming | LCS, 0/1 Knapsack |
| Tree | Validate BST |
| Sorting | Merge Sort |
| Binary Search | Classic Binary Search |

---

## Tech Stack

Pure HTML, CSS, and JavaScript — no frameworks, no build tools, no npm. Just open `index.html` in a browser and it works.
