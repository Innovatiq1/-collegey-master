import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-meet-the-team',
  templateUrl: './meet-the-team.component.html',
  styleUrls: ['./meet-the-team.component.css']
})
export class MeetTheTeamComponent implements OnInit {
  response: any = [];
  teamTitle:any

  constructor(private studentService: StudentService,public commonService: CommonService,
    ) { }

  ngOnInit(): void {
    this.getTeamsData();
    this.dynamicTitle()
  }

  getTeamsData() {
    this.studentService.getTeam().subscribe((team:any) => {
      for(let i = 0; i<team.data.length;i++){
        if(team.data[i].active == true){
          this.response.push(team.data[i]);          
        }
      }
      //  this.response = team.data;
            
    })
  }

  dynamicTitle(){
    this.studentService.getTitleData().subscribe(res => {
      this.teamTitle=res.data[0];
    })
  }

}
