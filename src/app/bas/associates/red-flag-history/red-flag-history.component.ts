import { Component, OnInit } from "@angular/core";
import { DownloadFilterDialogComponent } from "src/app/utils/components/download-filter-dialog/download-filter-dialog.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import {
  RoleAuth,
  UserDetails,
  SortableColums,
  PaginationClass,
  PaginationControl,
  Associates,
} from "../../../utils/models";
import { AssociatesService } from "../associates.service";
import { ConfirmationComponent } from "src/app/utils/components/confirmation/confirmation.component";
import { SharedService } from "src/app/utils/services";
import { Subscription } from "rxjs";
import { SessionStorage } from "ngx-webstorage";
@Component({
  selector: "bas-red-flag-history",
  templateUrl: "./red-flag-history.component.html",
  styleUrls: ["./red-flag-history.component.scss"],
})
export class RedFlagHistoryComponent implements OnInit {
  @SessionStorage("mod") public modules: any;
  @SessionStorage("auth") public userDetails: any;

  public manageUserForm: FormGroup;
  public permissions = new RoleAuth([]);
  public pageData = new PaginationClass({ pageSize: 10 });
  public pageControl = new PaginationControl();
  public sortDirection = new SortableColums();
  public allAssociateList = [];
  public filteredAssociateList = [];
  public deletableUsers = [];

  public failedList: any;
  public selectAll = false;
  public getAsscSubscription: Subscription;
  public searchSubscription: Subscription;
  public pagination = {
    limit: this.pageData.pageSize,
    offset: this.pageData.pageNumber - 1,
    searchText: "",
  };
  selectedFlagFilter: string;
  flagText: string;
  startDate: string;
  endDate: string;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private associateService: AssociatesService,
    private sharedService: SharedService
  ) {
    this.manageUserForm = this.formBuilder.group({
      searchText: [""],
      selectAll: [false],
      allUser: [[]],
    });
  }

  ngOnInit() {
    this.redFlagAssociates();
    this.checkModulePermissions();

  }
  redFlagAssociates() {
    let currentYear = new Date();
    let fetchFirstDayofYear = new Date(currentYear.getFullYear(), 0, 1);
    let fetchLasttDayofYear = new Date(currentYear.getFullYear(), 31, 11);
    let startDate = new Date(
      new Date(fetchFirstDayofYear).toString().split("GMT")[0] + " UTC"
    )
      .toISOString()
      .split(".")[0];
    let endDate = new Date(
      new Date(fetchLasttDayofYear).toString().split("GMT")[0] + " UTC"
    )
      .toISOString()
      .split(".")[0];
    let requestOrgName;

    if (this.userDetails.userDetails.vendor) {
      requestOrgName = this.userDetails.userDetails.vendor.orgName;
    } else {
      requestOrgName = "";
    }
    let request;

    if (this.userDetails.userDetails.role != "superadmin" || this.userDetails.userDetails.role != "Admin") {
      request = '?limit=' + this.pagination.limit + '&offset=' +
        this.pagination.offset + '&search=' + this.pagination.searchText
    } else {
      request = '?limit=' + this.pagination.limit + '&offset=' +
        this.pagination.offset + '&search=' + this.pagination.searchText
    }
    // console.log("api call");
    this.associateService.get('associates/blocked' + request, true).subscribe(
      (response) => {
        if (response.data && response.data.length > 0) {
          this.allAssociateList = [];
          this.selectAll = true;
          response.data.forEach((user) => {
            // check if the user is already in the deletable list and set the flag accordingly
            user["isDelete"] =
              this.deletableUsers.filter(
                (usr) => usr.toLowerCase() === user.userid.toLowerCase()
              ).length > 0
                ? true
                : false;
            this.selectAll = user["isDelete"] ? this.selectAll : false;
            // this.allAssociateList.unshift(new Associates(user));
            this.allAssociateList.push(new Associates(user));
          });

          this.filteredAssociateList = Object.assign([], this.allAssociateList);

          this.pageData.totalItems = response.total;
          // this.isResetPassword = false;
          this.sharedService.display(false);
        } else {
          this.resetPage();
        }
      },
      () => {
        this.resetPage();
      }
    );
  }
  ngOnDestroy() {
    if (this.getAsscSubscription) {
      this.getAsscSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  checkModulePermissions() {
    if (this.modules) {
      const currentModule = this.modules.filter(
        (module) =>
          module.modulename.toLowerCase() === "associates" &&
          module.resources.filter(
            (resource) => resource.resourcename.toLowerCase() === "associates"
          ).length > 0
      );
      if (currentModule.length > 0) {
        const currentResource = currentModule[0].resources.filter(
          (resource) => resource.resourcename.toLowerCase() === "associates"
        );
        this.permissions = new RoleAuth(currentResource[0].permissions);
        if (this.permissions.read) {
          this.pageData.searchText = "";
          this.listenToEvents();
        }
        if (this.permissions.create) {
          this.associateService.setSubscription("getAssociate", {
            showAddAsscBtn: true,
          });
        }
      }
    }
  }

  listenToEvents() {
    this.searchSubscription = this.associateService
      .getSubscription("search")
      .subscribe((res) => {
        console.log(res,'======>');
        if (
          res &&
          res.hasOwnProperty("history") &&
          res.hasOwnProperty("searchText")
        ) {
          this.pagination.searchText = res.searchText.trim();
          this.pagination.offset = 0;
          this.selectedFlagFilter = "all";
          this.redFlagAssociates();
        }
      });
  }


  resetPage() {
    this.allAssociateList = [];
    this.pageData.totalItems = 0;
    this.sharedService.display(false);
  }
  navigateToUserDetail(user) {
    this.router.navigateByUrl(
      `/my-profile/user-details/${user.deleted}/${user.userid}`
    );
  }

  navigatetoEditPage(userid) {
    this.router.navigateByUrl(`/manage-associates/associates/update/${userid}`);
  }
  setCurrentPageNumber(evnt) {
    this.pageData.pageNumber = Number(evnt);
    this.pagination.offset = Number(evnt - 1);
    this.redFlagAssociates();
  }
}
