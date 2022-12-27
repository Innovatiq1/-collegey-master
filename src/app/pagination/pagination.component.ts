import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  // @Input() items: Array<any>;
  @Input()  count: number = 0;
  @Output() changePage = new EventEmitter<any>(true);
  @Input()  initialPage = 1;
  @Input()  pageSize = environment.page_limit;
  @Input()  maxPages = 3;

  limit: number = environment.page_limit;

  pager: any = {};


  constructor() { }

  ngOnInit(): void {
    // set page if items array isn't empty
    if (this.count && this.count > 0) {
      this.setPage(this.initialPage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset page if items array has changed
    // if (changes.items.currentValue && changes.items.previousValue) {
    //   if (
    //     changes.items.currentValue.length !== changes.items.previousValue.length
    //   ) {
    //     this.setPage(this.initialPage);
    //   }
    // }
    if (
      changes.count?.currentValue &&
      changes.count?.previousValue &&
      changes.count?.currentValue !== changes.count?.previousValue
    ) {
      this.setPage(this.initialPage);
    }
    // console.log(changes.count)
  }
  
  paginate(totalItems:any, currentPage:any, pageSize:any, maxPages:any) {
    if (currentPage === void 0) {
      currentPage = 1;
    }
    if (pageSize === void 0) {
      pageSize = 5;
    }
    if (maxPages === void 0) {
      maxPages = 10;
    }
    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    let startPage:any;
    let endPage;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      var maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      var maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    var pages = Array.from(Array(endPage + 1 - startPage).keys()).map(function (
      i
    ) {
      return startPage + i;
    });
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  setPage(page: number, bool?:boolean) {
    // get new pager object for specified page
    this.pager = this.paginate(this.count, page, this.pageSize, this.maxPages);

    // get new page of items from items array
    // var pageOfItems = this.items.slice(
    //   this.pager.startIndex,
    //   this.pager.endIndex + 1
    // );

    // call change page function in parent component
    if (!bool) this.changePage.emit(page);
  }

}
