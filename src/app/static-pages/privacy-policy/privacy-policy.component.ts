import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit {
  
  private ngUnsubscribe = new Subject();
  response: any;

    constructor(
      public sanitizer:DomSanitizer,
      private studentService: StudentService
    ){ }

  ngOnInit(): void {
    this.getPrivacy();
  }
    
  getPrivacy() {
    this.studentService.getPrivacy().pipe(takeUntil(this.ngUnsubscribe)).subscribe(resultprivacy => {
      this.response = resultprivacy.data[0];
      console.log("privacy details : ",this.response)
    })
  }


}
