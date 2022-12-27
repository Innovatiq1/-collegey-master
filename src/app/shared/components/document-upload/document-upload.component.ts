import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { ToastrService } from 'ngx-toastr';
import { Utils } from '../../Utils';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  KnowYouBetter,
  CommonKnowYouBetter,
} from 'src/app/core/models/student-profile.model';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit, OnChanges {
  
  @Input() documentList = [];
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFileUploadSuccess = new EventEmitter();

  inValidFileSize = false;
  completeNameDocumentList = [];
  favouriteWebsitesFormArray: FormArray;


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService
  ) { }
    
  onSelectDocument(event) {
    const fileList = [];
    this.inValidFileSize = false;
    // called each time file input changes
    if (event.target.files && event.target.files.length > 0) {
      const input = event.target;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < input.files.length; i++) {
        const filesize = +((input.files[i].size / 1024) / 1024).toFixed(4);
        if(filesize > 5) {
          this.inValidFileSize = true;
          return;

        } else {
          fileList.push(input.files[i]);
        }
        // this.documentList.push(input.files[i].name);
      }
      const formData = new FormData();
      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append('files', file);
        });
      }
      if (fileList.length > 1) {
        formData.append('type', 'array');
      } else {
        formData.append('type', 'single');
      }

      this.uploadDocument(formData);
    }
  }

  ngOnChanges() {
    this.completeNameDocumentList = this.documentList;
    this.documentList = [];
    if(this.completeNameDocumentList.length > 0) {
      this.completeNameDocumentList.forEach(file => {
        this.documentList.push(file.slice(27));
      });
    }
  }

  uploadDocument(formData) {
    // this.documentList = [];
    this.commonService.uploadImage(formData , ImageSource.PROFILE_DOCS).subscribe(file => {
        // this.onFileUploadSuccess.emit(file);
        if(file instanceof Array) {
          file.forEach(document => {
            this.documentList.push(document.slice(27));
            this.completeNameDocumentList.push(document);
          });
        } else {
          this.documentList.push(file.slice(27));
          this.completeNameDocumentList.push(file);
        }
        this.onFileUploadSuccess.emit(this.completeNameDocumentList);
        this.toastrService.success('Document added');
    });
  }

  addKnowYouBetterFromGroup(object?: CommonKnowYouBetter): FormGroup {
    return this.fb.group({
      name: [object ? object.name : null],
    });
  }

  onAddWebsite(): void {
    // if (this.favouriteWebsitesFormArray.length > 2) {
    //   return;
    // }
    this.favouriteWebsitesFormArray.push(this.addKnowYouBetterFromGroup());
    console.log(this.favouriteWebsitesFormArray)
  }

  onRemoveDocument(index) {
    this.documentList.splice(index,1);
    this.completeNameDocumentList.splice(index,1);
    this.onFileUploadSuccess.emit(this.documentList);
    this.onFileUploadSuccess.emit(this.completeNameDocumentList);
  }
  ngOnInit(): void {
  }

}
