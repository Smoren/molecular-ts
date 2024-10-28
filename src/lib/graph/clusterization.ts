import type { GraphDistanceFunction, GraphInterface } from "./types";

type GraphPair = {
  lhs: GraphInterface;
  rhs: GraphInterface;
  distance: number;
}

function clusterGraphs(graphs: GraphInterface[], distanceFunction: GraphDistanceFunction): GraphInterface[][] {
  if (graphs.length === 0) return [];

  // Шаг 1: Вычисление всех попарных расстояний
  const edges: GraphPair[] = [];
  for (let i = 0; i < graphs.length; i++) {
    for (let j = i+1; j < graphs.length; j++) {
      const distance = distanceFunction(graphs[i], graphs[j]);
      edges.push({ lhs: graphs[i], rhs: graphs[j], distance });
    }
  }

  // Шаг 2: Сортировка ребер по возрастанию расстояния
  edges.sort((a, b) => a.distance - b.distance);

  // Шаг 3: Реализация алгоритма Краскала для построения MST
  const parent: Map<GraphInterface, GraphInterface> = new Map();

  // Инициализация структуры Union-Find
  graphs.forEach(graph => {
    parent.set(graph, graph);
  });

  // Функция для поиска корня в Union-Find
  const find = (graph: GraphInterface): GraphInterface => {
    if (parent.get(graph) !== graph) {
      parent.set(graph, find(parent.get(graph)!)); // Путь сжатия
    }
    return parent.get(graph)!;
  };

  // Функция для объединения двух множеств
  const union = (lhs: GraphInterface, rhs: GraphInterface) => {
    const lhsRoot = find(lhs);
    const rhsRoot = find(rhs);
    if (lhsRoot !== rhsRoot) {
      parent.set(lhsRoot, rhsRoot);
    }
  };

  // Функция поиска корня для кластеров
  const findCluster = (graph: GraphInterface, parentMap: Map<GraphInterface, GraphInterface>): GraphInterface => {
    if (parentMap.get(graph) !== graph) {
      parentMap.set(graph, findCluster(parentMap.get(graph)!, parentMap));
    }
    return parentMap.get(graph)!;
  };

  // Построение MST
  const mst: GraphPair[] = [];
  for (const edge of edges) {
    const rootLhs = find(edge.lhs);
    const rootRhs = find(edge.rhs);
    if (rootLhs !== rootRhs) {
      mst.push(edge);
      union(rootLhs, rootRhs);
    }
  }

  // Шаг 4: Определение числа кластеров на основе разрыва в расстояниях MST
  // Находим разницу между соседними расстояниями и выбираем точку максимального разрыва
  const sortedMst = [...mst].sort((a, b) => a.distance - b.distance);
  const distances = sortedMst.map(edge => edge.distance);

  // Вычисляем разрывы между последовательными расстояниями
  const gaps = distances.slice(1).map((dist, index) => dist - distances[index]);

  // Находим индекс максимального разрыва
  let maxGapIndex = 0;
  let maxGap = -Infinity;
  gaps.forEach((gap, index) => {
    if (gap > maxGap) {
      maxGap = gap;
      maxGapIndex = index;
    }
  });

  // Определяем количество кластеров как maxGapIndex + 1
  // Это предполагает разделение на два кластера, но можно обойтись иначе
  const numClusters = 2; // Для простоты устанавливаем 2 кластера

  // Если нужно динамически определить количество кластеров, можно использовать дополнительную логику

  // Шаг 5: Разрезание MST на кластеры удалением самых длинных (numClusters-1) ребер
  // Сортируем MST по убыванию расстояния
  const mstSortedDesc = [...mst].sort((a, b) => b.distance - a.distance);
  // Выбираем (numClusters - 1) самых длинных ребер
  const edgesToRemove = mstSortedDesc.slice(0, numClusters - 1);
  // Создаём новую структуру Union-Find для кластеризации
  const parentClusters: Map<GraphInterface, GraphInterface> = new Map();
  graphs.forEach(graph => {
    parentClusters.set(graph, graph);
  });

  // Объединяем все ребра MST, кроме удалённых, чтобы сформировать кластеры
  for (const edge of mst) {
    if (!edgesToRemove.includes(edge)) {
      const lhsRoot = findCluster(edge.lhs, parentClusters);
      const rhsRoot = findCluster(edge.rhs, parentClusters);
      if (lhsRoot !== rhsRoot) {
        parentClusters.set(lhsRoot, rhsRoot);
      }
    }
  }

  // Группируем графы по кластерам
  const clustersMap: Map<GraphInterface, GraphInterface[]> = new Map();
  graphs.forEach(graph => {
    const root = findCluster(graph, parentClusters);
    if (!clustersMap.has(root)) {
      clustersMap.set(root, []);
    }
    clustersMap.get(root)!.push(graph);
  });

  return Array.from(clustersMap.values());
}
