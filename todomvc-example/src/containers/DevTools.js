import React from "react"
import { createDevTools } from "redux-devtools"
import DockMonitor from "redux-devtools-dock-monitor"
import { UsageMonitor } from "../redux-usage-report"

export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <UsageMonitor />
  </DockMonitor>
)
