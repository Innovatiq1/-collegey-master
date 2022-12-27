import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-board-advisors',
  templateUrl: './board-advisors.component.html',
  styleUrls: ['./board-advisors.component.css']
})
export class BoardAdvisorsComponent implements OnInit {
  response: any;

  constructor(private studentService: StudentService,public commonService: CommonService,
    ) { }

  ngOnInit(): void {
    this.getTeamsData();
  }

  getTeamsData() {
    this.studentService.getAdvisors().subscribe(team => {
       this.response = team.data;
    })
  }

}
