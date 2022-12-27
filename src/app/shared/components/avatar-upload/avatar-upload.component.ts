import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { StudentService } from 'src/app/core/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { User } from 'src/app/core/models/user.model';
import { take } from 'rxjs/operators';

//Load services
import { CompressImageService } from '../../image-compress/compress-image.service';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit {
  user: User;
  @Input() redBorderImage = false;
  avatharImage: any;
  showUploadButton: boolean;
  uploadImageFormData: File;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private compressImage: CompressImageService
  ) {}

  avatarUpload(file: FileList) {
    let imageUpload: File = file[0];
    this.compressImage.compress(imageUpload)
    .pipe(take(1))
    .subscribe(compressedImage => {
      if(compressedImage.type == 'image/jpeg' || compressedImage.type == 'image/png' || compressedImage.type == 'image/jpg')
      {
        // if (file[0].size/1024/1024 > 1) {  
        //   this.toastrService.error('The file is too large. Allowed maximum size is 1 MB.');
        //   return;
        // }
        if(compressedImage && compressedImage) {
          let reader = new FileReader();
          reader.onload = (event: any) => {
            //console.log(file[0],event)
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

  getUserDetails() {
    this.commonService.getUserDetails().subscribe((res) => {
      this.user = res;
      //console.log(this.user?.avatar)
      this.avatharImage = this.commonService.imagePathS3(this.user?.avatar);
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }
}
