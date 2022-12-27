import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsComponent implements OnInit {
 
  private ngUnsubscribe = new Subject();
  response: any;

    constructor(
      public sanitizer:DomSanitizer,
      private studentService: StudentService
    ){ }

  ngOnInit(): void {    
    this.getTerms();
  }

  getTerms() {
    this.studentService.getTerms().pipe(takeUntil(this.ngUnsubscribe)).subscribe(termsservice => {
      this.response = termsservice.data[0];
      console.log(this.response)
    })
  }


}
