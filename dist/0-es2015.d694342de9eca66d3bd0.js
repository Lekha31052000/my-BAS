(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{Q9vn:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var i=t("mrSG"),a=t("0uJq"),r=t("8Y7J"),l=t("iInd"),s=t("dFDH");let o=(()=>{class e{constructor(e,n){this.router=e,this.snackBar=n}canActivate(e,n){return this.isAllowable(n.url,e.data)}isAllowable(e,n){let t=!1;if(this.modulePermissions){let e=this.modulePermissions.filter(e=>e.modulename.toLowerCase()===n.module_name.toLowerCase());if(e.length>0){let i=e[0].resources.filter(e=>e.resourcename.toLowerCase()===n.resource_name.toLowerCase());i.length>0&&i[0].permissions.filter(e=>"read"===e.toLowerCase()).length>0&&(t=!0)}}return!(!this.authData.token||!t)||(this.snackBar.open("You do not have permission to access these details...!","",window.snackBarBottom),!1)}canActivateChild(e,n){return!0}canLoad(e,n){return!0}}return e.ngInjectableDef=r.dc({factory:function(){return new e(r.ec(l.l),r.ec(s.b))},token:e,providedIn:"root"}),i.b([Object(a.i)("auth")],e.prototype,"authData",void 0),i.b([Object(a.i)("mod")],e.prototype,"modulePermissions",void 0),e})()},abRS:function(e,n,t){"use strict";t.d(n,"a",(function(){return l})),t.d(n,"b",(function(){return m}));var i=t("8Y7J"),a=t("xkgV"),r=t("SVse"),l=i.Cb({encapsulation:2,styles:["\n.ngx-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ngx-pagination::before, .ngx-pagination::after {\n    content: ' ';\n    display: table; }\n  .ngx-pagination::after {\n    clear: both; }\n  .ngx-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ngx-pagination li {\n    display: inline-block; }\n  .ngx-pagination a,\n  .ngx-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ngx-pagination a:hover,\n    .ngx-pagination button:hover {\n      background: #e6e6e6; }\n  .ngx-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ngx-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ngx-pagination .disabled:hover {\n      background: transparent; }\n  .ngx-pagination a, .ngx-pagination button {\n    cursor: pointer; }\n\n.ngx-pagination .pagination-previous a::before,\n.ngx-pagination .pagination-previous.disabled::before { \n  content: '\xab';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ngx-pagination .pagination-next a::after,\n.ngx-pagination .pagination-next.disabled::after {\n  content: '\xbb';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ngx-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n.ngx-pagination .small-screen {\n  display: none; }\n@media screen and (max-width: 601px) {\n  .ngx-pagination.responsive .small-screen {\n    display: inline-block; } \n  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {\n    display: none; }\n}\n  "],data:{}});function s(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,3,"a",[["tabindex","0"]],[[1,"aria-label",0]],[[null,"keyup.enter"],[null,"click"]],(function(e,n,t){var a=!0;return"keyup.enter"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).previous()&&a),"click"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).previous()&&a),a}),null,null)),(e()(),i.Xb(1,null,[" "," "])),(e()(),i.Eb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(3,null,["",""]))],null,(function(e,n){var t=n.component;e(n,0,0,t.previousLabel+" "+t.screenReaderPageLabel),e(n,1,0,t.previousLabel),e(n,3,0,t.screenReaderPageLabel)}))}function o(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,3,"span",[],null,null,null,null,null)),(e()(),i.Xb(1,null,[" "," "])),(e()(),i.Eb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(3,null,["",""]))],null,(function(e,n){var t=n.component;e(n,1,0,t.previousLabel),e(n,3,0,t.screenReaderPageLabel)}))}function u(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,4,"li",[["class","pagination-previous"]],[[2,"disabled",null]],null,null,null,null)),(e()(),i.tb(16777216,null,null,1,null,s)),i.Db(2,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null),(e()(),i.tb(16777216,null,null,1,null,o)),i.Db(4,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null)],(function(e,n){e(n,2,0,1<i.Qb(n.parent.parent,2).getCurrent()),e(n,4,0,i.Qb(n.parent.parent,2).isFirstPage())}),(function(e,n){e(n,0,0,i.Qb(n.parent.parent,2).isFirstPage())}))}function c(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,5,"a",[["tabindex","0"]],null,[[null,"keyup.enter"],[null,"click"]],(function(e,n,t){var a=!0;return"keyup.enter"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).setCurrent(e.parent.context.$implicit.value)&&a),"click"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).setCurrent(e.parent.context.$implicit.value)&&a),a}),null,null)),(e()(),i.Eb(1,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(2,null,[""," "])),(e()(),i.Eb(3,0,null,null,2,"span",[],null,null,null,null,null)),(e()(),i.Xb(4,null,["",""])),i.Tb(5,2)],null,(function(e,n){e(n,2,0,n.component.screenReaderPageLabel);var t="..."===n.parent.context.$implicit.label?n.parent.context.$implicit.label:i.Yb(n,4,0,e(n,5,0,i.Qb(n.parent.parent.parent,0),n.parent.context.$implicit.label,""));e(n,4,0,t)}))}function p(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,5,null,null,null,null,null,null,null)),(e()(),i.Eb(1,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(2,null,[""," "])),(e()(),i.Eb(3,0,null,null,2,"span",[],null,null,null,null,null)),(e()(),i.Xb(4,null,["",""])),i.Tb(5,2)],null,(function(e,n){e(n,2,0,n.component.screenReaderCurrentLabel);var t="..."===n.parent.context.$implicit.label?n.parent.context.$implicit.label:i.Yb(n,4,0,e(n,5,0,i.Qb(n.parent.parent.parent,0),n.parent.context.$implicit.label,""));e(n,4,0,t)}))}function g(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,4,"li",[],[[2,"current",null],[2,"ellipsis",null]],null,null,null,null)),(e()(),i.tb(16777216,null,null,1,null,c)),i.Db(2,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null),(e()(),i.tb(16777216,null,null,1,null,p)),i.Db(4,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null)],(function(e,n){e(n,2,0,i.Qb(n.parent.parent,2).getCurrent()!==n.context.$implicit.value),e(n,4,0,i.Qb(n.parent.parent,2).getCurrent()===n.context.$implicit.value)}),(function(e,n){e(n,0,0,i.Qb(n.parent.parent,2).getCurrent()===n.context.$implicit.value,"..."===n.context.$implicit.label)}))}function d(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,3,"a",[["tabindex","0"]],[[1,"aria-label",0]],[[null,"keyup.enter"],[null,"click"]],(function(e,n,t){var a=!0;return"keyup.enter"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).next()&&a),"click"===n&&(a=!1!==i.Qb(e.parent.parent.parent,2).next()&&a),a}),null,null)),(e()(),i.Xb(1,null,[" "," "])),(e()(),i.Eb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(3,null,["",""]))],null,(function(e,n){var t=n.component;e(n,0,0,t.nextLabel+" "+t.screenReaderPageLabel),e(n,1,0,t.nextLabel),e(n,3,0,t.screenReaderPageLabel)}))}function h(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,3,"span",[],null,null,null,null,null)),(e()(),i.Xb(1,null,[" "," "])),(e()(),i.Eb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(e()(),i.Xb(3,null,["",""]))],null,(function(e,n){var t=n.component;e(n,1,0,t.nextLabel),e(n,3,0,t.screenReaderPageLabel)}))}function b(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,4,"li",[["class","pagination-next"]],[[2,"disabled",null]],null,null,null,null)),(e()(),i.tb(16777216,null,null,1,null,d)),i.Db(2,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null),(e()(),i.tb(16777216,null,null,1,null,h)),i.Db(4,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null)],(function(e,n){e(n,2,0,!i.Qb(n.parent.parent,2).isLastPage()),e(n,4,0,i.Qb(n.parent.parent,2).isLastPage())}),(function(e,n){e(n,0,0,i.Qb(n.parent.parent,2).isLastPage())}))}function f(e){return i.Zb(0,[(e()(),i.Eb(0,0,null,null,8,"ul",[["class","ngx-pagination"],["role","navigation"]],[[1,"aria-label",0],[2,"responsive",null]],null,null,null,null)),(e()(),i.tb(16777216,null,null,1,null,u)),i.Db(2,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null),(e()(),i.Eb(3,0,null,null,1,"li",[["class","small-screen"]],null,null,null,null,null)),(e()(),i.Xb(4,null,[" "," / "," "])),(e()(),i.tb(16777216,null,null,1,null,g)),i.Db(6,278528,null,0,r.j,[i.Z,i.V,i.y],{ngForOf:[0,"ngForOf"]},null),(e()(),i.tb(16777216,null,null,1,null,b)),i.Db(8,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null)],(function(e,n){var t=n.component;e(n,2,0,t.directionLinks),e(n,6,0,i.Qb(n.parent,2).pages),e(n,8,0,t.directionLinks)}),(function(e,n){var t=n.component;e(n,0,0,t.screenReaderPaginationLabel,t.responsive),e(n,4,0,i.Qb(n.parent,2).getCurrent(),i.Qb(n.parent,2).getLastPage())}))}function m(e){return i.Zb(2,[i.Rb(0,r.d,[i.A]),(e()(),i.Eb(1,0,null,null,3,"pagination-template",[],null,[[null,"pageChange"]],(function(e,n,t){var i=!0;return"pageChange"===n&&(i=!1!==e.component.pageChange.emit(t)&&i),i}),null,null)),i.Db(2,737280,[["p",4]],0,a.d,[a.e,i.i],{id:[0,"id"],maxSize:[1,"maxSize"]},{pageChange:"pageChange"}),(e()(),i.tb(16777216,null,null,1,null,f)),i.Db(4,16384,null,0,r.k,[i.Z,i.V],{ngIf:[0,"ngIf"]},null)],(function(e,n){var t=n.component;e(n,2,0,t.id,t.maxSize),e(n,4,0,!(t.autoHide&&i.Qb(n,2).pages.length<=1))}),null)}},pBi1:function(e,n,t){"use strict";t.d(n,"d",(function(){return g})),t.d(n,"c",(function(){return d})),t.d(n,"b",(function(){return p})),t.d(n,"a",(function(){return l}));var i=t("8Y7J"),a=t("KCVW"),r=(t("s7LF"),t("Xd0L"));const l=new i.v("mat-slide-toggle-default-options",{providedIn:"root",factory:()=>({disableToggleValue:!1,disableDragValue:!1})});let s=0;class o{constructor(e,n){this.source=e,this.checked=n}}class u{constructor(e){this._elementRef=e}}const c=Object(r.F)(Object(r.B)(Object(r.C)(Object(r.D)(u)),"accent"));class p extends c{constructor(e,n,t,a,r,l,o,u){super(e),this._focusMonitor=n,this._changeDetectorRef=t,this._ngZone=r,this.defaults=l,this._animationMode=o,this._dir=u,this._onChange=e=>{},this._onTouched=()=>{},this._uniqueId=`mat-slide-toggle-${++s}`,this._required=!1,this._checked=!1,this._dragging=!1,this.name=null,this.id=this._uniqueId,this.labelPosition="after",this.ariaLabel=null,this.ariaLabelledby=null,this.change=new i.p,this.toggleChange=new i.p,this.dragChange=new i.p,this.tabIndex=parseInt(a)||0}get required(){return this._required}set required(e){this._required=Object(a.b)(e)}get checked(){return this._checked}set checked(e){this._checked=Object(a.b)(e),this._changeDetectorRef.markForCheck()}get inputId(){return`${this.id||this._uniqueId}-input`}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e||Promise.resolve().then(()=>this._onTouched())})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}_onChangeEvent(e){e.stopPropagation(),this._dragging||this.toggleChange.emit(),this._dragging||this.defaults.disableToggleValue?this._inputElement.nativeElement.checked=this.checked:(this.checked=this._inputElement.nativeElement.checked,this._emitChangeEvent())}_onInputClick(e){e.stopPropagation()}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}focus(e){this._focusMonitor.focusVia(this._inputElement,"keyboard",e)}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(new o(this,this.checked))}_getDragPercentage(e){let n=e/this._thumbBarWidth*100;return this._previousChecked&&(n+=100),Math.max(0,Math.min(n,100))}_onDragStart(){if(!this.disabled&&!this._dragging){const e=this._thumbEl.nativeElement;this._thumbBarWidth=this._thumbBarEl.nativeElement.clientWidth-e.clientWidth,e.classList.add("mat-dragging"),this._previousChecked=this.checked,this._dragging=!0}}_onDrag(e){if(this._dragging){const n=this._dir&&"rtl"===this._dir.value?-1:1;this._dragPercentage=this._getDragPercentage(e.deltaX*n),this._thumbEl.nativeElement.style.transform=`translate3d(${this._dragPercentage/100*this._thumbBarWidth*n}px, 0, 0)`}}_onDragEnd(){if(this._dragging){const e=this._dragPercentage>50;e!==this.checked&&(this.dragChange.emit(),this.defaults.disableDragValue||(this.checked=e,this._emitChangeEvent())),this._ngZone.runOutsideAngular(()=>setTimeout(()=>{this._dragging&&(this._dragging=!1,this._thumbEl.nativeElement.classList.remove("mat-dragging"),this._thumbEl.nativeElement.style.transform="")}))}}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}}class g{}class d{}},xkgV:function(e,n,t){"use strict";t.d(n,"a",(function(){return f})),t.d(n,"e",(function(){return r})),t.d(n,"c",(function(){return g})),t.d(n,"d",(function(){return b})),t.d(n,"b",(function(){return o}));var i=t("8Y7J"),a=t("SVse"),r=function(){function e(){this.change=new i.p,this.instances={},this.DEFAULT_ID="DEFAULT_PAGINATION_ID"}return e.prototype.defaultId=function(){return this.DEFAULT_ID},e.prototype.register=function(e){null==e.id&&(e.id=this.DEFAULT_ID),this.instances[e.id]?this.updateInstance(e)&&this.change.emit(e.id):(this.instances[e.id]=e,this.change.emit(e.id))},e.prototype.updateInstance=function(e){var n=!1;for(var t in this.instances[e.id])e[t]!==this.instances[e.id][t]&&(this.instances[e.id][t]=e[t],n=!0);return n},e.prototype.getCurrentPage=function(e){if(this.instances[e])return this.instances[e].currentPage},e.prototype.setCurrentPage=function(e,n){if(this.instances[e]){var t=this.instances[e];n<=Math.ceil(t.totalItems/t.itemsPerPage)&&1<=n&&(this.instances[e].currentPage=n,this.change.emit(e))}},e.prototype.setTotalItems=function(e,n){this.instances[e]&&0<=n&&(this.instances[e].totalItems=n,this.change.emit(e))},e.prototype.setItemsPerPage=function(e,n){this.instances[e]&&(this.instances[e].itemsPerPage=n,this.change.emit(e))},e.prototype.getInstance=function(e){return void 0===e&&(e=this.DEFAULT_ID),this.instances[e]?this.clone(this.instances[e]):{}},e.prototype.clone=function(e){var n={};for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n},e}(),l=function(e,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,n)},s=Number.MAX_SAFE_INTEGER,o=function(){function e(e){this.service=e,this.state={}}return e.prototype.transform=function(e,n){if(!(e instanceof Array)){var t=n.id||this.service.defaultId();return this.state[t]?this.state[t].slice:e}var i,a,r=n.totalItems&&n.totalItems!==e.length,l=this.createInstance(e,n),o=l.id,u=l.itemsPerPage;if(this.service.register(l),!r&&e instanceof Array){if(this.stateIsIdentical(o,e,i=(l.currentPage-1)*(u=+u||s),a=i+u))return this.state[o].slice;var c=e.slice(i,a);return this.saveState(o,e,c,i,a),this.service.change.emit(o),c}return this.saveState(o,e,e,i,a),e},e.prototype.createInstance=function(e,n){return this.checkConfig(n),{id:null!=n.id?n.id:this.service.defaultId(),itemsPerPage:+n.itemsPerPage||0,currentPage:+n.currentPage||1,totalItems:+n.totalItems||e.length}},e.prototype.checkConfig=function(e){var n=["itemsPerPage","currentPage"].filter((function(n){return!(n in e)}));if(0<n.length)throw new Error("PaginatePipe: Argument is missing the following required properties: "+n.join(", "))},e.prototype.saveState=function(e,n,t,i,a){this.state[e]={collection:n,size:n.length,slice:t,start:i,end:a}},e.prototype.stateIsIdentical=function(e,n,t,i){var a=this.state[e];return!!a&&!(a.size!==n.length||a.start!==t||a.end!==i)&&a.slice.every((function(e,i){return e===n[t+i]}))},function(e,n,t,i){var a,r=arguments.length,l=r<3?n:null===i?i=Object.getOwnPropertyDescriptor(n,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,n,t,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(r<3?a(l):r>3?a(n,t,l):a(n,t))||l);return r>3&&l&&Object.defineProperty(n,t,l),l}([Object(i.L)({name:"paginate",pure:!1}),l("design:paramtypes",[r])],e)}(),u=function(e,n,t,i){var a,r=arguments.length,l=r<3?n:null===i?i=Object.getOwnPropertyDescriptor(n,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,n,t,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(r<3?a(l):r>3?a(n,t,l):a(n,t))||l);return r>3&&l&&Object.defineProperty(n,t,l),l},c=function(e,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,n)};function p(e){return!!e&&"false"!==e}var g=function(){function e(){this.maxSize=7,this.previousLabel="Previous",this.nextLabel="Next",this.screenReaderPaginationLabel="Pagination",this.screenReaderPageLabel="page",this.screenReaderCurrentLabel="You're on page",this.pageChange=new i.p,this._directionLinks=!0,this._autoHide=!1,this._responsive=!1}return Object.defineProperty(e.prototype,"directionLinks",{get:function(){return this._directionLinks},set:function(e){this._directionLinks=p(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"autoHide",{get:function(){return this._autoHide},set:function(e){this._autoHide=p(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"responsive",{get:function(){return this._responsive},set:function(e){this._responsive=p(e)},enumerable:!0,configurable:!0}),u([Object(i.x)(),c("design:type",String)],e.prototype,"id",void 0),u([Object(i.x)(),c("design:type",Number)],e.prototype,"maxSize",void 0),u([Object(i.x)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"directionLinks",null),u([Object(i.x)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"autoHide",null),u([Object(i.x)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"responsive",null),u([Object(i.x)(),c("design:type",String)],e.prototype,"previousLabel",void 0),u([Object(i.x)(),c("design:type",String)],e.prototype,"nextLabel",void 0),u([Object(i.x)(),c("design:type",String)],e.prototype,"screenReaderPaginationLabel",void 0),u([Object(i.x)(),c("design:type",String)],e.prototype,"screenReaderPageLabel",void 0),u([Object(i.x)(),c("design:type",String)],e.prototype,"screenReaderCurrentLabel",void 0),u([Object(i.I)(),c("design:type",i.p)],e.prototype,"pageChange",void 0),u([Object(i.k)({selector:"pagination-controls",template:'\n    <pagination-template  #p="paginationApi"\n                         [id]="id"\n                         [maxSize]="maxSize"\n                         (pageChange)="pageChange.emit($event)">\n    <ul class="ngx-pagination" \n        role="navigation" \n        [attr.aria-label]="screenReaderPaginationLabel" \n        [class.responsive]="responsive"\n        *ngIf="!(autoHide && p.pages.length <= 1)">\n\n        <li class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks"> \n            <a tabindex="0" *ngIf="1 < p.getCurrent()" (keyup.enter)="p.previous()" (click)="p.previous()" [attr.aria-label]="previousLabel + \' \' + screenReaderPageLabel">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isFirstPage()">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li> \n\n        <li class="small-screen">\n            {{ p.getCurrent() }} / {{ p.getLastPage() }}\n        </li>\n\n        <li [class.current]="p.getCurrent() === page.value" \n            [class.ellipsis]="page.label === \'...\'"\n            *ngFor="let page of p.pages">\n            <a tabindex="0" (keyup.enter)="p.setCurrent(page.value)" (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">\n                <span class="show-for-sr">{{ screenReaderPageLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span>\n            </a>\n            <ng-container *ngIf="p.getCurrent() === page.value">\n                <span class="show-for-sr">{{ screenReaderCurrentLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span> \n            </ng-container>\n        </li>\n\n        <li class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="directionLinks">\n            <a tabindex="0" *ngIf="!p.isLastPage()" (keyup.enter)="p.next()" (click)="p.next()" [attr.aria-label]="nextLabel + \' \' + screenReaderPageLabel">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isLastPage()">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li>\n\n    </ul>\n    </pagination-template>\n    ',styles:["\n.ngx-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ngx-pagination::before, .ngx-pagination::after {\n    content: ' ';\n    display: table; }\n  .ngx-pagination::after {\n    clear: both; }\n  .ngx-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ngx-pagination li {\n    display: inline-block; }\n  .ngx-pagination a,\n  .ngx-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ngx-pagination a:hover,\n    .ngx-pagination button:hover {\n      background: #e6e6e6; }\n  .ngx-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ngx-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ngx-pagination .disabled:hover {\n      background: transparent; }\n  .ngx-pagination a, .ngx-pagination button {\n    cursor: pointer; }\n\n.ngx-pagination .pagination-previous a::before,\n.ngx-pagination .pagination-previous.disabled::before { \n  content: '\xab';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ngx-pagination .pagination-next a::after,\n.ngx-pagination .pagination-next.disabled::after {\n  content: '\xbb';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ngx-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n.ngx-pagination .small-screen {\n  display: none; }\n@media screen and (max-width: 601px) {\n  .ngx-pagination.responsive .small-screen {\n    display: inline-block; } \n  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {\n    display: none; }\n}\n  "],changeDetection:i.h.OnPush,encapsulation:i.ab.None})],e)}(),d=function(e,n,t,i){var a,r=arguments.length,l=r<3?n:null===i?i=Object.getOwnPropertyDescriptor(n,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,n,t,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(r<3?a(l):r>3?a(n,t,l):a(n,t))||l);return r>3&&l&&Object.defineProperty(n,t,l),l},h=function(e,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,n)},b=function(){function e(e,n){var t=this;this.service=e,this.changeDetectorRef=n,this.maxSize=7,this.pageChange=new i.p,this.pages=[],this.changeSub=this.service.change.subscribe((function(e){t.id===e&&(t.updatePageLinks(),t.changeDetectorRef.markForCheck(),t.changeDetectorRef.detectChanges())}))}return e.prototype.ngOnInit=function(){void 0===this.id&&(this.id=this.service.defaultId()),this.updatePageLinks()},e.prototype.ngOnChanges=function(e){this.updatePageLinks()},e.prototype.ngOnDestroy=function(){this.changeSub.unsubscribe()},e.prototype.previous=function(){this.checkValidId(),this.setCurrent(this.getCurrent()-1)},e.prototype.next=function(){this.checkValidId(),this.setCurrent(this.getCurrent()+1)},e.prototype.isFirstPage=function(){return 1===this.getCurrent()},e.prototype.isLastPage=function(){return this.getLastPage()===this.getCurrent()},e.prototype.setCurrent=function(e){this.pageChange.emit(e)},e.prototype.getCurrent=function(){return this.service.getCurrentPage(this.id)},e.prototype.getLastPage=function(){var e=this.service.getInstance(this.id);return e.totalItems<1?1:Math.ceil(e.totalItems/e.itemsPerPage)},e.prototype.getTotalItems=function(){return this.service.getInstance(this.id).totalItems},e.prototype.checkValidId=function(){null==this.service.getInstance(this.id).id&&console.warn('PaginationControlsDirective: the specified id "'+this.id+'" does not match any registered PaginationInstance')},e.prototype.updatePageLinks=function(){var e=this,n=this.service.getInstance(this.id),t=this.outOfBoundCorrection(n);t!==n.currentPage?setTimeout((function(){e.setCurrent(t),e.pages=e.createPageArray(n.currentPage,n.itemsPerPage,n.totalItems,e.maxSize)})):this.pages=this.createPageArray(n.currentPage,n.itemsPerPage,n.totalItems,this.maxSize)},e.prototype.outOfBoundCorrection=function(e){var n=Math.ceil(e.totalItems/e.itemsPerPage);return n<e.currentPage&&0<n?n:e.currentPage<1?1:e.currentPage},e.prototype.createPageArray=function(e,n,t,i){i=+i;for(var a=[],r=Math.ceil(t/n),l=Math.ceil(i/2),s=e<=l,o=r-l<e,u=!s&&!o,c=i<r,p=1;p<=r&&p<=i;){var g=this.calculatePageNumber(p,e,i,r);a.push({label:c&&(2===p&&(u||o)||p===i-1&&(u||s))?"...":g,value:g}),p++}return a},e.prototype.calculatePageNumber=function(e,n,t,i){var a=Math.ceil(t/2);return e===t?i:1===e?e:t<i?i-a<n?i-t+e:a<n?n-a+e:e:e},d([Object(i.x)(),h("design:type",String)],e.prototype,"id",void 0),d([Object(i.x)(),h("design:type",Number)],e.prototype,"maxSize",void 0),d([Object(i.I)(),h("design:type",i.p)],e.prototype,"pageChange",void 0),d([Object(i.m)({selector:"pagination-template,[pagination-template]",exportAs:"paginationApi"}),h("design:paramtypes",[r,i.i])],e)}(),f=function(e,n,t,i){var a,r=arguments.length,l=r<3?n:null===i?i=Object.getOwnPropertyDescriptor(n,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,n,t,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(r<3?a(l):r>3?a(n,t,l):a(n,t))||l);return r>3&&l&&Object.defineProperty(n,t,l),l}([Object(i.B)({imports:[a.b],declarations:[o,g,b],providers:[r],exports:[o,g,b]})],(function(){}))}}]);