import React, { useContext } from "react"
import { StateContext } from "reactotron-core-ui"
import { Header } from "../../components/Header"
import { Container } from "../reactNative/components/Shared"
import { MdStore, MdImportExport, MdNotificationsNone, MdStorage } from "react-icons/md"
import { Outlet } from "react-router-dom"

export default function StateIndex() {
  const { actions } = useContext(StateContext)
  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Store",
            route: "/state/store",
            icon: MdStore,
          },
          {
            text: "Storage",
            route: "/state/storage",
            icon: MdStorage,
          },
          {
            text: "Subscriptions",
            icon: MdNotificationsNone,
            route: "/state/subscriptions",
          },
          {
            text: "Snapshots",
            route: "/state/snapshots",
            icon: MdImportExport,
          },
        ]}
        actions={actions}
      />
      <Outlet />
    </Container>
  )
}
