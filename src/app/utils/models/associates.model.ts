/**
 * @class - user details
 */
export class Associates {
    public first_name: string;
    public last_name: string;
    public email: string;
    public agency: string;
    public city: string;
    public site: string;
    public govt_id_proof: string;
    public govt_id_proof_type: string;
    public role: string;
    public job_type: string;
    public passwordreset: boolean;
    public id: string;
    public phone: Number;
    public created_at: Date;
    public updated_at: Date;
    public deleted: boolean;
    public deleteddate: Date;
    public isDelete: boolean;
    public flag: string;
    public external_id: string;
    public created_by: string;
    public vendorName: string;
    public org_name:string;
    constructor(d: any = {}) {
        this.first_name = d.first_name || '';
        this.last_name = d.last_name || '';
        this.email = d.email || '';
        this.agency = d.agency || '';
        this.city = d.city || '';
        this.site = d.site || '';
        this.govt_id_proof = d.govt_id_proof || '';
        this.govt_id_proof_type = d.govt_id_proof_type || '';
        this.role = d.role || '';
        this.job_type = d.job_type || '';
        this.passwordreset = d.hasOwnProperty('passwordreset') ? d.passwordreset : false;
        this.id = d.id || '-';
        this.phone = d.contact || '';
        this.created_at = d.created_at;
        this.updated_at = d.updated_at;
        this.deleted = d.hasOwnProperty('deleted') ? d.deleted : false;
        this.isDelete = d.hasOwnProperty('isDelete') ? d.isDelete : false;
        this.deleteddate = d.deleteddate;
        this.flag = d.hasOwnProperty('flag') ? d.flag.toLowerCase() : '';
        this.external_id = d.hasOwnProperty('external_id') ? d.external_id : '-';
        this.created_by = d.created_by || '';
        if (d.vendor) {
            this.vendorName = d.vendor.org_name || '';
        }
        this.org_name=d.org_name;
    }
}

export class Associate {
    public id: string;
    public first_name: string;
    public last_name: string;
    public agency: string;
    public city: string;
    public site: string;
    public govt_id_proof: string;
    public govt_id_proof_type: string;
    public job_type: string;
    public contact: Number;
    public flag: string;
    public external_id: string;
    public remark: string;
    // public left_finger: Array<any>;
    // public right_finger: Array<any>;

    constructor(d: any = {}) {
        this.id = d.hasOwnProperty('id') ? d.id : '';
        this.first_name = d.first_name || '';
        this.last_name = d.last_name || '';
        this.agency = d.agency || '';
        this.city = d.city || '';
        this.site = d.site || '';
        this.govt_id_proof = d.govt_id_proof || '';
        this.govt_id_proof_type = d.govt_id_proof_type || '';
        this.job_type = d.job_type || '';
        this.contact = d.contact || '';
        this.flag = d.hasOwnProperty('flag') ? d.flag.toLowerCase() : '';
        this.external_id = d.hasOwnProperty('external_id') ? d.external_id : '';
        this.remark = d.remark || '';
        // this.left_finger = d.left_finger || [];
        // this.right_finger = d.right_finger || [];
    }
}

/**
 * @class - Master modules's sub-modules
 */
export class AssociateTabs {
    public associates: boolean;

    constructor(d: any = {}) {
        this.associates = d.hasOwnProperty('associates') ? d.associates : false;
    }
}