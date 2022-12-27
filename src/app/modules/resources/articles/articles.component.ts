import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Resource } from '../../../core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-resources-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
})
export class ArticlesComponent implements OnInit {
  @Input() articles: Resource[] = [];
  @Input() showRecords = 0;
s
  constructor(
    public commonService: CommonService,
    private resourcesService: ResourcesService,
  ) {
  }

  ngOnInit(): void {
  }

}
