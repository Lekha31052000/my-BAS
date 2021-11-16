/* Models used in User Module */

/**
 * @class - user details
 */
export class UserDetails {
    public _id: string;
    public firstname: string;
    public lastname: string;
    public role: string;
    public email: string;
    public mobile: Number;
    public transaction: string;
    public reporting_manager: string;
    public passwordreset: boolean;
    public createddate: Date;
    public createdby: string;
    public updateddate: Date;
    public deleted: boolean;
    public deleteddate: Date;
    public isDelete: boolean;
    public vendorId: string;
    constructor(d: any = {}) {
        this._id = d._id || '';
        this.firstname = d.firstname || '';
        this.lastname = d.lastname || '';
        this.role = d.role || '';
        this.email = d.email || '';
        this.mobile = d.mobile || '';
        this.transaction = d.transaction || 0;
        this.reporting_manager = d.reporting_manager || '';
        this.passwordreset = d.hasOwnProperty('passwordreset') ? d.passwordreset : false;
        this.createddate = d.createddate;
        this.createdby = d.createdby || '-';
        this.updateddate = d.updateddate;
        this.deleted = d.hasOwnProperty('deleted') ? d.deleted : false;
        this.deleteddate = d.deleteddate;
        this.isDelete = d.hasOwnProperty('isDelete') ? d.isDelete : false;
        this.vendorId = d.vendor || '';
    }
}

/**
 * @class - sortable culumns
 * acsending = 1, descending = -1
 */
export class SortableColums {
    name = 1;
    emp_code = 1;
    email = 1;
    userclass = 1;
    role = 1;
    phone = 1;
}

/* Models used in Master Module */

/**
 * @class - module resouces
 */
export class ModuleResource {
    public resource_name: string;
    public routes: any;
    public permissions: Array<any>;

    constructor(d: any = {}) {
        this.resource_name = d.resource_name || '';
        this.routes = d.hasOwnProperty('routes') ? Object.assign([], d.routes) : [];
        this.permissions = d.hasOwnProperty('permissions') ? Object.assign([], d.permissions) : [];
    }
}

/**
 * @class - module details
 */
export class Module {
    public module_id: string;
    public module_name: string;
    public module_description: string;
    public resources: ModuleResource;

    constructor(d: any = {}) {
        this.module_id = d.module_id || '';
        this.module_name = d.module_name || '';
        this.module_description = d.module_description || '';
        this.resources = new ModuleResource(d.resources);
    }
}

/**
 * @class - holds user Role details
 * @member role_name - role name
 * @member role_description - description of role
 * @member userclass - class which user belongs to
 */
export class Role {
    public role: string;
    public description: string;
    public modules: any;


    constructor(d: any = {}) {
        this.role = d.role || '';
        this.description = d.description || '';
        this.modules = Object.assign([], d.modules) || [];
    }
}

/**
 * @class - check for CRUD permissions
 */
export class RoleAuth {
    public create = false;
    public update = false;
    public delete = false;
    public read = false;
    constructor(d: Array<string> = []) {
        d.forEach((permission, i) => {
            switch (permission) {
                case 'create':
                    this.create = true;
                    break;
                case 'update':
                    this.update = true;
                    break;
                case 'delete':
                    this.delete = true;
                    break;
                case 'read':
                    this.read = true;
                    break;
                default:
                    break;
            }
        });
    }
}

/**
 * @class - Master modules's sub-modules
 */
export class ShowModuleResources {
    public users: boolean;
    public roles: boolean;

    constructor(d: any = {}) {
        this.users = d.hasOwnProperty('users') ? d.users : false;
        this.roles = d.hasOwnProperty('roles') ? d.roles : false;
    }
}

/**
 * @class - Resource details
 */
export class Resources {
    public resource_name: string;
    public permissions: Array<any>;

    constructor(d: any = {}) {
        this.resource_name = d.resource_name || '';
        this.permissions = d.hasOwnProperty('permissions') ? Object.assign([], d.permissions) : [];
    }
}

export class UserLayoutBtns {
    public addUser: boolean;
    public addRole: boolean;
    public bulkUserUpload: boolean;
    public userReport: boolean;

    constructor(d: any = {}) {
        this.addUser = d.hasOwnProperty('addUser') ? d.addUser : false;
        this.addRole = d.hasOwnProperty('addRole') ? d.addRole : false;
        this.bulkUserUpload = d.hasOwnProperty('bulkUserUpload') ? d.bulkUserUpload : false;
        this.userReport = d.hasOwnProperty('userReport') ? d.userReport : false;
    }
}

