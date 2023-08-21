import { Component, OnInit, Pipe } from '@angular/core';
import { StudentService } from '../core/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer ,SafeResourceUrl} from "@angular/platform-browser";



@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  @Pipe({ name: "safe" })
  eventData: any;
  id:any
  iframeSrc:any
  iframe1:any
  

  constructor(private studentService: StudentService,    private router: Router, private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    
   }

  ngOnInit(): void {
    console.log("======test")
    let id = this.route.snapshot.paramMap.get('id');
    this.id = this.route.snapshot.paramMap.get('id');

    console.log("=============",this.route.snapshot.paramMap.get('id'))
    
    let url ='https://embed.sequel.io/event/'+id
    this.iframeSrc=this.sanitizer.bypassSecurityTrustUrl(url)
    this.iframe1= this.iframeSrc.changingThisBreaksApplicationSecurity;
  // this.url =
    console.log("==xxxxxxxxxxxxxxx=",this.iframeSrc.changingThisBreaksApplicationSecurity)
    this.getSequelEventData();
  }
  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://embed.sequel.io/event/'+this.id
      //'https://embed.sequel.io/event/'
      //'https://admin.sequel.io/company/2df5b7bd-d748-43ec-8575-91cbb044850d/events/new'
      
      //'https://embed.sequel.io/company/2df5b7bd-d748-43ec-8575-91cbb044850d/events/new'
    );
  }  getSequelEventData() {
    
    // this.studentService.getSequelEventData1().subscribe(
    //   (response) => {
    //     console.log("========rest",response)
    //     this.eventData = response['data'];
        
    //   },
    //   (err) => {

    //   },
    // );
  }


}
