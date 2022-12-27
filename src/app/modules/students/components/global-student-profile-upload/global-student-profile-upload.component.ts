import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { User } from 'src/app/core/models/user.model';
import { take } from 'rxjs/operators';

//Load services
import { CompressImageService } from '../../../../shared/image-compress/compress-image.service';

@Component({
  selector: 'app-global-student-profile-upload',
  templateUrl: './global-student-profile-upload.component.html',
  styleUrls: ['./global-student-profile-upload.component.css']
})
export class GlobalStudentProfileUploadComponent implements OnInit {
  user: User;
  @Input() redBorderImage = false;
  @Output() _emitter: EventEmitter<any> = new EventEmitter<any>();
  avatharImage: any;
  showUploadButton: boolean;
  uploadImageFormData: File;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private compressImage: CompressImageService,
    
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  avatarUpload(file: FileList) {
    let imageUpload: File = file[0];
    this.compressImage.compress(imageUpload)
      .pipe(take(1))
      .subscribe(compressedImage => {
        // now you can do upload the compressed image
        if(compressedImage.type == 'image/jpeg' || compressedImage.type == 'image/png' || compressedImage.type == 'image/jpg')
        {
          if(compressedImage && compressedImage) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
              console.log(compressedImage,event)
              this.avatharImage = event.target.result;
              this.showUploadButton = true;
            }
            reader.readAsDataURL(compressedImage);
            this.uploadImageFormData = compressedImage;
            this.changeProfile();
          }
        }
        else
        {
          this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
          return;
        } 
      })

    
  }
  
  changeProfile(){
    const fd = new FormData();
    console.log("this.uploadImageFormData ===>", this.uploadImageFormData)
    fd.append('files',  this.uploadImageFormData );
    fd.append('type', 'single');
    this.commonService
      .uploadImage(fd, ImageSource.AVATAR)
      .subscribe((res) => {
        console.log("res ==-=-=-==>> ", res)
        this.user.avatar = res;
        this.updateProfile();
      });
  }

  updateProfile() {
    this.commonService
      .uploadProfile({ avatar: this.user?.avatar })
      .subscribe((res) => {
        if (res) {

          this.commonService.$isAvatarChanged.next(true);
          this._emitter.emit("Profile Picture Uploaded");
          this.toastrService.success('Profile Picture Uploaded', '' , {timeOut: 3000});

          if(this.user.type == 'mentor')
          {         
              this.router.navigateByUrl('/mentors/profile');           
          }
          else if(this.user.type == 'student')
          {    
              this.router.navigateByUrl('/student/profile');         
          }
          this.showUploadButton = false; 
        }
      });
  }

  getUserDetails() {
    this.commonService.getUserDetails().subscribe((res) => {
      this.user = res;
      console.log(this.user?.avatar)
        this.avatharImage = this.commonService.imagePathS3(this.user?.avatar);
    });
  }

}
