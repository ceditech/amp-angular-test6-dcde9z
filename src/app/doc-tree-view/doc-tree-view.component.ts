import { DocManagerService } from './../doc-shared/doc-manager.service';
import { Component, OnInit } from '@angular/core';
import { FlatTreeNode, FileNode } from './../doc-shared/document-details';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DocTreeDataSourceMapping } from './../doc-shared/doc-tree-data';

@Component({
  selector: 'app-doc-tree-view',
  templateUrl: './doc-tree-view.component.html',
  styleUrls: ['./doc-tree-view.component.scss']
})
export class DocTreeViewComponent implements OnInit {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  /** File source. */
  docSource: DocTreeDataSourceMapping;

  constructor(private service: DocManagerService) {

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.docSource = new DocTreeDataSourceMapping();

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    //this.dataSource.data = this.docSource.docFiles;
  }

  ngOnInit() {
    this.service.documentDetailsList.snapshotChanges().subscribe(
      list => {
        const docDataItem = list.map(item => item.payload.val());
        const docDetailsData: FileNode[] = this.docSource.returnTreeData(docDataItem);
        console.log(docDetailsData);
        this.dataSource.data = docDetailsData;
      })
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return observableOf(node.children);
  }

}
