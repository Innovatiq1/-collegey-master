import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StudentService } from 'src/app/core/services/student.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/services/common.service';
declare const myTest: any;

@Component({
  selector: 'app-corousal-seven',
  templateUrl: './corousal-seven.component.html',
  styleUrls: ['./corousal-seven.component.css'],
})
export class CorousalSevenComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @Input() mobile: boolean;
  @Input() homepageContent:any;
  
  public screenWidth: any;
  mobileView: boolean;
  slide = {};
  id?: number;
  slides: any;
  modalRef: BsModalRef;
  nextBtn: any;
  prevBtn: any;
  count: any;
  response: any;

  customOptions: OwlOptions = {
    loop: false,
    dots: false,
    nav: true,
    navSpeed: 700,
    navText: ['<', '>'],
    stagePadding: 100,
    margin: 30,
    items: 2,
    responsive: {
      0: {
        items: 1,
        margin: 10,
        stagePadding: 8,
      },
      600: {
        items: 1,
        stagePadding: 50,
      },
      1100: {
        items: 2
      }
    }
  }

  
  private ngUnsubscribe = new Subject();

  // Assign Video Player
  currentvideoUrl: any;

  constructor(private element: ElementRef, private modalService: BsModalService, public sanitizer: DomSanitizer, private studentService: StudentService,
    public commonService: CommonService) {
    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth);
    if (this.screenWidth < 500) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 500) {
      this.mobileView = false;
    }
  }
  openURL() {
    const urlToOpen = 'https://form.typeform.com/to/QCfOu6ND'; // Replace with your desired URL
    window.open(urlToOpen, '_blank');
  }

  ngOnInit(): void {
    this.cardsSlider();
    this.getAllReviews();
  }

  onClick() {
    myTest();
  }

  cardsSlider(): void {
    this.slides = document.querySelectorAll('.card-item');
    this.nextBtn = document.querySelector('.next');
    this.prevBtn = document.querySelector('.prev');
    this.count = 0;

    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.count < this.slides.length - 1) {
        this.count++;

        for (let i = 0; i < this.slides.length; i++) {
          let element = this.slides[i],
            trans = 63 + element.clientWidth;

          this.slide = trans * this.count;
          if (this.mobileView) {
            let element = this.slides[i],
              trans = 15 + element.clientWidth;

            this.slide = trans * this.count;
          }
          element.style.transform = 'translateX(-' + this.slide + 'px)';
        }
      }
    });

    this.prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.count > 0) {
        this.count--;

        for (let i = 0; i < this.slides.length; i++) {
          let element = this.slides[i],
            trans = 20 + element.clientWidth;
          this.slide = trans * this.count;

          element.style.transform = 'translateX(-' + this.slide + 'px)';
        }
      }
    });
  }

  nextSlide() {
    let oldClass = this.widgetsContent.nativeElement.className;
    if (oldClass == 'undefined') {
      oldClass = "";
    }
    this.widgetsContent.nativeElement.className = oldClass + ' arrow-animation-right';

    //this.widgetsContent.nativeElement.scrollLeft += 150; 
  }

  previousSlide() {
    //console.log("Back :", this.widgetsContent);
    let oldClass = this.widgetsContent.nativeElement.className;
    if (oldClass == 'undefined') {
      oldClass = "";
    }
    this.widgetsContent.nativeElement.className = oldClass + ' arrow-animation-left';
    //this.widgetsContent.nativeElement.scrollLeft -= 550;
  }

  getAllReviews() {
    this.studentService.getReview().pipe(takeUntil(this.ngUnsubscribe)).subscribe(review => {
      this.response = review.data;
      for (let j = 0; j < this.response.length; j++) {
        var youlink = this.response[j].url;
        this.response[j].url = this.getUrl(youlink);
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getUrl(val) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }

  currentVideoPlay(template: TemplateRef<any>, url) {
    this.currentvideoUrl = this.getUrl(url);
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg', ignoreBackdropClick: true });
  }

}

