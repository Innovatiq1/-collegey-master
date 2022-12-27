import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ConfirmedValidator } from '../validators/confirmed.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-my-badge',
  templateUrl: './my-badge.component.html',
  styleUrls: ['./my-badge.component.css']
})
export class MyBadgeComponent implements OnInit {
 
  userId: any;
  userInfo: User = new User();
  myBadge: any;
  myBadgeList: any;

  constructor( private fb: FormBuilder,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private studentService: StudentService,
    private router:Router
    ) { }

  ngOnInit(): void {
   const loggedInInfo = this.authService.getUserInfo();
   this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
   this.userId = this.userInfo._id;
   
     this.getMyBadge();
  }
 
  getMyBadge(){
    let data = {
      id: this.userId
    }
   // console.log('id : ',data)
    this.studentService.getMyBadge(data).subscribe(result => {
      this.myBadge = result;
      this.myBadgeList = this.myBadge.data;
      // console.log("result : ",this.myBadgeList);
       // this.toastrService.success('Password Changed Successfully') 
    })
  }
}
