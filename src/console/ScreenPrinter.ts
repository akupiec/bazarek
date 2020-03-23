import { initConsole } from './consoleUtils';
import { LOGO_HEIGHT } from './logo';
import * as chalk from 'chalk';
import { Spinner } from '../utils/spinner';
const clui = require('clui');
const Progress = clui.Progress;
const Line = clui.Line;

enum LineType {
  String,
  Spinner,
  ProgressBar,
  TableRow,
}

interface LineData {
  yOffset: number;
  type?: LineType;
  message?: any;
  lineObj?: Spinner | any;
}

export class ScreenPrinter {
  private lineData: LineData[] = [
    {
      yOffset: LOGO_HEIGHT,
      message: chalk.green('READY!'),
      type: LineType.String,
    },
  ];

  constructor() {
    initConsole();
  }

  private static clearOldData(data: LineData) {
    if (data.type === LineType.Spinner) {
      data.lineObj.stop();
      data.lineObj = undefined;
      data.type = LineType.String;
    }
  }

  print() {
    this.lineData.forEach((value) => {
      process.stdout.cursorTo(0, value.yOffset);
      process.stdout.clearLine(0);
      if (value.type === LineType.String) {
        console.log(value.message);
      }
      if (value.type === LineType.Spinner && !value.lineObj.isSpinning()) {
        value.lineObj.start(4, value.yOffset);
      }
      if (value.type === LineType.ProgressBar) {
        console.log(value.lineObj.update(value.lineObj.__progress));
        process.stdout.moveCursor(60, -1);
        console.log(value.message);
      }
      if (value.type === LineType.TableRow) {
        value.lineObj.output();
      }
    });
  }

  setErrorMessage(idx: number, err: any) {
    this.setSuccessMessage(idx, err);
    this.lineData[idx].message = chalk.red('[ERROR] ' + err);
    this.print();
  }

  setSuccessMessage(idx: number, message: string) {
    if (this.lineData[idx]) {
      ScreenPrinter.clearOldData(this.lineData[idx]);
      this.lineData[idx].message = message;
    } else {
      this.lineData[idx] = {
        yOffset: LOGO_HEIGHT + idx,
        message: message,
        type: LineType.String,
      };
    }
    this.print();
  }

  setSpinner(idx: number, message: string) {
    this.setSuccessMessage(idx, message);
    const data = this.lineData[idx];
    data.message = message;
    data.type = LineType.Spinner;
    data.lineObj = new Spinner(message, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'], 250);
    this.print();
  }

  setProgressBar(idx: number, message: string) {
    this.setSuccessMessage(idx, message);
    const data = this.lineData[idx];
    data.message = message;
    data.type = LineType.ProgressBar;
    data.lineObj = new Progress(50);
    this.print();
  }

  updateMessage(idx, message: string) {
    const data = this.lineData[idx];
    data.message = message;

    if (data.type === LineType.Spinner) {
      data.lineObj.message(data.message);
    }
  }

  updateProgressBar(idx, curr: number, total: number) {
    const data = this.lineData[idx];

    if (data.type === LineType.ProgressBar) {
      data.lineObj.__progress = curr / total;
    }
    this.print();
  }

  addTableHeader(idx: number, strings: string[], length: number[]) {
    strings = strings.map((s) => chalk.cyan.bold(s));
    this.addTableRow(idx, strings, length);
  }

  addTableRow(idx: number, strings: string[], length: number[]) {
    if (this.lineData[idx]) {
      ScreenPrinter.clearOldData(this.lineData[idx]);
    }
    this.lineData[idx] = {
      yOffset: LOGO_HEIGHT + idx,
      type: LineType.TableRow,
      message: '',
      lineObj: new Line(),
    };

    strings.forEach((s, i) => this.lineData[idx].lineObj.column(s, length[i]));
  }
}
