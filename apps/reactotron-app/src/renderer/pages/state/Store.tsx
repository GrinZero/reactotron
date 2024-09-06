import React, { useContext, useEffect, useMemo } from "react"
import { MdImportExport } from "react-icons/md"
import { EmptyState, ReactotronContext, StateContext } from "reactotron-core-ui"
import styled from "styled-components"
import { StateStore } from "@/components/StateStore"
import { usePrevious } from "@/hooks"

const SubscriptionsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

function Store() {
  const { commands, removeCommand, sendCommand } = useContext(ReactotronContext)
  const { setActions } = useContext(StateContext)

  const latestCommand = useMemo(() => {
    return commands.find((command) => command.type === "store.update")
  }, [commands])
  const preCommand = usePrevious(latestCommand)

  useEffect(() => {
    if (preCommand?.messageId) {
      removeCommand(preCommand.messageId)
    }
  }, [preCommand, removeCommand])

  useEffect(() => {
    setActions([])
  }, [])

  return (
    <SubscriptionsContainer>
      {!latestCommand ? (
        <EmptyState icon={MdImportExport} title="No State">
          Once your app connects and starts sending state, it will appear here
        </EmptyState>
      ) : (
        <StateStore
          readonly={false}
          state={(latestCommand.payload as { state: any }).state}
          onStateChange={(key, value) => {
            sendCommand("store.user.change", { key, value })
          }}
        />
      )}
    </SubscriptionsContainer>
  )
}

export default Store
