export interface CustomMetadata {
    category: string;
    createdBy: string;
}

export interface FileMetadata {
    customMetadata: CustomMetadata;
}

export interface FileNode {
    name: any;
    type: any;
    children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
    name: string;
    type: string;
    level: number;
    expandable: boolean;
}

export class DocumentDetails {
    name: string;
    url: string;
    size: number;
    type: string;
    timeCreated: any;
    category: string;
    createdBy: string;
    metadata: FileMetadata;

    constructor() { }
}
