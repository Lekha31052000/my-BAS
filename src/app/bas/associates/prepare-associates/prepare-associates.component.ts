import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Role, Associates, RoleAuth } from 'src/app/utils/models';
import { AssociatesService } from '../associates.service';
import { SessionStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-prepare-associates',
  templateUrl: './prepare-associates.component.html',
  styleUrls: ['./prepare-associates.component.scss']
})
export class PrepareAssociatesComponent implements OnInit {
  @SessionStorage('auth') public auth: any;
  @SessionStorage('mod') public modules: any;
  public associateForm: FormGroup;
  public associateData = {};
  public roleData = new Role();
  public addRole: any = new Role({});
  private confirmNavigation = true;
  public currentUserRole = '';
  public isFlagEditable = false;
  public allUserClass = [];
  public listModules = [];
  public asscId = '';
  public checkFlagStatus: string = '';
  public showRemarkTxt = false;
  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private associatesService: AssociatesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.associateForm = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      contact: [''],
      agency: [''],
      site: [''],
      city: [''],
      govt_id_proof_type: [''],
      govt_id_proof: [''],
      job_type: [''],
      external_id: [],
      flag: ['', [Validators.required]],
      remark: ['']
      // left_finger: [],
      // right_finger: [],
    });
  }

  ngOnInit() {
    // set whether the flags are editable or not
    // flags are editable if role is 'superadmin' or 'admin' and 'flagging' module has 'update' permissions
    if (this.auth && this.auth.userDetails && this.auth.userDetails.role) {
      switch (this.auth.userDetails.role.toLowerCase()) {
        case 'superadmin':
        case 'admin': {
          this.isFlagEditable = true;
          break;
        }
      }
    }
    
    if (this.modules) {
      const userModule = this.modules.filter(module => module.modulename.toLowerCase() === 'flagging' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'flagging').length > 0);
      if (userModule.length > 0) {
        let permissions = new RoleAuth(userModule[0].resources[0].permissions);
        this.isFlagEditable = permissions.update ? true : this.isFlagEditable;
      }
    }

    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.asscId) {
      this.asscId = this.activatedRoute.snapshot.params.asscId;
      this.getUserDetails();
    }
    // call 'getUserDetails' after the - 'getAllRoles', 'getAllStations'
    //  Promise.all([this.getAllRoles(), this.getAllStations()]).then(() => {
    //   if (this.userId) {
    //     this.getUserDetails();
    //   }
    // });

    // to set the flag status to ORANGE whenever amazon/ flex Id is added
    this.associateForm.get('external_id').valueChanges.subscribe(val => {
      let externalId = val.trim();
      if (externalId && this.associateForm.value.flag === 'ORANGE') {
        this.associateForm.patchValue({ 'flag': 'GREEN' });
      } else if (externalId === '' || externalId === null) {
        this.associateForm.patchValue({ 'flag': this.associateData['flag'] });
      }
    });
  }

  /* show the navigation confirmation before navigating with unsaved data */
  canDeactivate() {
    return (this.associateForm.dirty && this.confirmNavigation);
  }

  /* get the specific user detail */
  getUserDetails() {
    this.associatesService.get(`associates/${this.asscId}`, true).subscribe(response => {
      if (response && response.status && response.status === 'GET_SUCCESS') {
        // reset the role to empty if the role doesn't exist
        // const userRole = this.allRoles.filter(role => role.role_name === response.payload.role).length > 0 ? response.payload.role : '';
        // if (response.payload.role.toLowerCase() === 'superadmin' && userRole.toLowerCase() === '') {
        //   this.allRoles.push({ role_name: 'superadmin' });
        // }

        this.checkFlagStatus = response.associate.flag;

        this.associateForm.patchValue(response.associate);
        this.associateData = Object.assign({}, response.associate);

        if (this.associateData && this.associateData['flag'] && this.associateData['flag'].toLowerCase() === 'red') {
          this.isFlagEditable = false;
          this.showRemarkTxt = true;
        }

        // to show error messages if the required fields are empty
        Object.keys(this.associateForm.controls).forEach(key => {
          this.associateForm.get(key).markAsTouched();
          if (key !== 'external_id' && key !== 'flag' && key !== 'agency' && key !== 'remark') {
            this.associateForm.get(key).disable();
          }
        });
      } else {
        this.snackBar.open('Could not retrieve associate detail.', 'okay', window['snackBarBottom']);
      }
    }, (error => {
      this.showError(error);
    }));
  }


  checkFlag(event) {
    if (event.target.value === 'RED') {
      this.associateForm.get('remark').setValidators([Validators.required]);
      this.showRemarkTxt = true;
    } else {
      this.showRemarkTxt = false;
      this.associateForm.get('remark').setValidators([]);
    }
  }

  onSubmit() {
    this.confirmNavigation = false;
    this.associateData['agency'] = this.associateForm.value.agency;
    this.associateData['external_id'] = this.associateForm.value.external_id;
    this.associateData['flag'] = this.associateForm.value.flag;
    if (this.showRemarkTxt) {
      this.associateData['remark'] = this.associateForm.value.remark;
    } else {
      this.associateData['remark'] = '';
    }

    this.associatesService.put(`associates/${this.asscId}`, this.associateData, true).subscribe(response => {
      if (response) {
        this.snackBar.open('Associate details updated successully.', 'okay', window['snackBarBottom']);
        this.router.navigateByUrl('/manage-associates/associates');
      } else {
        this.snackBar.open('Could not update the associate detail.', 'okay', window['snackBarBottom']);
      }
    }, (err => {
      this.showError(err);
    }));
  }

  /* error handler - show error message in the snackbar */
  showError(error: any) {
    this.snackBar.open(error.error && error.error.hasOwnProperty('message') ? error.error.message :
      window['serverError'], 'okay', window['snackBarBottom']);
  }

}
