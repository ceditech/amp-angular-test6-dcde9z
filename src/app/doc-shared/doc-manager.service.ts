import { Injectable } from '@angular/core';
import { FileMetadata, DocumentDetails, CustomMetadata } from './document-details';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class DocManagerService {
  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Download URL and Metadata
  downloadURL: Observable<string>;
  docMetadataObservable: Observable<any>;

  docMetadata: any;
  fileCustomMetadata: CustomMetadata;
  fileURL: string;

  // Document Being Loaded
  currentDocUpload: DocumentDetails = new DocumentDetails();;
  documentArray: any[];
  documentDetailsList: AngularFireList<any>;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private firebase: AngularFireDatabase) { }

  uploadDocument(event: FileList) {
    let filesIndex = _.range(event.length);
    //this.getDocumentDetailList();
    _.each(filesIndex, (docIndex) => {

      this.prepareUploadTask(event, docIndex);
      this.getDocumentDetailList();
      this.addDocumentDetails(this.currentDocUpload);
      this.documentDetailsList.snapshotChanges()
        .subscribe(
          list => {
            this.documentArray = list.map(item => item.payload.val());
            console.log("Document Details List: ", this.documentArray);
          }
        )
    });
  }


  // Prepare Upload Task
  prepareUploadTask(evt, index) {
    // The File object
    const file = evt.item(index)

    // The storage path
    const docPath = `test/${new Date().getTime()}_${file.name}`;

    // The Reference to the file
    const fileRef = this.storage.ref(docPath);

    // Totally optional metadata
    const customMetadata = { category: 'Public', createdBy: 'Cedric' };

    // The main task
    this.task = this.storage.upload(docPath, file, { customMetadata });

    // Progress Monitoring
    this.monitorUploadProgress(docPath, fileRef);
    this.initializeTheDocObject(this.currentDocUpload, file, customMetadata);
  }

  // File Upload Progress Monitoring function:
  monitorUploadProgress(path, reference) {
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();
    this.snapshot.pipe(
      // The file's download URL and Metadata
      finalize(async () => {
        this.fileURL = await reference.getDownloadURL().toPromise();
        this.docMetadata = await reference.getMetadata().toPromise();
        this.db.collection('files').add({ downloadURL: this.downloadURL, path });
      }),
      tap(console.log),
    );
  }

  getDocumentDetailList() {
    this.documentDetailsList = this.firebase.list("fileDetails");
  }
  addDocumentDetails(docDetails) {
    this.documentDetailsList.push(docDetails);
  }
  initializeTheDocObject(docObject: DocumentDetails, file, metadata) {
    docObject.name = file.name;
    docObject.size = file.size;
    docObject.type = file.type;
    docObject.timeCreated = new Date().toLocaleDateString();
    docObject.createdBy = metadata.createdBy;
    docObject.category = metadata.category;
  }

}
