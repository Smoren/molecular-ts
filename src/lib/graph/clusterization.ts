import type { GraphInterface } from "./types";
import { calcDistanceBetweenGraphsByTypesCombined } from "./utils";
import { kMeans, TSNE } from '../math/clusterization';

export function clusterGraphs(graphs: GraphInterface[]): GraphInterface[][] {
  if (graphs.length === 0) return [];

  // Step 1: Select landmarks
  const NUM_LANDMARKS = Math.min(30, graphs.length); // Adjust as needed
  const landmarks = graphs.slice(0, NUM_LANDMARKS);

  // Step 2: Create feature vectors based on distances to landmarks
  const featureVectors: number[][] = graphs.map((graph) => {
    return landmarks.map((landmark) => calcDistanceBetweenGraphsByTypesCombined(graph, landmark));
  });

  // Optional: Normalize feature vectors
  // For simplicity, we'll skip normalization, but it's recommended based on your data

  // Step 3: Apply t-SNE to reduce dimensions to 2
  const tsne = new TSNE({
    dim: 2,
    perplexity: 30,
    learningRate: 200,
    nIter: 300, // Adjust based on convergence
    momentum: 0.5,
    initialMomentum: 0.5,
  });

  const tsneResult = tsne.run(featureVectors);
  const embeddings = tsneResult.output; // Array of [x, y] points

  // Step 4: Perform K-Means clustering on embeddings
  // Decide the number of clusters
  const NUM_CLUSTERS = Math.ceil(Math.sqrt(graphs.length / 2)); // Example heuristic

  const kmeansResult = kMeans(embeddings, NUM_CLUSTERS, 100);
  const assignments = kmeansResult.clusters;

  // Step 5: Group graphs into clusters
  const clusters: GraphInterface[][] = [];
  for (let i = 0; i < NUM_CLUSTERS; i++) {
    clusters.push([]);
  }

  assignments.forEach((clusterIndex, graphIndex) => {
    if (clusters[clusterIndex]) {
      clusters[clusterIndex].push(graphs[graphIndex]);
    } else {
      // In case of unexpected cluster index
      clusters.push([graphs[graphIndex]]);
    }
  });

  return clusters;
}
