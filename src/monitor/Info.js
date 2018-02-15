import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const propTypes = {
  currentBreakpoint: PropTypes.string,
  setBreakpoint: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

const Button = styled.button`
  margin: 0;
  margin-bottom: 1rem;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: ${props => props.theme.base00};
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  background-color: ${props => props.theme.base0D};
  padding: 8px 12px;
  font-weight: bold;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: ${props => props.theme.base0D};
  }
`

const Info = ({ currentBreakpoint, setBreakpoint, theme }) => {
  const removeBreakpoint = () => setBreakpoint("")
  return (
    <div>
      <h3>What it shows</h3>
      <div>
        <p>
          This monitor shows you a view of your Redux store based on what parts of it your code has
          actually touched.
        </p>
        <p>Values that have not been accessed are faded out.</p>
        <p>
          To learn more, check out <a href=""> the README.</a>
        </p>
      </div>
      <h3>Setting a breakpoint</h3>
      <div>
        {!!currentBreakpoint && (
          <div>
            There is currently a breakpoint set at{" "}
            <pre>
              <code>{currentBreakpoint}</code>
            </pre>
            <Button onClick={removeBreakpoint} theme={theme}>
              Remove breakpoint
            </Button>
          </div>
        )}
        <p>Shift + click a key in the "Redux Usage" view to set a breakpoint.</p>
        <p>
          You can reload the page with your devtools open and execution will stop whenever that
          value in your store is accessed by your app.
        </p>
      </div>
    </div>
  )
}

Info.propTypes = propTypes

export default Info
