import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AssociatesService } from '../associates.service';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ConfirmationComponent } from 'src/app/utils/components/confirmation/confirmation.component';
import { environment } from 'src/environments/environment';
import { Associates, Associate, RoleAuth } from 'src/app/utils/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorage } from 'ngx-webstorage';


@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.scss']
})
export class FingerprintComponent implements OnInit {
  public associateForm: FormGroup;
  public matchedAssociate = new Associate();
  public isFM220ServiceRunning = true;
  public isDeviceConnected = true;
  public currentScanState = 'start';
  // public isLeftFinger = false;
  // public isRightFinger = false;
  public isScanFailed = false;
  public scanStatus = '';
  public scannedImgSrc = '';
  public progressData = 0;
  public scanStatusList = {};
  public scannedData = {};
  public step = 0;  //done: 5, add: 6, update: 7 , 
  public permissions = new RoleAuth([]);
  public showRemarkTxt = false;
  public flag = '';
  private sdkUrl = environment.sdkUrl;
  public govtPropfMinLength = 0;
  public govtPropfMaxLength = 0;
  public siteCode = [];
  private sdkErrorCodeDesc = {
    100: 'Please connect Fingerprint Device or Remove Finger',
    101: 'Check if ACPL FM220 service is running.'
  }
  public jobTypes = [];
  public govtIdTypes = [];
  public isFlagEditable = false;
  @SessionStorage('auth') public userDetails: any;
  @SessionStorage('mod') public modules: any;


