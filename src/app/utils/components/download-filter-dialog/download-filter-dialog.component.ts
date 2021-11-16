import { Component, Inject, OnInit } from '@angular/core';
import { jobTypes, flagFilters, duration, monthArray, weekDays, weekListText, quarterArray } from '../../enums';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssociatesService } from 'src/app/bas/associates/associates.service';
import { SessionStorage } from 'ngx-webstorage';
import { SharedService } from '../../services';
// import { SharedService } from '../../services';


@Component({
  selector: 'bas-download-filter-dialog',
  templateUrl: './download-filter-dialog.component.html',
  styleUrls: ['./download-filter-dialog.component.scss']
})
export class DownloadFilterDialogComponent implements OnInit {
  public flagCollections = flagFilters;
  public jobCollections = jobTypes;
  public durationCollections = duration;
  public showCalendar = false;
  public showMonthCalendar = false;
  public showMonthInfo = false;
  public showYearInfo = false;
  public showYearCalendar = false;
  public showQuarterCalendar = false;
  public initialGraph = true;
  public updatedGraph = false;
  public date = new Date();
  public selectedMonth: any;
  public year = [];
  public xAxis = [];
  public selectedYear: any;
  public Month;
  public quarterInfo: any;
  public showWeeks = false;
  public weeks = [];
  public fromData: any;
  public toData: any;
  public rangeType: string = 'year';
  public monthArray = monthArray;
  public daysArray = weekDays;
  public weekListText = weekListText;
  public quarterArray = quarterArray;
  public active: any = 10;
  public countToHideCalendar: number = 0;
  public showCalendarInput = false;
  public showCustomCalendar = false;
  public startDate = '';
  public filterForm: FormGroup;
  public reportType: string = '';
  public selectedJobTypeText: string;
  public minCustomDate: any;
  @SessionStorage('auth') public user: any;

