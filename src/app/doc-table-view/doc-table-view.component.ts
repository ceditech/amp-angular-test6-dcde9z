import { FileSizePipe } from './../file-size.pipe';
import { FileMetadata, DocumentDetails } from './../doc-shared/document-details';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DocManagerService } from '../doc-shared/doc-manager.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-doc-table-view',
  templateUrl: './doc-table-view.component.html',
  styleUrls: ['./doc-table-view.component.scss']
})
export class DocTableViewComponent implements OnInit {
  documentDetails: any[];
  docNumber: number;
  docMetadata: any = {};
  displayedColumns: string[] = ['name', 'size', 'category', 'createdBy', 'timeCreated'];
  dataSource: MatTableDataSource<DocumentDetails>;
  fileSize: FileSizePipe;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private service: DocManagerService) { }

  ngOnInit() {
    this.service.getDocumentDetailList();
    this.documentDetails = this.service.documentArray;
    this.service.documentDetailsList.snapshotChanges()
      .subscribe(
        list => {
          this.documentDetails = list.map(item => item.payload.val());
          this.docNumber = this.documentDetails.length;

          this.dataSource = new MatTableDataSource(this.documentDetails);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      )
  }
  filterDocList(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDocMetadata(row) {
    this.fileSize = new FileSizePipe();
    this.docMetadata = { "title": row.name, "size": this.fileSize.transform(row.size, false), "author": row.createdBy };
    console.log(this.docMetadata, this.docMetadata.title);
  }

}
