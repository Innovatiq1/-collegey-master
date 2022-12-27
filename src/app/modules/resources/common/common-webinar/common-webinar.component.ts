import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-common-webinar',
  templateUrl: './common-webinar.component.html',
  styleUrls: ['./common-webinar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonWebinarComponent implements OnInit, OnDestroy {

  @Input() webinars: Resource[] = [];


 
  modalRef: BsModalRef;
  webinarVideoUrl: any;
  @ViewChild('video')
  video: ElementRef;

  constructor(
    private modalService: BsModalService,
    private domSanitizer: DomSanitizer,
    public commonService: CommonService    
  ) {

  }

  ngOnInit(): void {
 
  }
  

  ngOnDestroy() {
    if(this.modalRef) {
      this.modalRef.hide();
    }
  }

  getYoutubeUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  convertToEmbedCode(url) {
    const videoId = this.getYoutubeUrl(url);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  openModal(template: TemplateRef<any>, webinar) {
    this.webinarVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedCode(webinar.video_url));
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-edit-width");
  }

}
