import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  template: `
              <div class = "cards">
              <h3>{{ event.name }}</h3>
              <p>{{ event.description }}</p>
              </div>
  `,
})
export class CardsComponent implements OnInit {

  @Input () event : any;
  // router: any;

  constructor(
    private router : Router
  ) {

   }

  ngOnInit(): void {
  }
redirectToSequelPage(){
  this.router.navigate(['/target-page']);
}
redirectToExternalURL(){
  const externalURL = 'https://app.sequel.io/event/62abbd10-caf4-4316-b133-83c3cf2f6eb4';
  window.open(externalURL, '_blank')
  // window.location.href = 'https://app.sequel.io/event/62abbd10-caf4-4316-b133-83c3cf2f6eb4';
}
}
