import React, { Component } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import { InkProps } from './Interfaces';

const Logo = ({ isTTY, columns, name }) => {
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

export class InkPainter extends Component<InkProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      columns: process.stdout.columns,
    };
  }

  render() {
    let showSpinner: JSX.Element;
    if (this.props.spinner && process.stdout.isTTY) {
      showSpinner = <Spinner />;
    }
    return (
      <>
        <Logo isTTY={process.stdout.isTTY} columns={this.state.columns} name={this.props.name} />
        <Text>{this.props.msg}</Text>
        <Box>
          {showSpinner}
          <Text> {this.props.spinner}</Text>
        </Box>
      </>
    );
  }

  componentDidMount(): void {
    process.stdout.on('resize', () => {
      this.setState({ columns: 0 });
    });
  }
}
