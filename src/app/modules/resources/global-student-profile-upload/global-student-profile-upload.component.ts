import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-global-student-profile-upload',
  templateUrl: './global-student-profile-upload.component.html',
  styleUrls: ['./global-student-profile-upload.component.css']
})
export class GlobalStudentProfileUploadComponent implements OnInit {
  user: User;
  @Input() redBorderImage = false;
  avatharImage: any;
  showUploadButton: boolean;
  uploadImageFormData: File;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  avatarUpload(file: FileList) {

    if(file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg')
    {
      if(file && file[0]) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(file[0],event)
          this.avatharImage = event.target.result;
          this.showUploadButton = true;
        }
        reader.readAsDataURL(file[0]);
        this.uploadImageFormData = file[0];
        this.changeProfile();
      }
    }
    else
    {
      this.toastrService.error('Allow only .png, .jpeg, .jpg this file');
      return;
    }
  }
  
  changeProfile(){
    const fd = new FormData();
    fd.append('files',  this.uploadImageFormData );
    fd.append('type', 'single');
    this.commonService
      .uploadImage(fd, ImageSource.AVATAR)
      .subscribe((res) => {
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
          this.toastrService.success('Profile Picture Uploaded');
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

  // getUserDetails() {
  //   this.commonService.getUserDetails().subscribe((res) => {
  //     this.user = res;
  //     // console.log(this.user?.avatar)
  //       this.avatharImage = this.commonService.imagePathS3(this.user?.avatar);
  //       console.log('avatharImage',this.avatharImage);
  //   });
  // }

  getUserDetails() {
    const loggedInInfo = this.authService.getUserInfo();
      this.user = loggedInInfo.user;
      this.avatharImage = this.commonService.imagePathS3(this.user?.avatar);
  }

}
