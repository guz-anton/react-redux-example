// @flow weak

import React, {
  PureComponent
}                     from 'react';
// import PropTypes      from 'prop-types';
import {Jumbotron}    from '../../components';
import AnimatedView   from '../../components/animatedView/AnimatedView';

class PageNotFound extends PureComponent {
  render() {
    return(
        <h1>
          Sorry this page does not exists...
        </h1>
    );
  }
}

export default PageNotFound;
