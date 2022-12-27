import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef  } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-corousal-ten',
  templateUrl: './corousal-ten.component.html',
  styleUrls: ['./corousal-ten.component.css'],
})
export class CorousalTenComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent;
  @Input() mobile: boolean;
  @Input() homepageContent:any;
  
  public screenWidth: any;
  mobileView: boolean;
  slide = {};
  slidess: any;
  nextBt: any;
  prevBt: any;
  modalRef: BsModalRef;
  count: any;

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
  
  images = [
    {
      text: " Collegey’s professional development programs form the common ground for high school-higher ed collaborations",
      image: "/assets/images/10th/small.png"
    },
    {
      text: "Collegey Projects enable deep-dive partnerships that add value without being sales-y",
      image: "/assets/images/10th/small.png"
    },
    {
      text: "Adelphi University was thrilled to be a part of TGEP 2019. From the streamlined communications and planning process to the wonderfully engaged school representatives brought to campus, the event provided a great opportunity to network and identify strong educational opportunities to foster student success.– Adelphi University, USA"
      ,
      image: "/assets/images/10th/small.png"
    },
    {
      text:  "We found our group of counselors to be engaging, active learners who truly  wanted to get to know beyond the surface.  They were clearly a student  focused group of educators, interested in finding the best fit colleges/universities for their students.  The curiosity, energy, wisdom and charisma that the counselors brought was infectious.- Washington & Jefferson College, USA",
      image: "/assets/images/10th/small.png"
    }
  ]
  constructor(private element: ElementRef, private modalService: BsModalService) {
    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth);
    if (this.screenWidth < 500) {
      this.mobileView = true;
    }
    if (this.screenWidth >= 500) {
      this.mobileView = false;
    }
  }
  ngOnInit(): void {
    this.cardsSlider();
  }
  cardsSlider(): void {
    this.slidess = document.querySelectorAll('.card');
    this.nextBt = document.querySelector('.nextslide');
    this.prevBt = document.querySelector('.prevslide');
    this.count = 0;

   /*  this.nextBt.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.count < this.slidess.length - 1) {
        this.count++;

        for (let i = 0; i < this.slidess.length; i++) {
          let element = this.slidess[i],
            trans = 20 + element.clientWidth;

          this.slide = trans * this.count;

          element.style.transform = 'translateX(-' + this.slide + 'px)';
        }
      } 
    }); 

    this.prevBt.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.count > 0) {
        this.count--;

        for (let i = 0; i < this.slidess.length; i++) {
          let element = this.slidess[i],
            trans = 20 + element.clientWidth;
          this.slide = trans * this.count;

          element.style.transform = 'translateX(-' + this.slide + 'px)';
        }
      }
    });  */



  }
  nextSlide() {
    let oldClass = this.widgetsContent.nativeElement.className;
    this.widgetsContent.nativeElement.className =
      oldClass + ' arrow-animation-right';
  }

  previousSlide() {
    let oldClass = this.widgetsContent.nativeElement.className;
    this.widgetsContent.nativeElement.className =
      oldClass + ' arrow-animation-left';
  }

  videoPaly(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
  }
  videoPaly2(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
  }
}