  constructor(
    private associateService: AssociatesService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private dialogRef: MatDialogRef<FingerprintComponent>) {
    this.scanStatusList = this.associateService.scanStatus;
    this.associateForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      agency: [''],
      site: [undefined, [Validators.required]],
      city: ['', [Validators.required]],
      govt_id_proof_type: ['', [Validators.required]],
      govt_id_proof: ['', [Validators.required]],
      job_type: ['', [Validators.required]],
      external_id: [''],
      flag: [''],
      remark: ['']
      // left_finger: [],
      // right_finger: [],
    });
    this.jobTypes = this.associateService.jobTypes;
    this.govtIdTypes = this.associateService.govtProofTypes;
  }

  ngOnInit() {
    this.checkModulePermissions();
    // to set the flag status to ORANGE whenever amazon/ flex Id is added
    this.associateForm.get('external_id').valueChanges.subscribe(val => {
      let externalId = val.trim();
      if (externalId && (this.associateForm.value.flag === 'ORANGE' || this.associateForm.value.flag === 'orange')) {
        this.associateForm.patchValue({ 'flag': 'GREEN' });
      } else if (externalId === '' || externalId === null) {
        this.associateForm.patchValue({ 'flag': this.matchedAssociate['flag'] });
      }
    });

    this.getStationCodes();
  }

  onClickScan() {
    // this.currentScanState = 'left_finger';
    // create a unique id
    this.scanStatus = '';
    // let id = "_" + (new Date()).getTime();
    this.step++;
    this.progressData = 0;
    this.currentScanState = this.currentScanState === 'start' ? 'leftFinger' : 'rightFinger';
    // if (document.getElementById('FPImage1') && this.currentScanState !== 'start') {
    //   document.getElementById('FPImage1')['src'] = 'assets/images/scan-finger.svg';
    // }
    this.scannedImgSrc = '';
    this.isDeviceConnected = true;
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
    if (this.step <= 3) {
      this.captureFP();
    }
  }

  onClickAdd() {
    this.currentScanState = 'add';
    this.matchedAssociate = new Associate();
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }

  onClickUpdate() {
    this.currentScanState = 'update';
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }

  onClickSave() {
    if (this.associateForm.valid) {
      if (this.currentScanState === 'add') {
        this.enrollAssociate();
      } else {
        this.updateAssociate();
      }
      this.currentScanState = 'requesting';
      this.scanStatus = 'Saving...Please Wait';
      this.changeDetector.detectChanges();
      this.changeDetector.markForCheck();
    } else {
      this.snackBar.open('Form is invalid', '', window['snackBarConfig']);
    }
  }

  onClickContinueOrDismiss() {
    this.resetScanData();
  }

  resetScanData() {
    this.changeDetector.markForCheck();
    this.isFM220ServiceRunning = true;
    this.isDeviceConnected = true;
    this.currentScanState = 'start';
    this.isScanFailed = false;
    this.flag = '';
    this.scanStatus = '';
    this.scannedImgSrc = '';
    this.progressData = 0;
    this.scannedData = {};
    this.step = 0;
    this.associateForm.patchValue(new Associate({}));
    Object.keys(this.associateForm.controls).forEach(key => {
      this.associateForm.get(key).markAsUntouched();
    });
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }

  checkFM220ServiceConnection() {
    this.jsonp(`${this.sdkUrl}gettmpl?callback=?`);
  }

  /* Ask for confirmation before closing the popup */
  confirmClose() {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirm-delete-dialog',
      backdropClass: 'confirm-delete-backdrop',
      data: {
        title: 'Scan',
        message: `Are you sure to close ?`,
        buttonLableSubmit: 'Yes',
        buttonLableCancel: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeFingerprintModal(true);
      }
    });
  }


  /* check module permissions */
  checkModulePermissions() {
    if (this.modules) {
      const currentModule = this.modules.filter(module => module.modulename.toLowerCase() === 'associates' && module.resources.filter(resource => resource.resourcename.toLowerCase() === 'associates').length > 0);
      if (currentModule.length > 0) {
        const currentResource = currentModule[0].resources.filter(resource => resource.resourcename.toLowerCase() === 'associates');
        this.permissions = new RoleAuth(currentResource[0].permissions);
      }
    }


    // set whether the flags are editable or not
    // flags are editable if role is 'superadmin' or 'admin' and 'flagging' module has 'update' permissions
    if (this.userDetails && this.userDetails.userDetails && this.userDetails.userDetails.role) {
      switch (this.userDetails.userDetails.role.toLowerCase()) {
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

  }

  /* Close the popup */
  closeFingerprintModal(status: boolean) {
    this.dialogRef.close(status);
  }

  base64ToUTF8Array(base64) {
    let utf8 = [];
    for (let charIndx = 0; charIndx < base64.length; charIndx++) {
      let charcode = base64.charCodeAt(charIndx);
      if (charcode < 0x80) {
        utf8.push(charcode);
      } else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6),
          0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
        charIndx++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode = 0x10000 + (((charcode & 0x3ff) << 10)
          | (base64.charCodeAt(charIndx) & 0x3ff));
        utf8.push(0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
    }
    return utf8;
  }

  errorFunc(errorCode?: number) {
    if (errorCode > 0) {
      window.alert(this.sdkErrorCodeDesc[errorCode]);
    } else {
      window.alert("Check if ACPL FM220 service is running");
    }
  }

  captureFP() {
    try {
      // CALL CPATURE REQUEST TO FM220 SDK API
      this.jsonp(`${this.sdkUrl}gettmpl?callback=?`,
        (result) => {
          if (result && result.errorCode && result.errorCode === 100) {
            this.isDeviceConnected = false;
            this.resetStatusOnError();
            setTimeout(() => {
              this.errorFunc(100);
            }, 50);
          } else {
            this.successFunc(result);
          }
        });
    } catch (err) {
      window.alert('capture_call:' + err);
    }
  }

  jsonp(url, callback?: any) {
    // create a unique id
    let id = '_' + (new Date()).getTime();
    // create a global callback handler
    window[id] = (result) => {
      // forward the call to specified handler                                       
      if (callback) {
        callback(result);
      }

      // clean up: remove script and id
      let sc = document.getElementById(id);
      sc.parentNode.removeChild(sc);
      window[id] = null;
    }
    url = url.replace('callback=?', 'callback=' + id);

    // create script tag that loads the 'JSONP script' 
    // and executes it calling window[id] function                
    let script = document.createElement("script");
    script.setAttribute('id', id);
    script.setAttribute('src', url);
    this.isFM220ServiceRunning = true;
    script['onerror'] = () => {
      this.isFM220ServiceRunning = false;
      this.resetStatusOnError();
      setTimeout(() => {
        this.errorFunc(101);
      }, 100);
    };
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
  }

  setCurrentState(): string {
    return (this.step === 0) ? 'start' : (this.step === 1 ? 'leftFinger' : 'rightFinger');
  }

  /* 
      This functions is called if the service sucessfully returns some data in JSON object
   */
  successFunc(result) {
    if (result.errorCode === 0) {
      /* 	Display BMP data in image tag
          BMP data is in base 64 format 
      */
      if (result != null && result.bMPBase64.length > 0) {
        this.scannedImgSrc = `data:image/bmp;base64,${result.bMPBase64}`;
        // document.getElementById('FPImage1')['src'] = "data:image/bmp;base64," + result.bMPBase64;
        this.scanStatus = 'Scan Successful';
        this.isScanFailed = false;
        this.progressData = 100;
        this.changeDetector.detectChanges();
        this.changeDetector.markForCheck();

        if (this.currentScanState === 'leftFinger') {
          // this.step = 2;
          this.currentScanState = 'rightFinger';
          // this.scannedData['left_finger'] = this.base64ToUTF8Array(result.wsqBase64);
          this.scannedData['left_finger'] = Object.assign([], Uint8Array.from(atob(result.wsqBase64), c => Number(c.charCodeAt(0))));
        } else if (this.step = 3) {
          // this.step++;
          // this.scannedData['right_finger'] = this.base64ToUTF8Array(result.wsqBase64);
          this.scannedData['right_finger'] = Object.assign([], Uint8Array.from(atob(result.wsqBase64), c => Number(c.charCodeAt(0))));
          this.matchData();

        }
        this.changeDetector.detectChanges();
        this.changeDetector.markForCheck();
      }
    } else if (result.errorCode === 100) {
      this.isDeviceConnected = false;
      this.resetStatusOnError();
    } else {
      window.alert('Fingerprint Capture ErrorCode ' + result.errorCode + 'Desc :-' + result.status);
      this.scanStatus = 'Scan Unsuccessful';
      this.isScanFailed = true;
      this.resetStatusOnError();
    }
  }

  resetStatusOnError() {
    --this.step;
    this.currentScanState = this.setCurrentState();
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }

  matchData() {
    this.scanStatus = 'Matching...Please Wait';
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();

    this.associateService.post('associates/match', this.scannedData, true).subscribe(res => {
      if (res && res.hasOwnProperty('status')) {
        switch (res.status) {
          case 'MATCH_NOT_FOUND':
            this.flag = 'green';
            this.currentScanState = 'new';
            this.scanStatus = 'New Associate';
            this.scannedImgSrc = 'assets/images/tick-success.svg';
            this.changeDetector.markForCheck();
            this.changeDetector.detectChanges();
            break;
          case 'MATCH_FOUND':
            if (res.matches && res.matches.length > 0 && res.matches[0].hasOwnProperty('associate')) {
              this.matchedAssociate = new Associate(res.matches[0].associate);
              this.associateForm.patchValue(res.matches[0].associate);
            }
            const obj = {
              target: {
                value: this.matchedAssociate.govt_id_proof_type
              }
            }
            this.checkGovtProof(obj, false);
            this.currentScanState = 'exists';
            this.flag = this.matchedAssociate.flag;
            this.changeDetector.markForCheck();
            this.changeDetector.detectChanges();
            break;
          default:
            this.snackBar.open(`${res.status}`, '', window['snackBarConfig']);
            break;
        }
      }
    }, (err) => {
      console.log('scan--err-', err);
    });
  }

  enrollAssociate() {
    const vendor = {
      org_name: this.userDetails.userDetails.vendor.orgName,
      domain_name: this.userDetails.userDetails.vendor.domainName
    }
    const created_by = {
      created_by: this.userDetails.userDetails.email
    }
    let asscData = new Associate(this.associateForm.value);
    asscData['left_finger'] = Object.assign([], this.scannedData['left_finger']);
    asscData['right_finger'] = Object.assign([], this.scannedData['right_finger']);
    asscData['vendor'] = vendor;
    asscData['created_by'] = this.userDetails.userDetails.email;
    delete asscData['id'];
    delete asscData['flag'];
    asscData['external_id'] = asscData['external_id'] !== null ? asscData['external_id'] : '';
    // delete asscData['external_id'];

    this.associateService.post('associates/enroll', asscData, true).subscribe(res => {
      if (res && res.hasOwnProperty('status')) {
        switch (res.status) {
          case 'ENROLL_SUCCESS':
            this.currentScanState = 'enrolled';
            this.scanStatus = 'Enrolled Successfully';
            this.scannedImgSrc = 'assets/images/tick-success.svg';
            this.changeDetector.detectChanges();
            this.changeDetector.markForCheck();
            this.storeDataNode();
            break;
          case 'ENROLL_FAILED':
            this.currentScanState = 'failed';
            this.scanStatus = 'Enroll Failed';
            this.changeDetector.detectChanges();
            this.changeDetector.markForCheck();
            this.snackBar.open(`ENROLL_FAILED${res.hasOwnProperty('failure_cause') ? (':' + res.failure_cause) : ''}`, '', window['snackBarConfig']);
            break;
        }
      }
    }, (err) => {
      console.log('enroll--err-', err);
    });
  }

  storeDataNode() {
    this.associateService.put('associates/transaction', {}).subscribe(res => {

    });
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

  updateAssociate() {
    let asscData = new Associate(this.associateForm.value);
    delete asscData['id'];
    if (asscData.hasOwnProperty('flag')) {
      asscData.flag = asscData.flag.toUpperCase();
    }
    delete asscData['left_finger'];
    delete asscData['right_finger'];

    this.associateService.put(`associates/${this.matchedAssociate.id}`, asscData, true).subscribe(res => {
      if (res && res.hasOwnProperty('status')) {
        switch (res.status) {
          case 'UPDATE_SUCCESS':
            this.currentScanState = 'updated';
            this.scanStatus = 'Updated Successfully';
            this.scannedImgSrc = 'assets/images/tick-success.svg';
            this.changeDetector.detectChanges();
            this.changeDetector.markForCheck();
            break;
          case 'UPDATE_FAILED':
            this.currentScanState = 'failed';
            this.scanStatus = 'Update Failed';
            this.changeDetector.detectChanges();
            this.changeDetector.markForCheck();
            this.snackBar.open(`UPDATE_FAILED${res.hasOwnProperty('failure_cause') ? (':' + res.failure_cause) : ''}`, '', window['snackBarConfig']);
            break;
        }
      }
      if (res && res.hasOwnProperty('id') && res.id === this.matchedAssociate.id) {

      }
    }, (err) => {
      console.log('enroll--err-', err);
    });
  }


  checkGovtProof(event, checkTextValue?: boolean) {
    if (checkTextValue) {
      this.associateForm.patchValue({ 'govt_id_proof': null });
    }
    switch (event.target.value) {
      case 'AADHAR':
        this.associateForm.get('govt_id_proof').setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
        this.govtPropfMinLength = 12;
        this.govtPropfMaxLength = 12;
        break;

      case 'VOTER_ID':
        this.associateForm.get('govt_id_proof').setValidators([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]);
        this.govtPropfMinLength = 10;
        this.govtPropfMaxLength = 16;
        break;

      case 'PANCARD':
        this.associateForm.get('govt_id_proof').setValidators([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]);
        this.govtPropfMinLength = 10;
        this.govtPropfMaxLength = 10;
        break;

      case 'DRIVING_LICENCE':
        this.associateForm.get('govt_id_proof').setValidators([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]);
        this.govtPropfMinLength = 10;
        this.govtPropfMaxLength = 16;
        break;
    }
    console.log(this.associateForm.controls);

  }

  getStationCodes() {
    this.associateService.get('stations').subscribe(res => {
      this.siteCode = res.payload;
    });
  }

  selectCity(event) {
    this.associateForm.patchValue({ city: event.city.toUpperCase() })
  }
}
