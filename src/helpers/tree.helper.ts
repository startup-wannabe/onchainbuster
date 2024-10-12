export class TreeBuilder {
  tree: TCircularTreeNode;
  constructor(chainName: string, totalChainValue: number) {
    this.tree = {
      type: 'node',
      name: chainName,
      value: totalChainValue,
      children: [],
    };
  }

  addNewChildren(children: TCircularTree) {
    this.tree.children.push(children);
  }

  build(): TCircularTree {
    if (this.tree.children.length === 0)
      return <TCircularTreeLeaf>{
        name: this.tree.name,
        value: this.tree.value,
        type: 'leaf',
      };
    return this.tree;
  }
}
