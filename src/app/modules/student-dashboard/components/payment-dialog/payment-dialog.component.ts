import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild,Input  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

// Load services
import { AuthService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';

// Load Stripe Library
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  modalRef: BsModalRef;
  @Input() project_id:any;
  @Input() user_id:any;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  
  userid: any;
  // Card Payment
  isCardEmpty: boolean = true;
  stripeError: string = '';
  paymentForm: FormGroup;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private projectService: ProjectService,
    private stripeService: StripeService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userid = loggedInInfo?.user._id;

    this.paymentForm = this.fb.group({
    });
    console.log("project_id",this.project_id);
  }

  ngOnInit(): void {
  }

  closeModel()
  {
    this.bsModalRef.hide();
  }

  // Card Payment Api

  onChangeCardDetails(event: StripeCardElementChangeEvent) {
    this.isCardEmpty = event?.empty;
    this.stripeError = '';
    if (this.isCardEmpty) {
      this.stripeError = 'Please enter card details';
    }
    if (event.error?.message) {
      this.stripeError = event.error?.message;
    }
    else
    {

    }
  }
 
  onPayAction()
  {
    if (this.isCardEmpty) {
      this.stripeError = 'Please enter Card Details';
    }
    if (!this.isCardEmpty) {
      this.createToken();
    }
  }

  createToken(){
    this.stripeService.createToken(this.card.element).subscribe((result) => {
      if (result.token) {
        this.stripeError = '';
        // if (this.paymentForm.invalid) {
        //   return;
        // }
        this.onSubmitPayment(result.token.id);
      } else if (result.error) {
        this.stripeError = result.error.message;
      }
    });
  }

  onSubmitPayment(cardToken?) {
    const obj = {cardToken:cardToken,user_id:this.userid,project_id:this.project_id};
    this.projectService.payForpaidProject(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (err) => {
        this.toastrService.error('post not added');
      },
    );
  }

}
