import { FileNode } from './document-details';
export class DocTreeDataSourceMapping {
    docDataItem: FileNode[];
    constructor() { }

    returnTreeData(docSource: any[]) {
        this.docDataItem = [];
        let treeData: FileNode[];
        docSource.forEach(element => {
            this.docDataItem.push({ name: element.name, type: "file" });
            treeData = [
                {
                    name: "Documents",
                    type: "folder",
                    children: [
                        {
                            name: (element.category === 'Public') ? 'Public Documents' : 'Private Documents',
                            type: 'folder',
                            children: this.docDataItem
                        },
                        { name: 'Private Documents', type: 'folder' }
                    ]
                }
            ];
        });
        return treeData;
    }
}