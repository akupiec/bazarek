import { Instance, render } from 'ink';
import { InkPainter } from './InkPainter';
import { createElement } from 'react';
import { InkProps, LogStatus } from './Interfaces';
import chalk from 'chalk';

export class ScreenPrinter {
  private ink: Instance;
  private msg?: string;
  private _spinner?: string;
  private _progress?: number;
  private _maxProgress?: number;

  constructor() {
    this.ink = render(createElement(InkPainter, { name: 'bazarek' }));
  }

  print() {
    const params: InkProps = {
      name: 'bazarek',
      msg: this.msg,
      spinner: this._spinner,
      progress: this._progress,
      maxProgress: this._maxProgress,
    };
    this.ink.rerender(createElement(InkPainter, params));
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

  spinner(msg: string) {
    this._spinner = msg;
    this.print();
  }

  stopSpinner() {
    this._spinner = undefined;
    this.print();
  }

  setProgress(current: number, max: number) {
    this._progress = current;
    this._maxProgress = max;
    this.print();
  }
}
