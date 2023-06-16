import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Button } from 'protractor';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-sequel-event',
  templateUrl: './sequel-event.component.html',
  styleUrls: ['./sequel-event.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SequelEventComponent implements OnInit {

  // Assign the event data
  eventData: any;
  constructor(
    private studentService: StudentService,
    public commonService: CommonService,
    private router: Router

  ) { }

  setTab(tabname: string) {
    this.router.navigate([`/${tabname}`]);
  }

  ngOnInit(): void {

  }


}


