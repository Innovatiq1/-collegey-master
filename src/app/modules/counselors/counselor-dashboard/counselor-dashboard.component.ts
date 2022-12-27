import { Component, OnInit, TemplateRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CounselorService } from 'src/app/core/services/counselor.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CounselorDetail } from 'src/app/core/models/counselor.model';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-counselor-dashboard',
  templateUrl: './counselor-dashboard.component.html',
  styleUrls: ['./counselor-dashboard.component.css'],
})
export class CounselorDashboardComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  invitationWithEmail: FormGroup;
  invitationWithFile: FormGroup;

  inValidFileSize = false;

  multipleEmailId = [];
  selectedFile: string;
  showErrorMessage = false;

  counselorDetails: CounselorDetail;
  emailValidateMsg = false;
  isWelcomeModalShown = false;


  @ViewChild('welcomeCounselorModal', { static: false }) welcomeCounselorModal: ModalDirective;


  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private counselorService: CounselorService,
    private fileSaverService: FileSaverService,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute

  ) {}

  addTagFn(name) {
    return { name };
  }

  openInviteStudentModal(template: TemplateRef<any>) {
    this.invitationWithFile.patchValue({
      file: []
    });
    this.selectedFile = '';
    this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
    this.modalRef.setClass('modal-small-width');
  }


  _getCounselorDetail() {
    this.counselorService.getCounselorDetails().subscribe(response =>{
      this.counselorDetails = response;
    });
  }

  downloadSampleFile() {
    const fileName = 'Invitation_sample.xlsx';
    this.httpClient.get(`assets/files/Invitation_sample.xlsx`, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this.fileSaverService.save(res.body, fileName);
    });
  }

  onHiddenWelcomeModal() {
      this.welcomeCounselorModal.hide();
  }

  ngOnInit(): void {
    this._getCounselorDetail();
    this.invitationWithEmail = this.fb.group({
      emails: [null, [Validators.required]],
      message: [AppConstants.INVITATION_MESSAGE, [Validators.required, Validators.maxLength(400)]],
    });

    this.invitationWithFile = this.fb.group({
      message: [AppConstants.INVITATION_MESSAGE, [Validators.required, Validators.maxLength(400)]],
      file: [null, Validators.required],
    });

    this.activatedRoute.queryParams.subscribe(params=>{
      if(params && params.returnUrl === 'counselor-dashboard') {
        this.isWelcomeModalShown = true;
      }
    })

    this.onEmailValueChange();
  }

  onEmailValueChange() {
    this.invitationWithEmail.get('emails').valueChanges.subscribe(email => {
      this.emailValidateMsg = false;
      if(this.showErrorMessage) {
        this.splitEmailToArray(email);
      }
    });

  }

  validateEmail(email) {
    const regex = AppConstants.EMAIL_PATTERN;
    return regex.test(String(email).toLowerCase().trim());
  }

  splitEmailToArray(emails) {
    const emailAsArray = emails.split(',');
    emailAsArray.forEach(email => {
      if(!this.validateEmail(email)) {
        this.emailValidateMsg = true;
      }
  });
  }

  sendInvitation(sendParam = 'email' || 'file', template: TemplateRef<any>) {
    const formData = new FormData();

    if (sendParam === 'email') {
      this.invitationWithEmail.markAllAsTouched();
      this.emailValidateMsg = false;
      if (this.invitationWithEmail.invalid) {
        this.showErrorMessage = true;
        return;
      }
      const data = this.invitationWithEmail.getRawValue();
      this.splitEmailToArray(data.emails);
      if(this.emailValidateMsg) {
        return;
      }
      formData.append('message', data.message);
      formData.append('emails', data.emails);
    } else if (sendParam === 'file') {
      this.invitationWithFile.markAllAsTouched();
      if (this.invitationWithFile.invalid) {
        this.showErrorMessage = true;
        return;
      }
      const data = this.invitationWithFile.getRawValue();
      formData.append('message', data.message);
      if (data.file) {
        formData.append('file', data.file);
      }
    }

    this.counselorService.onSendInvitation(formData).subscribe((response) => {
      if (sendParam === 'file') {
        this.modalRef.hide();
      }
      this.modalRef = this.modalService.show(template,{ class: 'gray modal-lg', ignoreBackdropClick: true});
      this.modalRef.setClass('modal-small-width');
      this.counselorDetails.total_invitations = response.total_invitations;
      this.invitationWithEmail.patchValue({
        emails: []
      });
      this.invitationWithEmail.markAsUntouched();
    });
  }

  onSelectFile(files: FileList) {
    this.inValidFileSize = false;
    if (files && files.length > 0) {
      const file = files[0];
      const filesize = +(file.size / 1024 / 1024).toFixed(4);
      if (filesize > 10) {
        this.inValidFileSize = true;
        return;
      }
      this.selectedFile = file.name;
      this.invitationWithFile.patchValue({
        file,
      });
    }
  }

  removeFile() {
    this.selectedFile = '';
    this.invitationWithFile.patchValue({
      file: null,
    });
  }

  ngOnDestroy(): void {
    if(this.modalRef) {
      this.modalRef.hide();
    }
  }
}
