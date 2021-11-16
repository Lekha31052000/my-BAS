import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Role } from 'src/app/utils/models/users.model';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/utils/services';

@Component({
  selector: 'app-prepare-roles',
  templateUrl: './prepare-roles.component.html',
  styleUrls: ['./prepare-roles.component.scss']
})
export class PrepareRolesComponent implements OnInit {
  @ViewChild('roleForm', { static: true }) private roleForm: NgForm;
  public roleData = new Role();
  public addRole: any = new Role({});
  private canNavigate = true;
  public allUserClass = [];
  public listModules = [];
  public roleId = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private sharedService: SharedService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.roleId) {
      this.roleId = this.activatedRoute.snapshot.params.roleId;
    }
    this.getPermission();
  }

  /* prompt for the navigation confirmation if any unsaved data exists */
  canDeactivate() {
    return (this.roleForm.dirty && this.canNavigate);
  }

  /* get the permission details */
  getPermission() {
    // this.usersService.get('modules').subscribe(response => {
    this.sharedService.display(true);
    this.usersService.get('modules').subscribe(response => {
      if (response.success && response.payload) {
        response.payload.forEach((module) => {
          let selectionStatus = (module.module_name.toLowerCase() === 'dashboard' && !this.roleId) ? true : false;
          module.resources.forEach((resource) => {
            resource.resource_name = resource.resource_name.toLowerCase();
            const displayPermissions = resource.resource_name === 'flagging' ? false  : true;
            resource['permissions'] = [
              {
                name: 'read' + resource.resource_name,
                value: selectionStatus,
                label: 'read',
                show: displayPermissions
              },
              {
                name: 'create' + resource.resource_name,
                value: selectionStatus,
                label: 'create',
                show: displayPermissions
              },
              {
                name: 'update' + resource.resource_name,
                value: selectionStatus,
                label: 'update',
                show: true
              },
              {
                name: 'delete' + resource.resource_name,
                value: selectionStatus,
                label: 'delete',
                show: displayPermissions
              }
            ];
            resource['selected'] = {
              name: 'selecteBox' + resource.resource_name,
              value: selectionStatus,
              label: resource.resource_name
            };
          });
          module['selected'] = {
            name: 'selectBox' + module.module_name,
            value: selectionStatus,
            label: module.module_name
          };
        });

        // filter the modules which has resources
        this.roleData.modules = response.payload.filter(module => module.hasOwnProperty('resources') && module.resources.length > 0);
        this.sharedService.display(false);
        if (this.roleData.modules) {
          // get the modules details of the specific class (if its edit userclass)
          if (this.roleId) {
            this.getRoleDetails(this.roleId);
          }
        }
      }
    }, () => {
      this.sharedService.display(false);
    });
  }

  /* Get role details for editing */
  getRoleDetails(roleId) {
    this.sharedService.display(true);
    this.usersService.get(`role/${roleId}`).subscribe((response) => {
      if (response.success && response.payload) {
        this.addRole = new Role(response.payload);
        this.listModules = this.addRole.modules;
        if (this.listModules.length > 0) {
          this.listModules.forEach((module) => {
            this.roleData.modules.forEach((ele) => {
              if (module.modulename.toLowerCase() === ele.module_name.toLowerCase()) {
                ele.selected.value = false;
                module.resources.forEach((keyEle) => {
                  ele.resources.forEach((e, i) => {
                    if (keyEle.resourcename.toLowerCase() === e.resource_name.toLowerCase()) {
                      e.selected.value = false;
                      keyEle.permissions.forEach((kele) => {
                        e.permissions.forEach((val, indx) => {
                          if (val.label === kele) {
                            ele.resources[i].permissions[indx].value = true;
                          }
                        });
                        e.selected.value = (ele.resources[i].permissions.
                          filter(permission => permission.value === true).length) ? true : false;
                      });
                    }
                  });
                  // const resourceCount = ele.resources.length;
                  ele.selected.value = (ele.resources.
                    filter(resource => resource.selected.value === true).length) ? true : false;
                });
              }
            });
          });
          this.sharedService.display(false);
        }
      } else {
        this.sharedService.display(false);
        this.addRole.modules = [];
      }
      this.sharedService.display(false);
    }, (error) => {
      this.sharedService.display(false);
      this.showError(error);
    });
  }

  /* when the module checkbox is changed/clicked */
  onModuleChange(module: any, moduleIndex?: number) {
    const isModuleSelected = module.selected.value;
    for (const data of module.resources) {
      data.selected.value = isModuleSelected;
      module.resources.forEach((resource, rIndex) => {
        this.onResourceChange(module, rIndex);
      });
    }
  }

  /* when the resouce checkbox is changed/clicked */
  onResourceChange(module, resourceId, idx?:any) {
    for (const data of module.resources[resourceId].permissions) {
      data.value = module.resources[resourceId].selected.value;
    }
    // const resourceLength = module.resources.length;
    module.selected.value = (module.resources.filter(resource => resource.selected.value === true)).length ? true : false;
  }

  /* when the permission(Read, Update, Delete, Create) checkbox is changed/clicked */
  onPermissionChange(module, resource) {
    resource.selected.value = (resource.permissions.filter(permission => permission.value === true)).length ? true : false;
    if(resource.resource_name.toLowerCase() === 'flagging' ){
      resource.selected.value = (resource.permissions.filter(permission => permission.label === 'update' && permission.value === true)).length ? true : false;
    }
    // const resourceLength = module.resources.length;
    module.selected.value = (module.resources.filter(res => res.selected.value === true)).length ? true : false;
  }

  /* create or update the userclass */
  onSubmit(roleForm: any) {
    this.canNavigate = false;
    let moduleIndx = 0;
    let resourceIndx = 0;
    this.addRole.modules = [];
    for (const data of this.roleData.modules) {
      this.addRole.modules.push({ 'modulename': data.module_name, 'resources': [] });
      for (const resources of data.resources) {
        this.addRole.modules[moduleIndx].resources.push({ 'resourcename': resources.resource_name, 'permissions': [] });
        for (const permissions of resources.permissions) {
          if (permissions.value) {
            this.addRole.modules[moduleIndx].resources[resourceIndx].permissions.push(permissions.label);
          }
        }
        resourceIndx++;
      }
      moduleIndx++;
      resourceIndx = 0;
    }
    this.sharedService.display(true);
    if (this.roleId) {
      // api call for update userclass
      this.usersService.put(`role/${this.roleId}`, this.addRole).subscribe(response => {
        this.handleResponse(response, true, roleForm);
      }, (error) => {
        this.showError(error);
      });
    } else {
      // api call for create userclass
      this.usersService.post('role', this.addRole).subscribe(response => {
        this.handleResponse(response, false);
      }, (error) => {
        this.showError(error);
      });
    }
  }

  /* handle response obtained on create or update of userclass */
  handleResponse(response: any, isUpdate: boolean, roleForm?: any) {
    this.sharedService.display(false);
    const successMessage = isUpdate ? 'Role Updated successfully' : 'Role Created successfully';
    if (response.success === true) {
      this.snackBar.open(successMessage, '', window['snackBarBottom']);
      this.router.navigate(['/manage-users/roles']);
      if (isUpdate) {
        roleForm.reset();
      }
    } else {
      this.snackBar.open('Error Occured', '', window['snackBarBottom']);
    }
  }

  onCancel() {
    // this.usersService.currentSelectedTab = 'Roles';
    this.router.navigate(['/manage-users/roles']);
  }

  /**
   * @method - displays the error in snackbar
   * @param error - the error object
   */
  showError(error: any) {
    this.sharedService.display(false);
    this.snackBar.open((error.error && error.error.hasOwnProperty('message')) ? error.error.message :
      window['serverError'], '', window['snackBarBottom']);
  }

}
