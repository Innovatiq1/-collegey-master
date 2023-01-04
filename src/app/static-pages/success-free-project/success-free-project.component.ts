import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-free-project',
  templateUrl: './success-free-project.component.html',
  styleUrls: ['./success-free-project.component.css']
})
export class SuccessFreeProjectComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  navigateProjectSection() {
    this.router.navigateByUrl('/student-dashboard/$/project');
  }

}
