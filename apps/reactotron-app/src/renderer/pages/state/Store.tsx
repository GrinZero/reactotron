import React, { useContext, useEffect, useMemo } from "react"
import { MdImportExport } from "react-icons/md"
import { EmptyState, StateContext } from "reactotron-core-ui"
import styled from "styled-components"
import { StateStore } from "@/components/StateStore"

const SubscriptionsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const useLastedSnapshot = <T,>(snapshots: T[]) => {
  const lastSnapshot = useMemo(() => snapshots[snapshots.length - 1] || null, [snapshots])
  return lastSnapshot
}

function Store() {
  const { snapshots, setActions } = useContext(StateContext)

  useEffect(() => {
    setActions([])
  }, [])

  const lastSnapshot = useLastedSnapshot(snapshots)

  return (
    <SubscriptionsContainer>
      {!lastSnapshot ? (
        <EmptyState icon={MdImportExport} title="No State">
          Once your app connects and starts sending state, it will appear here
        </EmptyState>
      ) : (
        <StateStore state={lastSnapshot.state} />
      )}
    </SubscriptionsContainer>
  )
}

export default Store
