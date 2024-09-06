import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { MdImportExport } from "react-icons/md"
import { EmptyState, ReactotronContext, StateContext } from "reactotron-core-ui"
import styled from "styled-components"
import { StateStore } from "@/components/StateStore"
import type { Command } from "reactotron-core-contract"

const SubscriptionsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

function Storage() {
  const { commands, sendCommand } = useContext(ReactotronContext)
  const { setActions } = useContext(StateContext)

  const [storage, setStorage] = useState<null | object>(null)
  const mergedSet = useRef<Set<number>>(new Set())

  const initStoreCommand = useMemo(() => {
    return commands.find((command) => command.type === "storage.init")
  }, [commands]) as Command<string, { state: object }>

  useEffect(() => {
    setActions([])
  }, [])

  useEffect(() => {
    if (initStoreCommand) {
      setStorage(initStoreCommand.payload.state)
    }
  }, [initStoreCommand])

  useEffect(() => {
    const updateCommands = commands.filter(
      (command) => command.type === "storage.change" && !mergedSet.current.has(command.messageId)
    ) as Command<string, { key: string; value: any }>[]

    const mergedState: Record<any, any> = {}
    updateCommands.forEach((command) => {
      mergedState[command.payload.key] = command.payload.value
      mergedSet.current.add(command.messageId)
    })

    if (Object.keys(mergedState).length > 0) {
      setStorage((prev) => {
        if (!prev) {
          return mergedState
        }
        return { ...prev, ...mergedState }
      })
    }
  }, [commands])

  return (
    <SubscriptionsContainer>
      {!storage ? (
        <EmptyState icon={MdImportExport} title="No Storage">
          Once your app sending init storage, it will appear here
        </EmptyState>
      ) : (
        <StateStore
          readonly={false}
          state={storage}
          onStateChange={(key, value) => {
            sendCommand("storage.user.change", { key, value })
          }}
          allowAdd
          allowDelete
          onDelete={(key) => {
            sendCommand("storage.user.delete", { key })
          }}
        />
      )}
    </SubscriptionsContainer>
  )
}

export default Storage
