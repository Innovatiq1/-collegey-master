import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { StudentService } from '../core/services/student.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  private preventNavigation = false;
  eventData: any;
  id: any;
  iframeSrc: any;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    let url = 'https://embed.sequel.io/event/' + this.id;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

