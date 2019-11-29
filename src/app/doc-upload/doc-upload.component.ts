import { DocManagerService } from './../doc-shared/doc-manager.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from "lodash";


@Component({
  selector: 'doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent {

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string // Observable<string>;
  isHovering: boolean;

  constructor(private docService: DocManagerService) { }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    this.docService.uploadDocument(event);
    this.percentage = this.docService.percentage;
    this.snapshot = this.docService.snapshot;
    this.downloadURL = this.docService.fileURL;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

}

