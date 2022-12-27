import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-common-programmes',
  templateUrl: './common-programmes.component.html',
  styleUrls: ['./common-programmes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonProgrammesComponent implements OnInit {
  @Input() programmes: Resource[] = [];

  constructor(public commonService: CommonService) {}
  
  ngOnInit() {}
}
