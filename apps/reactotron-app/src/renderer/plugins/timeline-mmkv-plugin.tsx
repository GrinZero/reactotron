import React from "react"
import { TimeLinePlugin } from "./core"
import { EmptyState, timelineCommandResolver } from "reactotron-core-ui"
import { MdReorder } from "react-icons/md"
import { clipboard } from "electron"
import fs from "fs"

export const TimeLineMMKVPlugin: TimeLinePlugin = () => {
  return {
    meta: {
      value: "mmkv",
      text: "MMKV",
    },
    render: ({ commands, sendCommand, openDispatchModal }) => {
      const dispatchAction = (action: any) => sendCommand("state.action.dispatch", { action })
      const filteredCommands = commands.filter(
        (command) => command.type === "display" && command.payload?.name === "MMKV"
      )
      if (filteredCommands.length === 0) {
        return (
          <EmptyState icon={MdReorder} title="No Activity">
            Once your app connects and starts sending events, they will appear here.
          </EmptyState>
        )
      }

      const DisplayCommand = timelineCommandResolver("display")
      return (
        <>
          {filteredCommands.map((command) => {
            return (
              <DisplayCommand
                key={command.messageId}
                command={command}
                copyToClipboard={clipboard.writeText}
                readFile={(path) => {
                  return new Promise((resolve, reject) => {
                    fs.readFile(path, "utf-8", (err, data) => {
                      if (err || !data) reject(new Error("Something failed"))
                      else resolve(data)
                    })
                  })
                }}
                sendCommand={sendCommand}
                dispatchAction={dispatchAction}
                openDispatchDialog={openDispatchModal}
              />
            )
          })}
        </>
      )
    },
  }
}
export default TimeLineMMKVPlugin
