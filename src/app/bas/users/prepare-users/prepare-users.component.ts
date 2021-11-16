import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { patternValidators } from 'src/app/utils/validators';
import { UsersService } from '../users.service';
import { MatSnackBar } from '@angular/material';
import { AssociatesService } from '../../associates/associates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorCreateUser } from 'src/app/utils/models/vendors.model';
import { SessionStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-prepare-users',
  templateUrl: './prepare-users.component.html',
  styleUrls: ['./prepare-users.component.scss']
})
export class PrepareUsersComponent implements OnInit {
  public userForm: FormGroup;
  public allRoles = [];
  public allRolesList = [];
  public siteCode = [];
  public site = [];
  public userId = '';
  public canNavigate = true;
  public myValues:string[]=["BB","CC","LL"]
  public vendorId: string;
  public vendorCollections = [];
  public sites:string[]=["AA","BB","CC","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD","DD"]
  public storeEditEmail: string;
  public hideVendor = true;
  @SessionStorage('auth') public user: any;

  constructor(
    public formBuilder: FormBuilder,
    private usersService: UsersService,
    private associateService: AssociatesService,
    public snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      reporting_manager: ['', [Validators.required, Validators.pattern(patternValidators().emailIdRegExp)]],
      email: ['', [Validators.required, Validators.pattern(patternValidators().emailIdRegExp)]],
      mobile: ['', [Validators.required]],
      role: ['', [Validators.required]],
      vendor: [undefined],
      site: ['',[Validators.required]]
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.userId) {
      this.userId = this.activatedRoute.snapshot.params.userId;
    }
    this.searchVendor();
    this.getStationCodes(); // get station codes
    // this.getAllRoles()
    if(this.user.userDetails.vendor.vendorId){
     
      this.hideVendor = false;
    }
    Promise.all([this.getAllRoles()]).then(() => {
      if (this.userId) {

        this.getUserDetails();
      }
    });
  }

  /* show the navigation confirmation before navigating with unsaved data */
  canDeactivate() {
    return (this.userForm.dirty && this.canNavigate);
  }

  /* get the list of roles */
  getAllRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService.get('roles').subscribe(response => {
        if (response.success === true && response.hasOwnProperty('payload')) {
          this.allRoles = response.payload;
          this.allRolesList = response.payload;
        }
        resolve(1);
      }, (error => {
        // this.showError(error);
        reject(1);
      }));
    });
  }

  getUserDetails() {
    this.usersService.get(`user/${this.userId}`).subscribe(response => {
      if (response.success === true && response.hasOwnProperty('payload')) {
        response.payload.site = response.payload.site_code[0];
        // let userDetails = response.payload.filter(user => user._id === this.userId);
        // if (userDetails.length) {
        this.userForm.patchValue(response.payload);
        this.vendorId = this.userForm.value.vendor;
        this.userForm.patchValue({ userName: `${this.userForm.value.firstname} ${this.userForm.value.lastname}` });
        Object.keys(this.userForm.controls).forEach(ctrl => {
          this.userForm.get(ctrl).markAsTouched();
          if (ctrl === 'email') {
            this.storeEditEmail = this.userForm.value.email;
            this.userForm.get(ctrl).disable();
          }
        });
        this.searchVendor();
        // }
      }
    }, (error => {
      this.showError(error);

    }));
  }

  /* filter the roles based on search input */
  filterRoles($event) {
    const searchText = $event.toLowerCase();
    this.allRoles = this.allRolesList.filter(role => (role.role_name.toLowerCase().match(searchText)));
  }

  onCancel() {
    // this.usersService.currentSelectedTab = 'Roles';
    this.router.navigate(['/manage-users/users']);
  }

  onSubmit() {
    this.canNavigate = false;

    let userData = this.userForm.value;
    if (userData.vendor) {
      userData['vendor'] = userData.vendor.id;

    }
    delete userData['userName'];
    this.site = [];
    this.site.push(userData['site']);
    delete userData['site'];
    userData['site_code'] = this.site;


    if (this.userId) {
      // delete userData.password;
      userData['email'] = this.storeEditEmail
      this.usersService.put(`user/${this.userId}`, userData).subscribe(response => {
        if (response.success === true) {
          this.handleSuccessResponse();
        }
      }, (error => {
        this.showError(error);
      }));
    } else {
      this.usersService.post('user', userData).subscribe(response => {
        if (response.success === true) {
          this.handleSuccessResponse();
        }
      }, (error => {
        this.showError(error);
      }));
    }
  }
