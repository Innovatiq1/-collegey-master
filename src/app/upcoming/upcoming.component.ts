import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../core/services/student.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {

  loadmore: boolean = false;
  eventData: any = [];
  EndDate: any;

  projectEndDate: any;
  upcomingEvents: any = [];
  pastEvents: any = [];
  constructor( private studentService: StudentService, private datePipe: DatePipe,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.loadmore = false;
    this.getSequelEventData();    
  }

  getSequelEventData() {
    let obj = {};    
    var myDateSet = new Date(new Date());
    var projEndDate = new Date();
    projEndDate.setDate(myDateSet.getDate());
    var newprojEndDateSet = this.datePipe.transform(projEndDate, 'yyyy-MM-dd');
    this.studentService.getSequelEventData().subscribe(
      (response) => {
        if(response['data'] !== undefined && response['data'].length > 0){
          this.eventData = response['data'];
          if (this.eventData.length > 0) {
            this.eventData.forEach((file) => {
              this.EndDate = moment(file.startDate).format('YYYY-MM-DD');
              if(this.EndDate > newprojEndDateSet){
                this.upcomingEvents.push(file);
              }
            });
          }
        }
      },
      (err) => {

      },
    );
  }
  // goToLoad(pagename: string): void {
  //   this.loadmore = true;
    // this.router.navigate([`${pagename}`])
  // }
  // goToCards(pagename: string): void {
  //   this.router.navigate([`${pagename}`])
  // }
  openNewURL(){

    window.open("/events", '_blank');

   }
}