import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  currentBreakpoint: PropTypes.string,
  setBreakpoint: PropTypes.func.isRequired,
};

const Info = ({ currentBreakpoint, setBreakpoint }) => {
  const Button = styled.button``;
  const removeBreakpoint = () => setBreakpoint(null);
  return (
    <div>
      <h3>What it shows</h3>
      <div>
        <p>
          This monitor shows you a view of your Redux store based on what parts
          of it your app has actually touched.
        </p>
        <p>Values that have not been accessed at least once are faded out.</p>
        <p>
          The value access might have been meaningful, e.g. your app pulling a
          property to display to the user, or it might have been incidental, for
          instance it could have been accessed when making a shallow copy of its
          parent.
        </p>
        <p>The easiest way to find out is by setting a breakpoint.</p>
        <p>
          (To learn more, check out <a href=""> the README.</a>)
        </p>
      </div>
      <h3>Setting a Breakpoint</h3>
      <div>
        {!!currentBreakpoint && (
          <div>
            There is currently a breakpoint set at {currentBreakpoint}
            <Button onClick={removeBreakpoint}>Remove this breakpoint</Button>
          </div>
        )}
        <p>Shift + click a key to set a breakpoint.</p>
        <p>
          You can reload the page with your devtools open and execution will
          stop whenever that value in your store is accessed by your app.
        </p>
      </div>
    </div>
  );
};

Info.propTypes = propTypes;

export default Info;
