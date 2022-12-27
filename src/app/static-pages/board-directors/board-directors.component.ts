import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-board-directors',
  templateUrl: './board-directors.component.html',
  styleUrls: ['./board-directors.component.css']
})
export class BoardDirectorsComponent implements OnInit {
  response: any;

  constructor(private studentService: StudentService,public commonService: CommonService,
    ) { }

  ngOnInit(): void {
    this.getTeamsData();
  }

  getTeamsData() {
    this.studentService.getDirectors().subscribe(team => {
       this.response = team.data;
    })
  }
}
