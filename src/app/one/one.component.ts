import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.css'],
})
export class OneComponent {
  otp: string = '';
  number = 0;
  @ViewChild('oref', { static: false }) otpRef: ElementRef<HTMLElement> | any;
  otpInputFields = {} as any;

  ngOnInit(): void {
    this.onSubmit();
    this.resetOtpFields();
  }

  onSubmit() {
    this.number++;
    if ('OTPCredential' in window) {
      this.number++;
      const ac = new AbortController();
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', (e) => {
          ac.abort();
        });
      }
      const otpCode: any = navigator.credentials;
      otpCode
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          this.otp = otp.code;
          alert(this.otp);
          if (form) form.submit();
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  resetOtpFields() {
    const sudoApp = ['', '', '', '', ''];
    this.otpInputFields.intakeReal = [];
    this.otpInputFields.intakeMasked = [];
    sudoApp.forEach((item) => {
      this.otpInputFields.intakeMasked.push(item);
    });
  }

  submit() {
    alert(this.otpInputFields.intakeReal);
    this.otpInputFields.intakeReal = [];
    this.otpInputFields.intakeMasked = [];
  }

  tabTrigger($event: any, $index: any) {
    const inputValue = $event.target.value;

    if (inputValue !== '*') {
      if (inputValue !== '') {
        this.otpInputFields.intakeReal[$index] = inputValue;
        this.otpInputFields.intakeMasked[$index] = '*';
        if ($index < 4) {
          this.otpRef.nativeElement[$index + 1].focus();
        }
      } else {
        // if not backspace
        // we rely on html 5 here to make sure we only get numeric values of single digits [0-9]
        // and focus on the first child
        this.otpRef.nativeElement[0].focus();
      }
    }
  }
}