public siteCodes:string[]=[];
  getStationCodes() {
    if (this.user.userDetails.role == 'Admin') {
      this.usersService.get(`user/${this.user.userDetails.id}`).subscribe(res => {
        this.siteCode = res.payload.site_code;
        this.siteCodes = res.payload.site_code;
        this.unselectedSites=res.payload.site_code;
        console.log(res.payload.site_code);
        // res.payload.map(sites=>{
        //   this.siteCodes.push(sites.siteCode)
        // })
      }, (error => {
        this.showError(error);
      }));
    } else {
      this.associateService.get('stations').subscribe(res => {
        this.siteCode = res.payload;
      });
    }
  }

  searchVendor() {
    this.usersService.get('vendor').subscribe(res => {
      if (this.vendorId) {
        res.message.filter(vednorId => {
          if (vednorId._id === this.vendorId) {
            this.userForm.patchValue({ vendor: vednorId.organizationname + '-' + vednorId.domainname });
          }
        });
      }
      res.message.forEach(element => {
        this.vendorCollections.push(new VendorCreateUser(element));
      });

    })
  }

  handleSuccessResponse() {
    const successMessage = this.userId ? 'User Details updated successfully' :
      'User details created successfully';
    this.snackBar.open(successMessage, '', window['snackBarBottom']);
    this.router.navigateByUrl('/manage-users/users');
  }

  /* error handler - show error message in the snackbar */
  showError(error: any) {
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }

public onSelect=false;

  checkValues(user:any){
    
    this.onSelect=!this.onSelect;

      if(this.onSelect===true){
        // this.myValues=user;
        // this.myValues.push(user)
        this.sites.push(user);
        this.myValues.slice(user);
        console.log(this.myValues)
       
      }

    }
public selectedSites:string[]=["AZC","AYC","AXC","AWC","AGC","AHC","ARC","ALC","AMC","ANC","AOC"];
// public selectedSites:string[]=[];
public unselectedSites:string[]=["BCA","BCB","BCC","BCD","BCE","BCF","BCG","BCH","BCI","BCJ","BCK","BCL","BCM","BCN","BCO","BCP","BCQ","BCR","BCS","BCT","BCU","BCV","BCW","BCX","BCY","BCZ","BZD","BYD","BXD","BMD","BAD","BBD","BFD","BGD","BHD","BKD","BJD"];
// public unselectedSites:string[]=[];
  assignSiteChange(event) {
    // this.usersService.get(`user/${this.user.userDetails.id}`).subscribe(res => {
    //   this.unselectedSites=res.payload.site_code;
    // })
      console.log(event);
      if(!event.target.checked){
      if(this.selectedSites.indexOf(event.target.value) >= 0){
        this.unselectedSites.push(event.target.value);
        // this.siteCode.push(event.target.value);
        this.selectedSites = this.selectedSites.filter(st => st !== event.target.value);
      }
    }
  }
  
  availableSiteChange(event){
      
      if(event.target.checked){
      if(this.unselectedSites.indexOf(event.target.value) >= 0){
        // if(this.siteCode.indexOf(event.target.value) >= 0){
        this.selectedSites.push(event.target.value);
        // this.siteCodes.push(event.target.value);
        // this.siteCode = this.siteCode.filter(st => st.sitecode !== event.target.value.sitecode); 
        this.unselectedSites = this.unselectedSites.filter(st => st !== event.target.value);
      }
    }
  }
  
  

}
