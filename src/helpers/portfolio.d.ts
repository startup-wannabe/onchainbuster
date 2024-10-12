export type CircularTreeNode = {
  type: 'node';
  value: number;
  name: string;
  children: Tree[];
};
export type CircularTreeLeaf = {
  type: 'leaf';
  name: string;
  value: number;
};

export type CircularTree = CircularTreeNode | CircularTreeLeaf;
