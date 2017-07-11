// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';

class About extends PureComponent {
  static propTypes= {
    currentView:  PropTypes.string.isRequired,
    enterAbout:   PropTypes.func.isRequired,
    leaveAbout:   PropTypes.func.isRequired
  };

  componentDidMount() {
    const { enterAbout } = this.props;
    enterAbout();
  }

  componentWillUnmount() {
    const { leaveAbout } = this.props;
    leaveAbout();
  }

  render() {
    return(
        <h1>
          About
        </h1>
    );
  }
}

export default About;
