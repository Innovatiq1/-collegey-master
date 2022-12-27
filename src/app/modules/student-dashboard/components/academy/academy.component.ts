import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Resource } from 'src/app/core/models/resources.model';
import { CommonService } from 'src/app/core/services/common.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeyFeedService } from 'src/app/core/services/collegey-feed.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css']
})
export class AcademyComponent implements OnInit {
  articles: Resource[] = [];
  queryParams: { [key: string]: string | number };
  recommendationForm: FormGroup;
  submitted: boolean = false;
  constructor(
    private FormBuilder: FormBuilder,
    private collegeyFeedService: CollegeyFeedService,
    private toaster: ToastrService,
    public commonService: CommonService,
    private resourcesService: ResourcesService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  )
  { 
    this.queryParams = { ...AppConstants.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit(): void {
    this.getArticles(this.queryParams);
    this.recommendForm();
  }

  getArticles(params?: {}) {
    params['limit'] = 4;
    this.resourcesService.getArticles(params).subscribe(article => {
      this.articles = article.data.docs;
    });
  }

  onNavigate(slug) {
    this.resourcesService.navigateToBlogDetail(slug);
  }
  recommendForm() {
    this.recommendationForm = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      email_id: ["", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  
  recommendationFormSubmit() {
    this.submitted = true;
    if (this.recommendationForm.invalid) {
      return;
    }

    let data = {
      name: this.recommendationForm.value.name,
      email_id: this.recommendationForm.value.email_id
    }
    this.collegeyFeedService.recommendSave(data).subscribe(
      (res: any) => {
        this.submitted = false;
        this.recommendationForm.reset();
        this.toaster.success('Recommendation Saved Successfully');
      },
      (err: any) => {
        //  console.log(err);
      }
    );
  }

  public hasErrorRecommendedForm = (controlName: string, errorName: string) => {
    return this.recommendationForm.controls[controlName].hasError(errorName);
  };

}
