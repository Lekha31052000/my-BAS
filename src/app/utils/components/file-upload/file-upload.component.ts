import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() public accept = 'image/*';
  @Output() private file = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  /* called whenever the file is being choosen */
  fileChanged(event: any) {
    let fileReader = new FileReader();
    let file = event.currentTarget.files[0];
    fileReader.onload = (e:any) => {
      this.file.emit({ file: file, data: e.target.result });
    }
    fileReader.readAsDataURL(event.currentTarget.files[0]);
    event.target.value = '';
  }

  /* to open the dialog/modal for browse files for uploading */
  open() {
    this.elementRef.nativeElement.querySelector('input').click();
  }

}
