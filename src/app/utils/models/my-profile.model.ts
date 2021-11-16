/* Models used in MyProfile Module */
export class ShowProfileResources {
    public profile: boolean;
    // public device: boolean;
    public change_password: boolean;

    constructor(d: any = {}) {
        this.profile = d.hasOwnProperty('profile') ? d.profile : false;
        this.change_password = d.hasOwnProperty('change_password') ? d.change_password : false;
    }
}
