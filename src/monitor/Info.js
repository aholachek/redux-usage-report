import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const propTypes = {
  currentBreakpoint: PropTypes.string,
  setBreakpoint: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

const Header = styled.h3`
  font-size: 1.1rem;
  margin-top: 1.5rem;
  line-height: 1.3;
  margin-bottom: 1rem;
  font-weight: bold;
  color: ${props => props.theme.base05};
`

const Button = styled.button`
  margin: 0 0 1rem 0;
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

const SpacingWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const Info = ({ currentBreakpoint, setBreakpoint, theme }) => {
  const removeBreakpoint = () => setBreakpoint("")

  return (
    <div>
      <Header theme={theme}>About this tool</Header>
      <div>
        <p>
          This monitor shows you a view of your Redux store based on what parts of it your code has
          actually touched. Values that have not been accessed are faded out. To learn more, check
          out{" "}
          <a href="https://github.com/aholachek/redux-usage-report#redux-usage-report">
            the README.
          </a>
        </p>
      </div>
      <Header theme={theme}>Setting a breakpoint</Header>
      <div>
        {!!currentBreakpoint && (
          <div>
            There is currently a breakpoint set at{" "}
            <SpacingWrapper>
              <pre>
                <code>{currentBreakpoint}</code>
              </pre>
            </SpacingWrapper>
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
