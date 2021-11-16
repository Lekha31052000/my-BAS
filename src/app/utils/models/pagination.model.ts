/* Models required for paginations */

/**
 * @class - date range
 */
export class DateRange {
    public from_date: any;
    public to_date: any;

    constructor(public data: any = {}) {
        this.from_date = data.from_date || new Date();
        this.to_date = data.to_date || new Date();
    }
}

/**
 * @class - pagination details
 */
export class PaginationClass {
    public pageSize: number;
    public allPageSizes: Array<any>;
    public pageNumber: number;
    public totalPages: number;
    public totalItems: number;
    public searchText: string;
    public sort: any;
    public filter: any;
    public vendor: string;
    // public group: Group;

    constructor(public data: any = {}) {
        this.totalPages = data.hasOwnProperty('totalPages') ? data.totalPages : 0;
        this.totalItems = data.hasOwnProperty('totalItems') ? data.totalItems : 0;
        this.pageSize = data.hasOwnProperty('pageSize') ? data.pageSize : 10;
        this.allPageSizes = [5, 10, 25, 50, 100, 500];
        this.pageNumber = data.pageNumber || 1;
        this.searchText = data.searchText || '';
        this.sort = data.sort || {};
        this.filter = data.filter || {};
        this.vendor = data.vendor || '';
        // this.group = new Group(data.group) || new Group();
    }
}

/**
 * @class - pagination details
 */
export class PaginationClassAssociate {
    public pageSize: number;
    public allPageSizes: Array<any>;
    public pageNumber: number;
    public totalPages: number;
    public totalItems: number;
    public searchText: string;
    public sort: any;
    public filter: any;
    // public group: Group;

    constructor(public data: any = {}) {
        this.totalPages = data.hasOwnProperty('totalPages') ? data.totalPages : 0;
        this.totalItems = data.hasOwnProperty('totalItems') ? data.totalItems : 0;
        this.pageSize = data.hasOwnProperty('pageSize') ? data.pageSize : 10;
        this.allPageSizes = [5, 10, 25, 50, 100, 500];
        this.pageNumber = data.pageNumber || 0;
        this.searchText = data.searchText || '';
        this.sort = data.sort || {};
        this.filter = data.filter || {};
        // this.group = new Group(data.group) || new Group();
    }
}

/**
 * @class - holds pagination data
 * @member itemsPerPage - number of items to be shown in the page
 * @member currentPage - current page number
 */
export class PaginationControl {
    public autoHide: boolean;
    public maxSize: number;
    public responsive: boolean;
    public previousLabel: string;
    public nextLabel: string;

    constructor(d: any = {}) {
        this.autoHide = d.hasOwnProperty('autoHide') ? d.autoHide : true;
        this.maxSize = d.maxSize || 9;
        this.responsive = d.hasOwnProperty('responsive') ? d.responsive : true;
        this.previousLabel = d.previousLabel || '';
        this.nextLabel = d.nextLabel || '';
    }
}
