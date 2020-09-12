import React, { Component } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
// @ts-ignore
import BigText from 'ink-big-text';
// @ts-ignore
import ProgressBar from 'ink-progress-bar';
import { InkProps } from './Interfaces';

const Logo = ({ isTTY, columns, name }: any) => {
  if (!isTTY) return <></>;
  if (columns < 75) return <></>;
  return (
    <Box>
      <Text color="yellow">
        <BigText text={name} align="center" />
      </Text>
    </Box>
  );
};

const MySpinner = ({ isTTY, msg }: any) => {
  if (!msg) return <></>;
  if (!isTTY) return <Text>{msg}</Text>;
  return (
    <Box>
      <Spinner />
      <Text> {msg}</Text>
    </Box>
  );
};

const MyProgress = ({ isTTY, current, max }: any) => {
  if (!max) return <></>;
  if (!isTTY) return <Text>to do: {max - current}</Text>;
  return (
    <Box>
      <ProgressBar left={10} percent={current / max} />
      <Text>
        {current} - {max}
      </Text>
    </Box>
  );
};

export class InkPainter extends Component<InkProps, any> {
  constructor(props: InkProps) {
    super(props);
    this.state = {
      columns: process.stdout.columns,
    };
  }

  render() {
    const tty = process.stdout.isTTY;

    return (
      <>
        <Logo isTTY={tty} columns={this.state.columns} name={this.props.name} />
        <Text>{this.props.msg}</Text>
        <MySpinner isTTY={tty} msg={this.props.spinner} />
        <MyProgress isTTY={tty} current={this.props.progress} max={this.props.maxProgress} />
      </>
    );
  }

  componentDidMount(): void {
    process.stdout.on('resize', () => {
      this.setState({ columns: 0 });
    });
  }
}
