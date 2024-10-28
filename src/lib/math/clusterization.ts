import type { NumericVector } from './types';
import { shuffleArray } from './helpers';
import { createVector } from '../math/factories';

type KMeansResult = {
  clusters: NumericVector;
}

type TSNEOptions = {
  dim?: number;
  perplexity?: number;
  learningRate?: number;
  nIter?: number;
  momentum?: number;
  initialMomentum?: number;
}

type TSNEResult = {
  output: number[][];
}

// Basic K-Means clustering
export function kMeans(data: number[][], k: number, maxIterations = 100): KMeansResult {
  const n = data.length;
  const dim = data[0].length;

  // Initialize centroids randomly
  let centroids: number[][] = shuffleArray(data).slice(0, k).map(point => point.slice());

  let assignments = new Array(n).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assignment step
    for (let i = 0; i < n; i++) {
      const point = data[i];
      let minDist = Infinity;
      let cluster = 0;
      for (let c = 0; c < k; c++) {
        const dist = createVector(point).sub(centroids[c]).abs;
        if (dist < minDist) {
          minDist = dist;
          cluster = c;
        }
      }
      if (assignments[i] !== cluster) {
        assignments[i] = cluster;
        changed = true;
      }
    }

    // If no assignments changed, clustering is complete
    if (!changed) break;

    // Update step
    const sums = Array(k).fill(0).map(() => Array(dim).fill(0));
    const counts = Array(k).fill(0);

    for (let i = 0; i < n; i++) {
      const cluster = assignments[i];
      const point = data[i];
      for (let d = 0; d < dim; d++) {
        sums[cluster][d] += point[d];
      }
      counts[cluster] += 1;
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) continue; // Avoid division by zero
      for (let d = 0; d < dim; d++) {
        centroids[c][d] = sums[c][d] / counts[c];
      }
    }
  }

  return { clusters: assignments };
}

export class TSNE {
  private dim: number;
  private perplexity: number;
  private learningRate: number;
  private nIter: number;
  private momentum: number;
  private initialMomentum: number;

  private data: number[][] = [];
  private numPoints: number = 0;
  private X: number[][] = []; // Low-dimensional embeddings
  private gradients: number[][] = [];
  private gains: number[][] = [];

  constructor(options: TSNEOptions = {}) {
    this.dim = options.dim || 2;
    this.perplexity = options.perplexity || 30;
    this.learningRate = options.learningRate || 200;
    this.nIter = options.nIter || 1000;
    this.momentum = options.momentum || 0.5;
    this.initialMomentum = options.initialMomentum || 0.5;
  }

  public run(data: number[][]): TSNEResult {
    this.data = data;
    this.numPoints = data.length;

    // Initialize embeddings randomly
    this.X = Array.from({ length: this.numPoints }, () =>
      Array.from({ length: this.dim }, () => (Math.random() - 0.5) * 1e-4)
    );

    // Initialize gradients and gains
    this.gradients = Array.from({ length: this.numPoints }, () =>
      Array.from({ length: this.dim }, () => 0)
    );
    this.gains = Array.from({ length: this.numPoints }, () =>
      Array.from({ length: this.dim }, () => 1)
    );

    // Precompute pairwise affinities
    const P = this.computeAffinities();

    // Run iterations
    let momentum = this.initialMomentum;
    for (let iter = 0; iter < this.nIter; iter++) {
      // Compute low-dimensional affinities
      const Q = this.computeLowDimSimilarities();

      // Compute gradient
      const grads = this.computeGradients(P, Q);

      // Update gains
      for (let i = 0; i < this.numPoints; i++) {
        for (let d = 0; d < this.dim; d++) {
          const grad = grads[i][d];
          this.gains[i][d] = (Math.sign(grad) !== Math.sign(this.gradients[i][d]))
            ? this.gains[i][d] + 0.2
            : this.gains[i][d] * 0.8;
          this.gains[i][d] = Math.max(this.gains[i][d], 0.01);
        }
      }

      // Update gradients
      for (let i = 0; i < this.numPoints; i++) {
        for (let d = 0; d < this.dim; d++) {
          this.gradients[i][d] = momentum * this.gradients[i][d] - this.learningRate * this.gains[i][d] * grads[i][d];
          this.X[i][d] += this.gradients[i][d];
        }
      }

      // Update momentum
      if (iter === 20) {
        momentum = 0.8;
      }

      // Normalize embeddings to prevent overflow
      if (iter % 100 === 0) {
        // Optionally print progress
        console.log(`t-SNE iteration ${iter}`);
      }
    }

    return { output: this.X };
  }

  private computeAffinities(): number[][] {
    const sigma = this.perplexity;
    // For simplicity, use Gaussian affinities with fixed sigma
    // A proper implementation would adjust sigma per point to achieve the desired perplexity
    const P = Array.from({ length: this.numPoints }, () => Array(this.numPoints).fill(0));

    for (let i = 0; i < this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {
        if (i === j) {
          P[i][j] = 0;
        } else {
          const dist = createVector(this.data[i]).sub(this.data[j]).abs2;
          P[i][j] = Math.exp(-dist / (2 * sigma * sigma));
        }
      }
      // Normalize to make sum of P[i] equal to 1
      const sum = P[i].reduce((a, b) => a + b, 0) + 1; // Add 1 for P[i][i]
      for (let j = 0; j < this.numPoints; j++) {
        if (i !== j) {
          P[i][j] /= sum;
        }
      }
      P[i][i] = 0;
    }

    // Symmetrize P and normalize
    for (let i = 0; i < this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {
        P[i][j] = (P[i][j] + P[j][i]) / (2 * this.numPoints);
      }
    }

    return P;
  }

  private computeLowDimSimilarities(): number[][] {
    const Q = Array.from({ length: this.numPoints }, () => Array(this.numPoints).fill(0));

    // Compute pairwise affinities in low-dimensional space
    for (let i = 0; i < this.numPoints; i++) {
      for (let j = i + 1; j < this.numPoints; j++) {
        const distSq = createVector(this.X[i]).sub(this.X[j]).abs2;
        const val = 1 / (1 + distSq);
        Q[i][j] = val;
        Q[j][i] = val;
      }
    }

    // Compute normalization factor
    let sumQ = 0;
    for (let i = 0; i < this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {
        if (i !== j) {
          sumQ += Q[i][j];
        }
      }
    }

    // Normalize Q
    for (let i = 0; i < this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {
        if (i !== j) {
          Q[i][j] /= sumQ;
        }
      }
    }

    return Q;
  }

  private computeGradients(P: number[][], Q: number[][]): number[][] {
    const grads: number[][] = Array.from({ length: this.numPoints }, () => Array(this.dim).fill(0));

    for (let i = 0; i < this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {
        if (i === j) continue;
        const pq = P[i][j] - Q[i][j];
        for (let d = 0; d < this.dim; d++) {
          grads[i][d] += 4 * pq * (this.X[i][d] - this.X[j][d]);
        }
      }
    }

    return grads;
  }
}
