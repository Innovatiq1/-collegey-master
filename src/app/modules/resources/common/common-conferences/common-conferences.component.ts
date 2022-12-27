import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-common-conferences',
  templateUrl: './common-conferences.component.html',
  styleUrls: ['./common-conferences.component.css']
})
export class CommonConferencesComponent implements OnInit, OnDestroy {

  conferences: Resource[] = [];
  @Input() showRecords = 0;
  @Input() queryParams: { [key: string]: string | number };
  totalConferences: number;
  currentPage = 1;
  modalRef: BsModalRef;
  conferenceVideoUrl: any;
  @ViewChild('video')
  video: ElementRef;
  hidePagination = false;

  constructor(
    private modalService: BsModalService,
    private domSanitizer: DomSanitizer,
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      this.currentPage = +params['page'];
      this.getConferences(this.queryParams);
    });
    if(this.route.url === '/magazine/conference' || this.route.url === `/magazine/conference?page=${this.currentPage}`) {
      this.hidePagination = true;
    }
  }


  getConferences(params?: {}) {
    this.resourcesService.getConferences(params).subscribe(conference => {
      this.conferences = conference.data.docs;
      this.totalConferences =  conference.data.totalDocs;
      if (this.showRecords) {
        this.conferences = this.conferences
          .slice(0, this.showRecords);
      }
    });
  }

  loadMore(event: any) {
    console.log(event);
    this.currentPage = event.page;
    this.queryParams = { ...this.queryParams, page: this.currentPage };
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
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

  openModal(template: TemplateRef<any>, conference) {
    this.conferenceVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedCode(conference.redirect_link));
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass("modal-edit-width");
  }
}
