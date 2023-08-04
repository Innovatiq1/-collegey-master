import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  id: number;
  title: string;
  description: string;
  projectEndDate: any;
  upcomingEvents: any = [];
  pastEvents: any = [];
  constructor(private studentService: StudentService, private datePipe: DatePipe,
    private router: Router, private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.loadmore = false;
    this.getSequelEventData();
    this.route.queryParams.subscribe(params => {
      const id = params['cardsdata'];
      const name = params['pagename'];
    });
  }

  getSequelEventData() {
    let obj = {};
    var myDateSet = new Date(new Date());
    var projEndDate = new Date();
    projEndDate.setDate(myDateSet.getDate());
    var newprojEndDateSet = this.datePipe.transform(projEndDate, 'yyyy-MM-dd HH:mm');
    this.studentService.getSequelEventData().subscribe(
      (response) => {
        console.log("event", response);
        if (response['data'] !== undefined && response['data'].length > 0) {
          this.eventData = response['data'];
          if (this.eventData.length > 0) {
            this.eventData.forEach((file) => {
             console.log(file.startDate)
              
              this.EndDate = moment(file.startDate).format("YYYY-MM-DD HH:mm");
              console.log("mian",moment(file.startDate).format('YYYY-MM-DD HH:mm'))
              console.log("Test",newprojEndDateSet)
              if (this.EndDate >= newprojEndDateSet) {
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

  // goToCards(cardsdata,pagename: string): void {
  //   console.log("navdata",cardsdata)
  //   console.log(pagename)
  //   this.router.navigate(['/cards'],{queryParams:cardsdata});

  //   }
  redirectToSequelPage(url: any) {
    let id=url.uid
    this.router.navigateByUrl('/event/'+id)
    ///let url1 = "https://app.sequel.io/event/" + url.uid


    // window.location.href = url1;


  }
}
