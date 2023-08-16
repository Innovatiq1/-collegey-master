import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../core/services/student.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit {

  loadmore: boolean = false;
  eventData: any = [];
  EndDate: any;
  projectEndDate: any;
  upcomingEvents: any = [];
  pastEvents: any = [];
  constructor(private studentService: StudentService, private datePipe: DatePipe,
    private router: Router,
  ) {interval(60000).subscribe(x => {
    console.log("==========test")
    this.pastEvents=[]
    this.getSequelEventData();
}); }
  ngOnInit(): void {
    this.loadmore = false;
    this.getSequelEventData();
  }

  getSequelEventData() {
    let obj = {};
    var myDateSet = new Date(new Date());
    var projEndDate = new Date();
    projEndDate.setDate(myDateSet.getDate());
    var newprojEndDateSet = this.datePipe.transform(projEndDate, 'yyyy-MM-dd HH:mm');
    this.studentService.getSequelEventData().subscribe(
      (response) => {
        if (response['data'] !== undefined && response['data'].length > 0) {
          this.eventData = response['data'];
          if (this.eventData.length > 0) {
            this.eventData.forEach((file) => {
              console.log("past",this.pastEvents)

              this.EndDate = moment(file.startDate).format('YYYY-MM-DD HH:mm');
              if (this.EndDate <= newprojEndDateSet) {
                this.pastEvents.push(file);
              }
            });
          }
        }
      },
      (err) => {

      },
    );
  }
  redirectToSequelPage(url: any) {
    // let url1 = "https://app.sequel.io/event/" + url.uid
    // console.log(url1);
    // window.location.href = url1;
    let id=url.uid
    this.router.navigateByUrl('/event/'+id)
    

  }
  // goToLoad(pagename: string): void {
  //   this.loadmore = true;
  //   // this.router.navigate([`${pagename}`])
  // }
  // goToCards(pagename: string): void {
  //   this.router.navigate([`${pagename}`])
  // }

}