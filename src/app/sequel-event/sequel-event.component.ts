import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-sequel-event',
  templateUrl: './sequel-event.component.html',
  styleUrls: ['./sequel-event.component.css']
})
export class SequelEventComponent implements OnInit {

  // Assign the event data
  eventData:any;
  constructor(
    private studentService: StudentService,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getSequelEventData();
  }

  getSequelEventData() {
    let obj = {};
    this.studentService.getSequelEventData().subscribe(
      (response) => {
        this.eventData = response;
      },
      (err) => {
       
      },
    );
    
  }


}
