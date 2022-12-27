import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { StudentChatService } from 'src/app/core/services/student-chat/student-chat.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentor-chat',
  templateUrl: './mentor-chat.component.html',
  styleUrls: ['./mentor-chat.component.css']
})
export class MentorChatComponent implements OnInit {

  // User Details
  userDatalist:any;
  searchText:string = '';
  activeChatUser:any;
  selected :any;

  //Chat Form
  chatFormGroup: FormGroup;
  submittedChat: boolean = false;
  userid: any;
  chatmessageList:any;
  chatFiletype:any;
  chatMediafile:any;
  fetchstudentChat: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public  commonService: CommonService,
    public  studentChatService: StudentChatService,
    private toastrService: ToastrService,
    private http: HttpClient
  )
  { 
    const loggedInInfo = this.authService.getUserInfo();
    this.userid        = loggedInInfo?.user._id;
    this.chatFormGroup = this.formBuilder.group({ 
      chatMsg: ['',Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAlluserData();
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.chatFormGroup.controls[controlName].hasError(errorName);
  };

  getAlluserData()
  {
    let obj = {
      searchText: this.searchText,
      chatrole  : 'student-montor'
    }
    this.studentChatService.getAllUserDeta(obj).subscribe(
      (response) => {
        this.userDatalist = response.data;
        this.studentfetchChat(this.userDatalist[0]._id);
      },
      (err) => {
        
      },
    );     
  }

  studentfetchChat(userId:any)
  {
    this.activeChatUser = userId;
    let obj = {receiveruser:this.activeChatUser,senderuser:this.userid,chatrole:'student-montor'};
    this.selected = userId; 
    this.studentChatService.fetchChatnewmsg(obj).subscribe(
      (response) => {
          //this.toastrService.success(response.message);
          this.fetchstudentChat = false;
          this.chatmessageList = response.data;
      },
      (err) => {
        this.toastrService.error('Chat not fetch');
      },
    );      
  }

  isActive(item) {
    return this.selected === item;
  };

  uploadFileApi(file) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('files', file);
      if(file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'application/vnd.ms-excel' || file.type == 'application/pdf' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      {
        this.chatFiletype = file.type;
        this.http.post(environment.apiEndpointNew+'public/uploadFile', formData)
          .subscribe((res: any) => {
            resolve(res.url);
          }, (err => {
            reject(err);
          }))
      }
      else
      {
        this.toastrService.error('Allow only .png,.jpeg,.jpg,.pdf,.docx,.xls,.xlsx,.doc this file');
        return;
      }
      
    })
  }
  
  onFileUpload(event) {
    var file = event.target.files;
    if(file[0].type == 'image/jpeg' || file[0].type == 'image/png' || file[0].type == 'image/jpg' || file[0].type == 'application/vnd.ms-excel' || file[0].type == 'application/pdf' || file[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file[0].type == 'application/vnd.ms-powerpoint' || file[0].type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    { 
      if (event.target.files[0].size/1024/1024 > 10) {
        this.toastrService.error('The file is too large. Allowed maximum size is 10 MB.');
        return;
      }
      this.uploadFileApi(event.target.files[0]).then((data) => {
        this.chatMediafile = data;
        this.chatFormGroup.patchValue({
          chatMsg: this.chatMediafile,
        });
      }).catch((err) => {
        this.toastrService.error('Image upload faild');
      })
    }
    else
    {
      this.toastrService.error('Allow only .png, .jpeg, .jpg, .pdf, .ppt, .pptx, .docx, .xls, .xlsx, .doc this file');
      return;
    }
     
  }

  onSubmitChat()
  {
    if(this.chatMediafile != null && this.chatMediafile != '')
    { 
      this.chatFormGroup.patchValue({
        chatMsg: this.chatMediafile,
      });
    }
    this.submittedChat = true;
    let obj = this.chatFormGroup.value;
    if (this.chatFormGroup.invalid){
      return; 
    }
    obj['receiveruser']  = this.activeChatUser;
    obj['senderuser']    = this.userid;
    obj['chatMediafile'] = this.chatMediafile;
    obj['chatFiletype']  = this.chatFiletype;
    obj['chatrole']      = 'student-montor';

    this.studentChatService.addChatnewmsg(obj).subscribe(
      (response) => {
          this.toastrService.success(response.message);
          this.chatFormGroup.reset();
          this.chatMediafile = '';
          this.submittedChat = false;
          this.studentfetchChat(this.activeChatUser);
          this.getAlluserData();
      },
      (err) => {
        this.toastrService.error('Message send faild');
        this.submittedChat = false;
      },
    );      

  }

  searchTextFilter(event:any) {
    this.userDatalist = '';
    this.searchText = event.currentTarget.value;
    this.getAlluserData();
  }

}
