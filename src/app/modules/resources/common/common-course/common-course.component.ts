import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-common-course',
  templateUrl: './common-course.component.html',
  styleUrls: ['./common-course.component.css']
})
export class CommonCourseComponent implements OnInit {
  @Input() Courses: Resource[] = [];
  constructor(public commonService: CommonService) {}

  ngOnInit(): void {
  }

}
