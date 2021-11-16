export class DashboardTabs {
    public approvals: boolean;
    public dashboard: boolean;
    constructor(d: any = {}) {
        this.approvals = d.hasOwnProperty('approvals') ? d.approvals : false;
        this.dashboard = d.hasOwnProperty('dashboard') ? d.dashboard : false;
    }
}

export class FlagCount {
    public orange: number;
    public red: number;
    public green: number;

    constructor(data: any = {}) {
        this.orange = data.orange || 0;
        this.red = data.red || 0;
        this.green = data.green || 0;
    }
}