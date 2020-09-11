import { Instance, render } from 'ink';
import { InkPainter } from './InkPainter';
import { createElement } from 'react';
import { LogStatus } from './Interfaces';
import chalk from 'chalk';

export class ScreenPrinter {
  private ink: Instance;
  private msg: string;
  private _spinner: string;

  constructor() {
    this.ink = render(createElement(InkPainter, { name: 'bazarek' }));
  }

  print() {
    this.ink.rerender(
      createElement(InkPainter, { name: 'bazarek', msg: this.msg, spinner: this._spinner }),
    );
  }

  log(msg: string, status?: LogStatus) {
    switch (status) {
      case LogStatus.Success:
        this.msg = chalk.green('[Success] ') + msg;
        break;
      default:
        this.msg = msg;
    }
    this.print();
  }

  // setSuccessMessage(idx: number, message: string) {
  //   if (this.lineData[idx]) {
  //     ScreenPrinter.clearOldData(this.lineData[idx]);
  //     this.lineData[idx].message = message;
  //   } else {
  //     this.lineData[idx] = {
  //       yOffset: LOGO_HEIGHT + idx,
  //       message: message,
  //       type: LineType.String,
  //     };
  //   }
  //   this.print();
  // }

  spinner(msg: string) {
    this._spinner = msg;
    this.print();
  }

  stopSpinner() {
    this._spinner = undefined;
    this.print();
  }
}
