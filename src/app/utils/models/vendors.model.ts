export class VendorDetails {
    public contactperson: string;
    public organizationname: string;
    public domainname: string;
    public id: string;
    public totalAssociates: string;
    public deleted: boolean;
    constructor(data: any = {}) {
        this.contactperson = data.contactperson || '';
        this.organizationname = data.organizationname || '';
        this.domainname = data.domainname || '';
        this.totalAssociates = data.totalAssociates || '';
        this.id = data._id || '';
        this.deleted = data.hasOwnProperty('deleted') ? data.deleted : false;
    }
}

export class AssociateDetails {
    public first_name: String;
    public last_name: string;
    public flag: String;
    public id: number;

    constructor(data: any = {}) {
        this.first_name = data.first_name || '';
        this.last_name = data.last_name || '';
        this.flag = data.hasOwnProperty('flag') ? data.flag.toLowerCase() : '';
        this.id = data.id || 0;
    }
}
export class VendorCreateUser {
    public fullOrganisationName: String;
    public id: String;

    constructor(data: any = {}) {
        this.fullOrganisationName = data.organizationname + '-' + data.domainname || '';
        this.id = data._id;
    }
}