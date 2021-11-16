import { ChangeDetectorRef, Component, ViewRef } from "@angular/core";

import { MatSnackBar, MatDialog } from '@angular/material';
import { AssociatesService } from "../../associates/associates.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UsersService } from "../../users/users.service";
import { Subscription } from "rxjs";
import { PaginationClass } from "src/app/utils/models";
import { SharedService } from "src/app/utils/services";
import { Router } from "@angular/router";
import { VendorsService } from "../../vendors/vendors.service";
import { ConfirmationComponent } from "src/app/utils/components";
@Component({
    selector:"app-hris",
    templateUrl:'./separation.component.html',
    styleUrls:['/separation.component.scss']
    
})


export class SeparationComponent{
 public searchForm:FormGroup
  public allBtns = {
    addUser: false,
    bulkUserUpload: false,
    userReport: false,
    addRole: false,
    search: false
  }
  public pageData = new PaginationClass({ pageSize: 10, sort: { createddate: -1 } });
  public selectedTabLabel = 'separate';
  public usersSubscription: Subscription;
   private searchSubscription: Subscription;
    constructor(private dialog: MatDialog,
      public changeDetactor: ChangeDetectorRef,
      private associateService:AssociatesService,
      private usersService:UsersService,
      private router: Router,
 
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private vendorService: VendorsService,

   
      ){
        console.log("separation");
        this.searchForm = this.formBuilder.group({
          searchText: ['']
        });
    //     this.searchForm = this.formBuilder.group({
    //       searchText: ['searchText']
    // });
  }

  listenToEvents() {
    // this.usersSubscription = this.usersService.getSubscription('btn-status').subscribe(res => {
    //   if (res) {
    //     this.allBtns.addRole = res.hasOwnProperty('addRole') ? res.addRole : this.allBtns.addRole;
    //     this.allBtns.addUser = res.hasOwnProperty('addUser') ? res.addUser : this.allBtns.addUser;
    //     if (this.changeDetactor && !(this.changeDetactor as ViewRef).destroyed) {
    //       this.changeDetactor.detectChanges();
    //     }

    //     this.allBtns.bulkUserUpload = res.hasOwnProperty('bulkUserUpload') ? res.bulkUserUpload : this.allBtns.bulkUserUpload;
    //     this.allBtns.userReport = res.hasOwnProperty('userReport') ? res.userReport : this.allBtns.userReport;
    //   }
    // });
    this.searchSubscription = this.usersService.getSubscription('search').subscribe(res => {
      if (res) {
        if (res.searchText === '' || res.searchText) {
          this.allBtns.search = res.hasOwnProperty('separate') ? res.separate : res.roles;
        }
        //  else {
        //   this.allBtns.search = res.hasOwnProperty('addUser') ? res.addUser : res.addRole;
        // }
        this.changeDetactor.detectChanges();
      }
    });
  }


  public buttonLableSubmit = 'Confirm';
  public buttonLableCancel = 'Cancel';
  removeEmployee() {
    
    let confirmMsg = `The selected associates will be marked as red flag.`;
    
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title:  'Are you sure?',
        message: confirmMsg,
        buttonLableSubmit: this.buttonLableCancel,
        buttonLableCancel:this.buttonLableSubmit
      }
    });
  
    dialogRef.afterClosed().subscribe((status: Boolean) => {
      // if (status&&this.vendorId) {
      //   this.detectChanges();
      // }
      // else{
        //this.onCancel();
      // }
    });
  }
      // removeEmployee() {
      //   const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      //     data: {
      //       title: 'Are you sure?',
      //       message: 'The selected associates will be marked as red flag.' 
      //     }
      //   });

// }




// onSearch(evnt,canEmit?:boolean){
  
//   if ((evnt && (evnt.keyCode && evnt.keyCode === 13 || evnt.target.value.trim() === '')) || canEmit) {
//     let data = {
//       searchText: this.searchForm.value.searchText
//     };
    
//     this.associateService.setSubscription('search', data);
//   } 
//   else {
//     this.associateService.setSubscription('search', this.searchForm.value.searchText);
//   }
// }

onSearch(evnt, canEmit?: boolean) {
  console.log("search")
  if ((evnt && (evnt.keyCode && evnt.keyCode === 13 || evnt.target.value.trim() === '')) || canEmit) {

    let data = {
      searchText: this.searchForm.value.searchText
    };
    console.log(data)
    data[this.selectedTabLabel.toLowerCase()] = true;
    this.usersService.setSubscription('search', data);

  }
}


}