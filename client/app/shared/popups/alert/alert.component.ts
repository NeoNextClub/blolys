import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.scss']
})
export class AlertComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<AlertComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            type: 'warn' | 'primary' | 'default' | 'accent';
            title: string;
            body: string;
            ok: string;
            no: string;
        }
    ) {}

    ngOnInit() {}
    public ok() {
        this.dialogRef.close(true);
    }
}
