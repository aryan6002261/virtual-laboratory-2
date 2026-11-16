import { ExperimentPedagogy } from '../../types/lab';

export const PROGRAMMING_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'bubble-sort': {
    id: 'bubble-sort',
    flowchart: [
      { step: 1, title: 'Generate or Shuffle Array', detail: 'Initialize n unsorted integer bars (or Nearly-Sorted preset).' },
      { step: 2, title: 'Compare Adjacent Pairs', detail: 'Scan j from 0 to n − pass − 2 and compare arr[j] > arr[j+1].' },
      { step: 3, title: 'Swap Inverted Pair', detail: 'If out of order, swap elements, increment inversion counter, and set swapped = true.', condition: 'If full pass has swapped === false → Early Exit O(n)' },
      { step: 4, title: 'Log Pass Complexity', detail: 'Record array size n, comparisons, swaps performed, and sorted confirmation.' },
    ],
    equations: [
      { name: 'Worst-Case Comparisons', expression: 'C(n) = n(n − 1) / 2 = O(n²)', notes: 'Occurs on reverse-sorted input where every pair is an inversion.' },
      { name: 'Adaptive Best Case', expression: 'C_best(n) = n − 1 = O(n)', notes: 'Achieved with early-termination flag when input is already sorted.' },
    ],
    theoryParagraphs: [
      'Bubble Sort repeatedly sweeps left-to-right across an array, swapping adjacent elements whenever a[j] > a[j+1]. Each pass guarantees the largest remaining unsorted value settles into its final rightmost slot, shrinking the active window by 1.',
      'Because it only swaps strictly inverted adjacent elements, Bubble Sort is stable and strictly in-place O(1) auxiliary space. Adding a boolean `swapped` flag turns best-case already-sorted inputs into linear O(n) execution.',
    ],
    realWorldApplications: [
      'Teaching foundational loop invariants, inversion counting, and adaptive sorting optimizations.',
      'Microcontroller tiny fixed arrays (n ≤ 10) where zero recursion stack and O(1) space matter.',
      'Polishing nearly-sorted telemetry streams with 1–2 out-of-order packets.',
    ],
    logColumns: ['Size n', 'Preset', 'Comparisons', 'Swaps', 'Pass Result'],
  },

  'searching': {
    id: 'searching',
    flowchart: [
      { step: 1, title: 'Set Target Key', detail: 'Enter integer search target and select Linear Search or Binary Search.' },
      { step: 2, title: 'Initialize Search Bounds', detail: 'For Binary Search on sorted array, set low = 0 and high = n − 1.' },
      { step: 3, title: 'Probe & Halve Interval', detail: 'Evaluate mid = low + ⌊(high−low)/2⌋ and discard half of remaining indices.', condition: 'If arr[mid] === target → Found  |  low > high → Absent' },
      { step: 4, title: 'Compare Probe Counts', detail: 'Log algorithm mode, target, probes executed, and found index.' },
    ],
    equations: [
      { name: 'Overflow-Safe Midpoint', expression: 'mid = low + ⌊(high − low) / 2⌋', notes: 'Prevents signed 32-bit integer overflow on massive arrays.' },
      { name: 'Complexity Bounds', expression: 'Linear: O(n)  ·  Binary: O(log₂ n)', notes: 'On 1 billion sorted items, Binary Search finishes in ≤ 30 probes.' },
    ],
    theoryParagraphs: [
      'Linear Search inspects elements sequentially from index 0, working on any unsorted list in O(n) worst-case time. When data is pre-sorted monotonically, Binary Search exploits total order to discard half of the candidate space with every single comparison.',
      'Each failed probe shrinks the interval from n to n/2, n/4, ..., resolving in at most ⌊log₂ n⌋ + 1 steps—turning million-element lookups into ~20 comparisons.',
    ],
    realWorldApplications: [
      'Database B-Tree index lookups, dictionary word lookup, and git-bisect regression hunting.',
      'Binary search over continuous answer spaces in optimization and competitive programming.',
      'Routing table longest-prefix lookups and IP geolocation range matching.',
    ],
    logColumns: ['Algorithm', 'Array n', 'Target', 'Probes', 'Result Index'],
  },

  'stack': {
    id: 'stack',
    flowchart: [
      { step: 1, title: 'Inspect Stack Top Pointer', detail: 'Observe bounded LIFO container (capacity 8) initialized at TOP = −1.' },
      { step: 2, title: 'Push Data onto TOP', detail: 'Increment TOP and write value; guard against Overflow when TOP === N−1.', condition: 'TOP === Max − 1 → Stack Overflow Guard' },
      { step: 3, title: 'Pop or Peek TOP Frame', detail: 'Remove or read top item in O(1); guard against Underflow when TOP === −1.' },
      { step: 4, title: 'Log Stack Operations', detail: 'Record operation history, current TOP index, and stack size.' },
    ],
    equations: [
      { name: 'Operation Complexity', expression: 'Push: O(1)  ·  Pop: O(1)  ·  Peek: O(1)', notes: 'All updates occur solely at the TOP pointer without shifting elements.' },
    ],
    theoryParagraphs: [
      'A Stack enforces strict Last-In, First-Out (LIFO) discipline: elements can only enter (`push`) and exit (`pop`) at one end designated as `TOP`.',
      'This simple constraint mirrors nested structure across computer science—governing CPU subroutine call frames, undo/redo editor history, balanced-parentheses verification, and Shunting-Yard postfix expression evaluation.',
    ],
    realWorldApplications: [
      'CPU runtime Call Stack managing function parameters, local variables, and return addresses.',
      'Browser Back navigation stack and IDE multi-level Undo/Redo command buffers.',
      'Syntax parsing, DFS backtracking, and PostScript/JVM stack-based virtual machines.',
    ],
    logColumns: ['Operation', 'Value', 'TOP Index', 'Count', 'Status'],
  },

  'queue': {
    id: 'queue',
    flowchart: [
      { step: 1, title: 'Inspect Ring Buffer (N = 8)', detail: 'Observe circular array slots with FRONT and REAR indices.' },
      { step: 2, title: 'Enqueue Item at REAR', detail: 'Advance rear = (rear + 1) % N and insert item if count < N.', condition: 'Modulo % N wraps slot 7 seamlessly to slot 0' },
      { step: 3, title: 'Dequeue Item from FRONT', detail: 'Consume front element and advance front = (front + 1) % N in O(1).' },
      { step: 4, title: 'Log Ring Pointer State', detail: 'Record FRONT, REAR, occupancy count, and modulo wrap transitions.' },
    ],
    equations: [
      { name: 'Circular Wrap Pointer', expression: 'next_idx = (idx + 1) mod N', notes: 'Eliminates dead space and avoids O(n) array shifting on dequeue.' },
      { name: 'Occupancy Count', expression: 'size = (rear − front + N) mod N', notes: 'Tracks active items cleanly across wrap-around boundaries.' },
    ],
    theoryParagraphs: [
      'A Queue enforces First-In, First-Out (FIFO) fairness—the oldest enqueued item is always the first dequeued. Implementing a queue in a naive linear array wastes freed front slots unless elements shift left in O(n).',
      'Wrapping both `front` and `rear` indices around a fixed-size ring via modulo arithmetic `(idx + 1) % N` achieves true O(1) enqueue and dequeue with zero dynamic heap allocation.',
    ],
    realWorldApplications: [
      'Operating system round-robin CPU task schedulers and printer/network packet spoolers.',
      'Lock-free DMA audio and video streaming ring buffers in hardware drivers.',
      'Breadth-First Search (BFS) shortest-hop graph traversal frontier.',
    ],
    logColumns: ['Operation', 'Value', 'FRONT', 'REAR', 'Occupancy'],
  },

  'recursion': {
    id: 'recursion',
    flowchart: [
      { step: 1, title: 'Select Disk Count n (1..5)', detail: 'Initialize Tower of Hanoi with n disks stacked on Source Peg A.' },
      { step: 2, title: 'Wind Recursive Call Stack', detail: 'Decompose hanoi(n, A, B, C) into subproblem hanoi(n−1, A, C, B) down to n = 1.' },
      { step: 3, title: 'Hit Base Case & Unwind', detail: 'Execute single-disk move at n = 1 and pop frames back up the Call Stack.', condition: 'Base Case n === 1 terminates winding' },
      { step: 4, title: 'Verify 2ⁿ − 1 Moves', detail: 'Log disk count, moves executed, max call stack depth, and recurrence verification.' },
    ],
    equations: [
      { name: 'Hanoi Recurrence Relation', expression: 'T(n) = 2 T(n − 1) + 1  ⟹  T(n) = 2ⁿ − 1', notes: 'Exponential move count with linear O(n) peak call-stack memory.' },
    ],
    theoryParagraphs: [
      'Recursion solves a problem by reducing it into smaller self-similar subproblems until hitting an explicit Base Case that returns directly without further self-calls.',
      'In the Tower of Hanoi, moving an n-disk tower from A to C decomposes cleanly into moving the top n−1 disks onto auxiliary peg B, shifting the largest disk n to C, and transferring the n−1 tower from B onto C—illustrating call-stack winding and unwinding live.',
    ],
    realWorldApplications: [
      'Divide-and-conquer algorithms (Merge Sort, Quicksort, Fast Fourier Transform).',
      'Abstract Syntax Tree (AST) compiler evaluation and directory tree filesystem walkers.',
      'Backtracking constraint solvers (Sudoku, N-Queens, SAT solvers).',
    ],
    logColumns: ['Disks n', 'Step #', 'Move', 'Stack Depth', 'Total 2ⁿ−1'],
  },

  'binary-search-tree': {
    id: 'binary-search-tree',
    flowchart: [
      { step: 1, title: 'Maintain BST Invariant', detail: 'Ensure every node satisfies Left Subtree < Parent < Right Subtree.' },
      { step: 2, title: 'Insert, Search, or Delete Key', detail: 'Compare target against current node and branch Left (<) or Right (>).' },
      { step: 3, title: 'Execute Tree Traversal', detail: 'Run animated Inorder (sorted), Preorder, Postorder, or Level-Order BFS.', condition: 'Inorder traversal always yields ascending sorted order' },
      { step: 4, title: 'Log Traversal & Height', detail: 'Record operation, tree node count, height h, and visited key sequence.' },
    ],
    equations: [
      { name: 'BST Ordering Invariant', expression: '∀x ∈ Left(P): x < P  ∧  ∀y ∈ Right(P): y > P', notes: 'Enables O(h) search, insert, and delete proportional to tree height h.' },
      { name: 'Height Bounds', expression: 'Balanced: h = O(log₂ n)  ·  Skewed: h = O(n)', notes: 'Balanced variants (AVL, Red-Black) guarantee logarithmic worst-case bounds.' },
    ],
    theoryParagraphs: [
      'A Binary Search Tree organizes dynamic keys hierarchically so every comparison discards an entire subtree. Unlike static sorted arrays where middle insertion costs O(n) shifting, BST insertions and deletions update pointers in O(h) time.',
      'Four canonical traversals expose complementary structures: Inorder recovers sorted keys, Preorder serializes tree topology, Postorder safely deallocates children before parents, and BFS Level-Order inspects breadth layers.',
    ],
    realWorldApplications: [
      'C++ std::map / Java TreeMap ordered associative dictionaries.',
      'Database range-query B+ Trees and Spatial Quadtrees / Octrees in 3D game engines.',
      'Huffman coding trees and expression evaluation syntax trees.',
    ],
    logColumns: ['Operation', 'Key / Mode', 'Nodes', 'Height', 'Output'],
  },

  'dijkstra-graph': {
    id: 'dijkstra-graph',
    flowchart: [
      { step: 1, title: 'Initialize Distances & Queue', detail: 'Set d[source] = 0, all other d[v] = ∞, and push (0, source) into Min-Heap.' },
      { step: 2, title: 'Extract Min-Distance Vertex u', detail: 'Pop unvisited vertex u with smallest tentative distance d[u].' },
      { step: 3, title: 'Relax Outgoing Edges (u, v)', detail: 'Check if routing via u shortens d[v]: d[u] + w(u,v) < d[v].', condition: 'Requires non-negative edge weights w(u,v) ≥ 0' },
      { step: 4, title: 'Trace Shortest Path Tree', detail: 'Backtrack parent pointers `prev[]` from Target to Source and log total cost.' },
    ],
    equations: [
      { name: 'Greedy Edge Relaxation', expression: 'd[v] ← min(d[v], d[u] + w(u, v))', notes: 'Also updates parent pointer prev[v] = u whenever distance strictly improves.' },
      { name: 'Min-Heap Complexity', expression: 'T(V, E) = O((V + E) log V)', notes: 'Each vertex settles once; each edge relaxes at most once.' },
    ],
    theoryParagraphs: [
      'Edsger Dijkstra’s 1956 algorithm finds single-source shortest paths across weighted networks with non-negative edge costs. By greedily settling the closest unvisited node u from a Min-Heap priority queue, it guarantees no future detour through farther nodes can improve d[u].',
      'Whenever an outgoing edge (u, v) offers a cheaper path d[u] + w(u,v) < d[v], relaxation tightens d[v] and records parent pointer prev[v] = u to reconstruct the optimal route.',
    ],
    realWorldApplications: [
      'GPS turn-by-turn road navigation (with A* heuristic extensions) and ride-share dispatch.',
      'OSPF (Open Shortest Path First) internet router packet forwarding protocols.',
      'Robot path planning, telecom fiber routing, and supply-chain logistics optimization.',
    ],
    logColumns: ['Source → Target', 'Step', 'Settled u', 'Min Cost', 'Shortest Path'],
  },
};
