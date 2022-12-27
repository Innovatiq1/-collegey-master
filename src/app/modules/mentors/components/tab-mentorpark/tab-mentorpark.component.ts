import { Component, OnInit, ViewChild } from '@angular/core';

// Load Services
import { CommonService } from 'src/app/core/services/common.service';
import { MentorDashboardService } from 'src/app/core/services/mentor-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-tab-mentorpark',
  templateUrl: './tab-mentorpark.component.html',
  styleUrls: ['./tab-mentorpark.component.css'],
})
export class TabMentorparkComponent implements OnInit {
  // Admin Mentor Perks Tab
  mentorPerksData: any;
  mentorFeaturedPerksData: any;
  userInfo: User = new User();

  // pagination
  currentPage: number = 1;
  currentLimit: number = 5;
  totalRecord: number = 0;
  isLoading: boolean = false;
  constructor(
    private mentorDashboardService: MentorDashboardService,
    public commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    const loggedInInfo = this.authService.getUserInfo();
    this.userInfo = loggedInInfo ? loggedInInfo.user : new User();
  }

  ngOnInit(): void {
    this.getAdminMentorPerks();
  }

  readMoreClass(perks) {
    console.log('readMoreClass========', perks);

    perks.readLess = !perks.readLess;
  }
  countWords(str) {
    let count = 0;
    count = str.trim().split(/\s+/).length;
    if (count < 250) {
      return false;
    } else {
      return true;
    }
  }

  getAdminMentorPerks() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.mentorDashboardService.getAdminMentorPerks(obj).subscribe(
      (response) => {
        this.isLoading = false;
        this.mentorPerksData = response.data;
        this.mentorFeaturedPerksData = response.data_featured;

        if (
          response.totalRecords <= this.currentLimit ||
          response.totalRecords <= 0
        ) {
          this.isLoading = true;
        }
      },
      (err) => {}
    );
  }

  loadMoreData() {
    this.currentPage = this.currentPage;
    this.currentLimit = this.currentLimit + 5;
    this.getAdminMentorPerks();
  }

  addToFavoritePerk(favorite_index: any, perk_id: any, add_action: any) {
    let obj = {
      favorite_index: favorite_index,
      user: this.userInfo?._id,
      perkId: perk_id,
      like_action: add_action,
    };
    this.mentorDashboardService.addtoFavroriteperk(obj).subscribe(
      (response) => {
        this.toastrService.success(response.message);
        this.getAdminMentorPerks();
      },
      (err) => {
        this.toastrService.error('Favorite not added');
      }
    );
  }

  CheckPerklike(postlikearray: any) {
    return postlikearray?.includes(this.userInfo?._id);
  }
}
