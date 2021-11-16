// Classess used in 'Common' module

/**
 * @class - for handling login credentials
 * @var userid - emailId or any unique userid
 * @var password - the user password
 * @var platform - apllication type
 */
export class Login {
    public email: string;
    public password: string;
    // public platform: string;

    constructor(data: any = {}) {
        this.email = data.email || '';
        this.password = data.password || '';
        // this.platform = 'web';
    }
}

/**
 * @class - for handling login credentials
 * @var userid - emailId or any unique userid
 * @var password - the user password
 * @var platform - apllication type
 */
export class SignUp {
    public firstName: string;
    public lastName: string;
    public email: string;
    public mobileNumber: string;

    constructor(data: any = {}) {
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        this.mobileNumber = data.mobileNumber || '';
    }
}

/**
 * @class - to hold the authenticated user details
 * @var deleted - TRUE if the user exist
 * @var name - user name
 * @var passwordreset
 * @var role - role of user
 * @var updateddate
 * @var userid
 */
export class User {
    public deleted: boolean;
    public name: string;
    public firstname: string;
    public lastname: string;
    public reporting_manager: string;
    public passwordreset: boolean;
    public role: string;
    public createddate: any;
    public updateddate: any;
    public userid: string;
    public email: string;
    public mobile: string;
    public id: string;
    public vendor: any;
    constructor(d: any = {}) {
        this.deleted = d.hasOwnProperty('deleted') ? d.deleted : false;
        this.name = d.firstname || '';
        this.firstname = d.firstname || '';
        this.lastname = d.lastname || '';
        this.reporting_manager = d.reporting_manager || '';
        this.passwordreset = d.hasOwnProperty('passwordreset') ? d.passwordreset : false;
        this.role = d.role || '';
        this.createddate = d.createddate ? new Date(d.createddate) : '';
        this.updateddate = d.updateddate ? new Date(d.updateddate) : '';
        this.userid = d.userid || '';
        this.email = d.email || '';
        this.mobile = d.mobile || '';
        this.id = d._id || '';
        this.vendor = d.vendor || '';
    }
}

/**
 * @class - to hold the autherised details
 * @var userDetails -
 * @var token - 
 * @var tokenType - 
 * @var expires - 
 */
export class Auth {
    public userDetails: User;
    public token: string;
    public tokenType: string;
    public expires: number;

    constructor(d: any = {}) {
        this.assigndata(d);
    }

    private async assigndata(d: any) {
        this.userDetails = d.user ? new User(d.user) : new User();
        this.token = d.token || '';
        this.tokenType = d.tokenType || '';
        this.expires = d.expires || 0;
    }
}

/**
 * @class
 * @var token - auth token obtained on successful login
 * @var type - token type (JWT)
 * @var userid - unique user key
 * @var platform - web
 * @var device
 * @var imei
 * @var location - holds user location
 * @var ipaddress
 */
export class UpdateSession {
    public token: string;
    public type: string;
    // public userid: string;
    public platform: string;
    // public device: string;
    // public imei: string;
    // public location: any;
    public ipaddress: string;
    public email: string;

    constructor(d: any = {}) {
        this.token = d.token || '';
        this.type = d.type || '';
        // this.userid = d.userid || '';
        this.platform = d.platform || 'web';
        // this.device = d.device || window.navigator.userAgent;
        // this.imei = d.imei || '';
        // this.location = new MyLocation();
        this.ipaddress = d.ipaddress || window.location.host;
        this.email = d.email || '';
    }
}

/**
 * @class - to fetch the latitude and logitude
 * @var type
 * @var coordinates - array which holds the longitude and latitude
 */
export class MyLocation {
    public type: string;
    public coordinates: Array<any> = [];

    constructor() {
        this.type = 'Point';
        navigator.geolocation.getCurrentPosition((pos) => {
            this.coordinates.push(pos.coords.latitude, pos.coords.longitude);
            sessionStorage.setItem('location', JSON.stringify(this));
        });
    }
}

/**
 * @class - change password
 * @var signature - received through mail
 * @var password - to hold new password
 */
export class ChangePassword {
    public signature: string;
    public password: string;
    public confirmPassword: string;
    constructor(data: any = {}) {
        this.signature = data.signature || '';
        this.password = data.password || '';
        this.confirmPassword = data.confirmPassword || '';
    }
}

/**
 * @class - hold the members to be get and set
 * @var signature - signature obtianed during change-password
 * @var userid - user whose password to be changed
 * @var email - email of the respective user
 */
export class GetterSetterMembers {
    public signature: string;
    public userid: string;
    public email: string;
}
