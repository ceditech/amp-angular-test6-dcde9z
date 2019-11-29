import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "Document Manager App";

  constructor(private modalService: NgbModal) { }

  openDocUploadModal(content) {
    this.modalService.open(content, { centered: true });
  }

}
