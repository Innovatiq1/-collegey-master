import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
//import { StudentService } from '../core/services/student.service';

@Component({
  selector: 'app-networkhub',
  templateUrl: './networkhub.component.html',
  styleUrls: ['./networkhub.component.css']
})
export class NetworkhubComponent implements OnInit {
  iframeSrc: any;
  id="43b2efaf-7258-4b47-99c1-94559b41462d"

  constructor( private sanitizer: DomSanitizer) { 

  }

  ngOnInit(): void {
    let url = 'https://embed.sequel.io/networkingHub/' + this.id;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
