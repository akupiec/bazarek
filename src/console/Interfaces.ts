export enum LineType {
  String,
  Spinner,
}

export enum LogStatus {
  Success,
}

export interface InkProps {
  name: string;
  msg?: string;
  spinner?: string;
}