  constructor(public dialogRef: MatDialogRef<DownloadFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public associateService: AssociatesService,
    private sharedService: SharedService

  ) {
    this.filterForm = this.formBuilder.group({
      jobType: [undefined, [Validators.required]],
      flag: [undefined, [Validators.required]],
      duration: [undefined, [Validators.required]],
      startDate: [''],
      startCustomDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.storeYear();
    this.filterForm.get('duration').valueChanges.subscribe(res => {
      if (res.value === 'custom') {
        this.filterForm.get('startCustomDate').setValidators([Validators.required]);
        this.filterForm.get('endDate').setValidators([Validators.required]);
        this.filterForm.get('startDate').setValidators([]);
        this.reportType = 'custom';
      } else {
        this.filterForm.get('startDate').setValidators([Validators.required]);
        this.filterForm.get('startCustomDate').setValidators([]);
        this.filterForm.get('endDate').setValidators([]);
        this.reportType = 'manual';
      }
    })
  }

  /**
   * @method storeYear()
   * @description startingYear(started from 2017 as of now), currentYear(restricted till today), displaying year graph intially and storing in
   * fromData and toData, storing 2017-19 in year array to display in UI.
   * @author karan
   */
  storeYear() {
    let currentYear = new Date();
    let endDateofMonth = new Date(currentYear.getFullYear(), currentYear.getMonth() + 1, 0);
    let startingYear = new Date(2015, 0, 1);
    let startOfTheYear = new Date(currentYear.getFullYear(), 0, 1);
    this.fromData = startingYear.getDate() + ' ' + this.monthArray[currentYear.getMonth()] + ' ' + currentYear.getFullYear() + '-' + endDateofMonth.getDate() +
      ' ' + this.monthArray[endDateofMonth.getMonth()] + ' ' + currentYear.getFullYear();
    ;
    let endDateOfTheYear = new Date(currentYear.getFullYear(), 8, 1);
    this.toData = endDateOfTheYear.getDate() + ' ' + this.monthArray[8] + ' ' + endDateOfTheYear.getFullYear();
    while (currentYear.getFullYear() >= startingYear.getFullYear()) {
      this.year.push(startingYear.getFullYear());
      let setYear = startingYear.setFullYear(startingYear.getFullYear() + 1);
      startingYear = new Date(setYear);
    }
    this.active = this.year.indexOf(currentYear.getFullYear());
    this.selectedYear = this.year[this.year.length - 1];
    this.selectedMonth = this.date;
    this.Month = this.monthArray[currentYear.getMonth()];
    this.sendIntialDate(startOfTheYear, endDateOfTheYear);
  }
  clearEndDate(event) {
    let fromDate = new Date(event.value);
    this.minCustomDate = fromDate;
    this.startDate = fromDate.getDate() + ' ' + fromDate.getMonth() + ' ' + fromDate.getFullYear();
  }
  /**
   * @method range()
   * @param type (week,year,quarter,month) calling particular function for computations
   * @author karan
   */
  range(type: any) {
    if (type.value) {
      this.rangeType = type.value;
    } else {
      this.rangeType = type;
    }
    this.openCalendar();
    let todayDate = new Date(this.selectedMonth);
    if (this.rangeType === 'week') {
      this.showCalendarInput = true;
      this.showCustomCalendar = false;
      let lastWeek = this.getWeeksInMonth(todayDate.getMonth(), todayDate.getFullYear());
      this.sendDate(lastWeek[lastWeek.length - 1])
    } else if (this.rangeType === 'month') {
      this.active = todayDate.getMonth();
      this.showCalendarInput = true;
      this.showCustomCalendar = false;
      this.currentMonth(todayDate.getMonth());
    } else if (this.rangeType === 'quarter') {
      let currentMonth = this.monthArray[todayDate.getMonth()];
      this.showCalendarInput = true;
      this.showCustomCalendar = false;
      this.quarterArray.forEach((element, index) => {
        let indexMonth = element.quarterInfo.indexOf(currentMonth);

        if (indexMonth >= 0) {
          this.active = indexMonth;
          this.sendDate(element, index);
        }
      });
    } else if (this.rangeType == 'year') {
      this.showCalendarInput = true;
      this.showCustomCalendar = false;
      this.active = this.year.indexOf(todayDate.getFullYear());
      this.sendDate(todayDate.getFullYear());
    } else if (this.rangeType === 'custom') {
      this.showCustomCalendar = true;
      this.showCalendarInput = false;
      this.showCalendar = false;
    } else {
      this.showCalendar = false;
      this.showCalendarInput = false;
    }
  }
  check(event) {
    if (this.rangeType !== 'year') {
      this.range(this.rangeType);
    }
  }
  /**
   * @method openCalendar()
   * @description: when user click on calendar div, opens an popup where he can select range like which month,year,quarter or month
   * based on that hiding div and displaying div
   * @author karan
   */
  openCalendar() {
    this.showCalendar = true;
    if (this.rangeType === 'week') {
      this.showMonthInfo = true;
      this.showYearCalendar = false;
      this.showQuarterCalendar = false;
      this.showWeeks = false;
      this.showYearInfo = true;
      this.showMonthCalendar = false;
      this.selectMonth(this.selectedMonth.getMonth());
    } else if (this.rangeType === 'month') {
      this.showMonthInfo = false;
      this.showYearCalendar = false;
      this.showQuarterCalendar = false;
      this.showWeeks = false;
      this.showYearInfo = true;
      this.showMonthCalendar = true;
    }
    else if (this.rangeType === 'year') {
      this.showMonthInfo = false;
      this.showYearCalendar = true
      this.showWeeks = false;
      this.showQuarterCalendar = false;;
      this.showYearInfo = false;
      this.showMonthCalendar = false;
    } else if (this.rangeType === 'quarter') {
      this.showYearCalendar = false;
      this.showMonthInfo = false;
      this.showWeeks = false;
      this.showQuarterCalendar = true;
      this.showYearInfo = true;
      this.showMonthCalendar = false;
    }
  }

  /**
   * @method displayCalendar()
   * @param type (month,year)
   * @description: if type is year then will show only year and vice versa for month
   * @author karan
   */
  displayCalendar(type) {
    this.showWeeks = false;
    if (type === 'month') {
      this.showYearCalendar = false;
      this.showMonthCalendar = true;
      this.active = this.monthArray.indexOf(this.Month)
    } else if (type === 'year') {
      this.showYearCalendar = true;
      this.showMonthCalendar = false;
    }
  }

  /**
   * @method currentMonth()
   * @param monthIndex (index of the selected month in UI)
   * @description: when the user select month then this func helps to compute for that particular month for example(Jan 1st to Jan 31st 2019).
   * @author karan
   */
  currentMonth(monthIndex) {
    let firstDate = new Date(this.selectedYear, monthIndex, 1);
    let lastDate = new Date(this.selectedYear, firstDate.getMonth() + 1, 0);
    const obj = {
      start: firstDate.getDate(),
      end: lastDate.getDate(),
      year: this.selectedYear,
      month: monthIndex
    }
    this.sendDate(obj);
  }

  /**
   * @method selectYears()
   * @param index (will get year index from year array)
   * @description: when the user click on year, doing the computations based on selected year but when the user is on week tab and select year 
   * then it should reflect the same weeks on that selected year
   * @author karan
   */
  selectYears(index) {
    this.active = index;
    let todayDate = new Date(this.selectedMonth);
    this.selectedYear = this.year[index];
    if (this.rangeType === 'year') {
      this.sendDate(this.selectedYear);
    } else if (this.rangeType === 'week' || this.rangeType === 'month') {
      this.selectMonth(this.selectedMonth.getMonth());
    } else if (this.rangeType === 'quarter') {

      let currentMonth = this.monthArray[todayDate.getMonth()];
      this.quarterArray.forEach(element => {
        let index = element.quarterInfo.indexOf(currentMonth);
        if (index >= 0) {
          this.sendDate(element);
        }
      });
    }
  }

  /**
   * @method selectMonth()
   * @param index (will get month index from monthArray)
   * @description: when the user click on monht, doing the computations based on selected month but when the user is on week tab and select month 
   * then it should reflect the same weeks on that selected year, month
   * @author karan
   */
  selectMonth(index) {
    this.selectedMonth = new Date(this.selectedYear, index, 1);
    this.Month = this.monthArray[index];
    let firstDate = new Date(this.selectedYear, index, 1);
    let lastDate = new Date(this.selectedYear, firstDate.getMonth() + 1, 0);
    if (this.rangeType === 'week') {
      if (this.showMonthCalendar) {
        this.active = this.monthArray[index];
      }
      this.showMonthCalendar = false; this.showYearCalendar = false;
      this.weeks = this.getWeeksInMonth(index, this.selectedYear);
    } else {
      const obj = {
        start: firstDate.getDate(),
        end: lastDate.getDate(),
        year: this.selectedYear,
        month: index
      };
      this.countToHideCalendar += 1;
      if (this.countToHideCalendar == 1) {
        this.showCalendar = false;
        this.countToHideCalendar = 0;
        this.durationCollections = duration;
      }
      this.active = index;
      this.sendDate(obj);
    }

  }

  selectQuarter(date, index?) {
    this.countToHideCalendar += 1;
    if (this.countToHideCalendar == 1) {
      this.showCalendar = false;
      this.countToHideCalendar = 0;
      this.durationCollections = duration;
    }
    this.sendDate(date, index);
  }

  selectWeek(date, index) {
    this.countToHideCalendar += 1;
    if (this.countToHideCalendar == 1) {
      this.showCalendar = false;
      this.countToHideCalendar = 0;
      this.durationCollections = duration;
    }
    this.sendDate(date, index);
  }

  /**
   * @method getWeeksInMonth()
   * @param month : index of the selected month
   * @param year : year (ex: 2019) of the selected year
   * @description: to get how many weeks are there in a month and if the starting date of the month starts from wednesday then 1st week will be
   * wed,thurs,fri,sat,sun and pushing into weeks array and returning
   * @author karan
   */
  getWeeksInMonth(month, year) {
    this.weeks = [];
    let firstDate = new Date(year, month, 1);
    let lastDate = new Date(year, firstDate.getMonth() + 1, 0);
    let numDays = lastDate.getDate();
    let currentDate = new Date();
    if (currentDate.getMonth() === lastDate.getMonth() && currentDate.getFullYear() === lastDate.getFullYear()) {
      if (currentDate.getDate() <= lastDate.getDate()) {
        // numDays = currentDate.getDate();
      }
    }

    let start = 1;
    let week = 0;
    let end = 7 - firstDate.getDay();
    while (start <= numDays) {
      this.weeks.push({ start: start, end: end, week: this.weekListText[week], year: firstDate.getFullYear(), month: firstDate.getMonth() });
      start = end + 1;
      end = end + 7;
      week = week + 1;
      if (end > numDays)
        end = numDays;
    }
    this.showWeeks = true;
    return this.weeks;
  }


  /**
   * @method decreaseYear()
   * @description: when the user click on descreaseYear btn then using the selectedYear we are decremnting the year array and reassinging to selected
   * year and calling range function for further compuations
   * @author karan
   */
  decreaseYear() {
    let x = this.year.indexOf(this.selectedYear);
    if (x > 0) {
      this.selectedYear = this.year[--x];
      this.range(this.rangeType);
    }
  }
  /**
 * @method decreaseMonth()
 * @description: when the user click on decreaseMonth btn then using the selectedMonth we are decremnting themonthArray and reassinging to 
 * selectedMonth and calling selectMonth function for further compuations
 * @author karan
 */
  decreaseMonth() {
    let x = this.selectedMonth.getMonth();
    if (x >= 0) {
      this.Month = this.monthArray[--x];
      this.selectMonth(x);
    }
  }
  /**
 * @method increaseYear()
 * @description: when the user click on increaseYear btn then using the selectedYear we are decremnting the year array and reassinging to 
 * selectedYear and calling range function for further compuations
 * @author karan
 */
  increaseYear() {
    let x = this.year.indexOf(this.selectedYear);
    if (x < this.year.length - 1) {
      this.selectedYear = this.year[++x];
      this.range(this.rangeType)
    }
  }
  /**
  * @method increaseMonth()
  * @description: when the user click on increaseMonth btn then using the selectedMonth we are decremnting the monthArray and reassinging to 
  * selectedMonth and calling selectMonth function for further compuations
  * @author karan
  */
  increaseMonth() {

    let x = this.selectedMonth.getMonth();
    if (x < this.monthArray.length - 1) {
      this.Month = this.monthArray[++x];
      this.selectMonth(x);
    }
  }

  /**
   * @method sendDate()
   * @param date (obj which contains month, date, startDate, endDate)
   * @description: this is where actual computation takes place and also to display from - to date in UI,
   * update graph in x axis as well based on how many weeks are there and dates in an month
   * and call sendIntialDate fn
   * @author karan
   */
  sendDate(date, index?) {
    this.xAxis = [];
    let fromDate;
    let toDate;
    if (this.rangeType === 'week' || this.rangeType === 'month') {
      fromDate = new Date(date.year, date.month, date.start);
      toDate = new Date(date.year, date.month, date.end);
    } else if (this.rangeType === 'year') {
      fromDate = new Date(this.selectedYear, 3, 1);
      this.countToHideCalendar += 1;
      if (this.countToHideCalendar == 2) {
        this.showCalendar = false;
        this.countToHideCalendar = 0;
        this.durationCollections = duration;
      }
      if (this.selectedYear === 2019) {
        toDate = new Date(this.selectedYear, 8, 1);
      } else {
        toDate = new Date(this.selectedYear + 1, 2, 31);
      }
    } else if (this.rangeType === 'quarter') {
      this.quarterInfo = date;
      fromDate = new Date(this.selectedYear, date.startMonth, date.startDate);
      this.active = index;
      toDate = new Date(this.selectedYear, date.endMonth, date.endDate);
      // this.selectedMonth = toDate;
    }


    this.fromData = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear() + ' - ' +
      toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear()
    this.filterForm.patchValue({ startDate: new Date(fromDate.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0] });
    this.filterForm.patchValue({ endDate: new Date(toDate.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0] });

    this.toData = toDate.getDate() + ' ' + this.monthArray[toDate.getMonth()] + ' ' + toDate.getFullYear();
    // this.showCalendar = false;
    if (this.initialGraph) {
      this.updatedGraph = true;
      this.initialGraph = false;
    } else {
      this.updatedGraph = false;
      this.initialGraph = true;
    }
    let x = fromDate.getDate();
    let countDate = fromDate.getDate();
    let y = toDate.getDate();

    if (this.rangeType === 'week') {
      while (x <= y) {
        this.xAxis.push(countDate + ' ' + this.monthArray[fromDate.getMonth()]);
        countDate++;
        x++;
      }
      this.active = index;
    } else if (this.rangeType === 'month') {
      let from = fromDate.getDate();
      let to = toDate.getDate();
      while (from <= to) {
        this.xAxis.push(from + ' ' + this.monthArray[fromDate.getMonth()]);
        from++;
      }
    }
    this.sendIntialDate(fromDate, toDate);
  }

  /**
   * @method sendIntialDate()
   * @param fromDate (from Date)
   * @param toDate (to Date)
   * @description: putting all the things in an array and using subscribe sending to parent component
   * @author karan
   */
  sendIntialDate(fromDate, toDate) {
    const array = [fromDate, toDate, this.updatedGraph, this.initialGraph, this.rangeType, this.quarterInfo, this.xAxis]
    // this.fetchDate.dateInfoAdded.next(array);
  }

  selectedJobType(event) {

    this.selectedJobTypeText = event.sendValue;
  }

  onSubmit() {
    const start = new Date(new Date(this.filterForm.value.startCustomDate).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    const end = new Date(new Date(this.filterForm.value.endDate).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    let request;
    if (this.user.userDetails.role != 'superadmin') {
      if(this.data!="History")
      request = '?jobType=' + this.filterForm.value.jobType.value + '&orgName=' + this.user.userDetails.vendor.orgName + '&flag=' + this.filterForm.value.flag.value + '&startDate=' + start + '&endDate=' +
        end;
      else
      request = '?jobType=' + this.filterForm.value.jobType.value + '&orgName=' + this.user.userDetails.vendor.orgName  + '&startDate=' + start + '&endDate=' +
      end;

    } else {
      if(this.data!="History")
      request = '?jobType=' + this.filterForm.value.jobType.value + '&flag=' + this.filterForm.value.flag.value + '&startDate=' + start + '&endDate=' +
      end;
      else 
      request = '?jobType=' + this.filterForm.value.jobType.value  + '&startDate=' + start + '&endDate=' +
      end;
    }   
     if (this.reportType == 'manual') {
      this.sharedService.display(true);
      if(this.data=="History"){
        this.associateService.fileDownload('associates/blocked/download' + request, true).subscribe(res => {
          if (res) {
            this.sharedService.display(false);
            this.close();
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            link.setAttribute('href', window.URL.createObjectURL(blob));
            link.setAttribute('download', `${this.selectedJobTypeText}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
       }
       else{
        this.associateService.fileDownload('associates/download' + request, true).subscribe(res => {
          if (res) {
            this.sharedService.display(false);
            this.close();
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            link.setAttribute('href', window.URL.createObjectURL(blob));
            link.setAttribute('download', `${this.selectedJobTypeText}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
       }
    } else {
      this.sharedService.display(true);
       if(this.data=="History"){
        this.associateService.fileDownload('associates/blocked/download' + request, true).subscribe(res => {
          if (res) {
            this.sharedService.display(false);
            this.close();
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            link.setAttribute('href', window.URL.createObjectURL(blob));
            link.setAttribute('download', `${this.selectedJobTypeText}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
       }
       else{
        this.associateService.fileDownload('associates/download' + request, true).subscribe(res => {
          if (res) {
            this.sharedService.display(false);
            this.close();
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            link.setAttribute('href', window.URL.createObjectURL(blob));
            link.setAttribute('download', `${this.selectedJobTypeText}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
       }   
    }
  }
  close() {
    this.dialogRef.close();
  }

}
