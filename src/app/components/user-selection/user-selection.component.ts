import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.css'],
})
export class UserSelectionComponent implements OnInit {
  student: boolean = true;
  other: boolean = true;
  constructor(private router: Router) {}
  ngOnInit(): void {}

  studentSelection() {
    localStorage.setItem("user_type",'student');
    this.other = true;
    this.student = !this.student;
    this.router.navigateByUrl('/user-profile');
  }
  otherSelection() {
      localStorage.setItem("user_type",'mentor');
      this.student = true;
      this.other   = !this.other; 
      setTimeout(() => {
        this.router.navigateByUrl('/user-profile');
      }, 1000);
  }
}
