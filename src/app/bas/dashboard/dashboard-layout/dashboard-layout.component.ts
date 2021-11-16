import { Component, OnInit } from '@angular/core';
import { DashboardTabs, FlagCount, PaginationClass } from 'src/app/utils/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from 'ngx-webstorage';
import * as Highcharts from 'highcharts';
import { AssociatesEnrollementRate } from 'src/app/utils/enums';
import { DashboardService } from '../dashboard.service';
import { ApprovalsComponent } from '../approvals/approvals.component';
import { SharedService } from 'src/app/utils/services/shared.service';
import { VendorsService } from '../../vendors/vendors.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  @SessionStorage('mod') public userModules: any;
  @SessionStorage('lp') public landingPage: any;
  @SessionStorage('auth') public user: any;
  public selectedTabLabel = 'Approvals';
  public showResources = new DashboardTabs();
  public pageData = new PaginationClass({ pageSize: 10 });
  public highcharts = Highcharts;
  public vendorCollections = [];
  public selectedVendor;
  public role;
  public associatesChart = new AssociatesEnrollementRate();
  public flagCounts: FlagCount = new FlagCount();
  public graph = false;
  public filterForm: FormGroup;
  dFilter;
  newdate1: any;
  newdate2: any;
  selectedfromDatenew: any;
  selectedtoDatenew: any;
  public selectedfromDate;
  public selectedtoDate;




  public countDic = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    private sharedService: SharedService,
    private vendorService: VendorsService,
    public ApprovalsComponent: ApprovalsComponent,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      Fromdate: [null, Validators.required],
      Todate: [null, Validators.required],
    });
    this.checkModulePermissions();
    this.flagCountsCheck();
    this.getAllVendors();
    this.getGraphEnrollementRate();
    this.role = this.user.userDetails.role;
    this.selectedVendor = this.selectedVendor;
    // this.update();
  }

  onPercentChange(event) {
    this.selectedfromDate = event.target.value;
  }
  onPercentChangenew(event) {
    console.log("seleted from date", this.selectedfromDate);
    console.log("to date", event.target.value);
    this.selectedtoDate = event.target.value;
    this.newdate1 = new Date(this.selectedfromDate);
    this.newdate2 = new Date(this.selectedtoDate);
    console.log("date comparision", this.newdate1 >= this.newdate2);
    if (this.selectedfromDate == undefined || this.newdate1 > this.newdate2) {
      alert("From Date should not be empty or less than To Date");
      this.filterForm.reset();
    } else {
      this.flagCountsCheckBetweenDates();
      this.getGraphEnrollementRate();
    }
  }

  resetDateFilter(filter){
    if(filter == "From"){
      this.selectedfromDate = '';
      this.filterForm = this.formBuilder.group({
        Fromdate: [null, Validators.required]
      });
    }
    else if(filter == "To"){
      this.selectedtoDate = '';
      this.filterForm = this.formBuilder.group({
        Todate: [null, Validators.required]
      });
    }
    if(this.selectedtoDate == '' && this.selectedfromDate == '')
    {
      this.flagCountsCheckBetweenDates();
      this.getGraphEnrollementRate();
    }
  }



  update(data) {

    this.dashboardService.sendMessage(data);
    console.log("hello1", this.selectedfromDate);
    console.log("hello2", this.selectedtoDate);
    this.dFilter = data;
    if (this.selectedfromDate && this.selectedtoDate) {
      // filter
      this.dFilter = data;
      this.flagCountsCheckBetweenDatesorgName();
      
    } else {
      // absence of filter
      console.log(this.dFilter,'===============>');
      this.ApprovalsComponent.vendorSelect(data);
      if(data=='all'){
        this.dashboardService
        .get(`associates/flag-statistics`, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
      }
      else{
      this.dashboardService
        .get(`associates/flag-statistics?orgName=${this.dFilter}`, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
      }
    }
    this.getGraphEnrollementRate();
  }


  flagCountsCheckBetweenDatesorgName() {
    let request: any;
    this.selectedfromDatenew = "" + this.selectedfromDate + "T00:00:00";
    this.selectedtoDatenew = "" + this.selectedtoDate + "T00:00:00";
    const startEnd = `startDate=${this.selectedfromDatenew}&endDate=${this.selectedtoDatenew}&orgName=${this.dFilter}`;
    if (
      this.user.userDetails.role != "superadmin" &&
      this.user.userDetails.role != "Admin"
    ) {
      request = `?createdBy=${this.user.userDetails.email}&${startEnd}`;
      this.dashboardService
        .get(`associates/flag-statistics` + request, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
    } else {
      this.dashboardService
        .get(`associates/flag-statistics?${startEnd}`, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
    }
  }
  flagCountsCheckBetweenDates() {
    let request: any;
  
    this.selectedfromDatenew = "" + this.selectedfromDate + "T00:00:00";
    this.selectedtoDatenew = "" + this.selectedtoDate + "T00:00:00";
    if(this.selectedtoDate == '' && this.selectedfromDate == '')
    {
      this.selectedtoDatenew='';
      this.selectedfromDatenew='';
    }
    console.log("select date", this.selectedfromDate);
    const startEnd = `startDate=${this.selectedfromDatenew}&endDate=${this.selectedtoDatenew}`;
    if (
      this.user.userDetails.role != "superadmin" &&
      this.user.userDetails.role != "Admin"
    ) {
      request = `?createdBy=${this.user.userDetails.email}&${startEnd}`;
      this.dashboardService
        .get(`associates/flag-statistics` + request, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
    } else {
      this.dashboardService
        .get(`associates/flag-statistics?${startEnd}`, true)
        .subscribe(
          (res) => {
            this.flagCounts = new FlagCount(res);
          },
          (err) => {}
        );
    }
    
  }

  flagCountsCheck() {
    let request: any;
    if (this.user.userDetails.role != 'superadmin' && this.user.userDetails.role != 'Admin') {
      request = '?createdBy=' + this.user.userDetails.email;
      this.dashboardService.get(`associates/flag-statistics` + request, true).subscribe(res => {
        console.log("res", res);
        this.flagCounts = new FlagCount(res);
      }, (err) => {

      });
    } else {
      this.dashboardService.get(`associates/flag-statistics`, true).subscribe(res => {
        this.flagCounts = new FlagCount(res);
      }, (err) => {

      });
    }

  }
  onSubmit() {
    const start = new Date(new Date(this.filterForm.value.startCustomDate).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    const end = new Date(new Date(this.filterForm.value.endDate).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    console.log("start", start);
    console.log("start", end)
  }

  checkModulePermissions() {
    if (this.userModules) {
      const masterModule = this.userModules.filter(module => module.modulename.toLowerCase() === 'dashboard');
      let hasAccess = false;
      if (masterModule.length > 0) {

        masterModule[0].resources.forEach((resource) => {
          switch (resource.resourcename.toLowerCase()) {
            case 'dashboard':
            case 'approvals': {
              if (resource.permissions.filter(permission => permission.toLowerCase() === 'read').length > 0) {
                this.showResources[resource.resourcename.toLowerCase()] = true;
                hasAccess = true;
              }
              break;
            }

          }
          if (!hasAccess) {
            this.router.navigateByUrl(this.landingPage);
          } else if (this.showResources.dashboard) {
            this.selectedTabLabel = 'Dashboard';
            this.router.navigateByUrl('/dashboard');
          } else if (this.showResources.approvals) {
            this.selectedTabLabel = 'Approvals';
            this.router.navigateByUrl('/dashboard/approvals');
          }
        });
      }
    }
  }

  getAllVendors() {
    this.sharedService.display(true);
    this.vendorService.post('vendors', this.pageData).subscribe(res => {
      console.log('result from vendor------->', res.message.Vendors);
      res.message.Vendors.map((ele) => {
        this.vendorCollections.push(ele.organizationname)
      });
    }, err => {
      console.log('error---->', err);
      this.resetPage();
    })
  }

  resetPage() {
    this.pageData.totalItems = 0;
  }

  getGraphEnrollementRate() {

    let currentYear = new Date();
    let fetchFirstDayofYear = new Date(currentYear.getFullYear(), 0, 1);
    let fetchLasttDayofYear = new Date(currentYear.getFullYear(), 31, 11);
    let startDate = new Date(new Date(fetchFirstDayofYear).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0];
    let endDate = new Date(new Date(fetchLasttDayofYear).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    let orgFilter;

    if (this.selectedfromDate && this.selectedtoDate) {
       startDate = "" + this.selectedfromDate + "T00:00:00";
       endDate = "" + this.selectedtoDate + "T00:00:00";
    }
   
   console.log(this.dFilter,'=============>');
    if(this.dFilter && this.dFilter!='all'){
      orgFilter = `&orgName=${this.dFilter}`;       
    }else{
      orgFilter = '';
    }
   
    this.dashboardService.get(`associates/transactions-history?startDate=${startDate}&endDate=${endDate}${orgFilter}`, true).subscribe(res => {
      res.forEach(ele => {
        let month = new Date(ele.date).getMonth();
        this.countDic[month] = this.countDic[month] + ele.count
      });

      for (let i = 0; i < 12; i++) {
        this.associatesChart.chartOptions.series[0].data.push(this.countDic[i]);
      }
      this.associatesChart.chartOptions.series[0].name = 'Year ' + currentYear.getFullYear()
      this.graph = true;
    })
  }
  /* navigate to approvals component */
  approvalList() {
    this.router.navigate(['dashboard/approvals']);
  }

}
