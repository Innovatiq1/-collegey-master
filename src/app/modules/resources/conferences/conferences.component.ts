import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-resources-conferences',
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferencesComponent implements OnInit {
  @Input() showRecords = 0;

  constructor() {}

  ngOnInit(): void {}
}
