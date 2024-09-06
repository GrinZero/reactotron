// TODO: Name this better...
import React, { FunctionComponent, PropsWithChildren } from "react"
import type { Command } from "reactotron-core-contract"
import {
  ReactotronProvider,
  CustomCommandsProvider,
  ReactNativeProvider,
  TimelineProvider,
  StateProvider,
} from "reactotron-core-ui"

import KeybindHandler from "./KeybindHandler"

interface Props {
  commands: Command[]
  sendCommand: (type: string, payload: any, clientId?: string) => void
  removeCommand: (messageId: number) => void
  clearCommands: () => void
  addCommandListener: (callback: (command: Command) => void) => void
}

/** Wrapper for Reactotron context providers */
const ReactotronBrain: FunctionComponent<PropsWithChildren<Props>> = ({
  commands,
  sendCommand,
  removeCommand,
  clearCommands,
  addCommandListener,
  children,
}) => {
  return (
    <ReactotronProvider
      commands={commands}
      removeCommand={removeCommand}
      sendCommand={sendCommand}
      clearCommands={clearCommands}
      addCommandListener={addCommandListener}
    >
      <TimelineProvider>
        <StateProvider>
          <CustomCommandsProvider>
            <ReactNativeProvider>
              <KeybindHandler>{children}</KeybindHandler>
            </ReactNativeProvider>
          </CustomCommandsProvider>
        </StateProvider>
      </TimelineProvider>
    </ReactotronProvider>
  )
}

export default ReactotronBrain
