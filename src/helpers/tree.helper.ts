import type {
  CircularTree,
  CircularTreeLeaf,
  CircularTreeNode,
} from './portfolio';

export class TreeBuilder {
  tree: CircularTreeNode;
  constructor(chainName: string, totalChainValue: number) {
    this.tree = {
      type: 'node',
      name: chainName,
      value: totalChainValue,
      children: [],
    };
  }

  addNewChildren(children: CircularTree) {
    this.tree.children.push(children);
  }

  build(): CircularTree {
    if (this.tree.children.length === 0)
      return <CircularTreeLeaf>{
        name: this.tree.name,
        value: this.tree.value,
        type: 'leaf',
      };
    return this.tree;
  }
}
