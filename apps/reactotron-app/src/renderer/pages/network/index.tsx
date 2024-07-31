/* eslint-disable react/display-name */
import React, { useCallback, useContext, useMemo, useState } from "react"
import { clipboard } from "electron"
import fs from "fs"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  ApiResponseDrawerCommand,
  EmptyState,
  ReactotronContext,
  TimelineContext,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep, MdSwapVert, MdReorder } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { TableVirtuoso, TableComponents } from "react-virtuoso"
import styled from "styled-components"
import classNames from "classnames"
import {
  Container,
  SearchContainer,
  SearchLabel,
  SearchInput,
  NetworkInspector,
  ButtonContainer,
  NetworkPageContainer,
  NetworkContainer,
  WaterfallContainer,
  WaterfallBar,
} from "./StyledComponents"

type NetworkCommandType = {
  type: string
  important: boolean
  payload: {
    request: {
      url: string
      method: string
      data: string
      headers: Record<string, string>
      params: any
    }
    response: {
      body: unknown
      status: number
      headers: Record<string, string>
    }
    duration: number
  }
  connectionId: number
  messageId: number
  date: Date
  deltaTime: number
  clientId: string
}

const TableRowStyled = styled(TableRow)`
  &:hover {
    background-color: ${(props) => props.theme.backgroundSubtleDark};
    cursor: pointer;
  }
  &.selected {
    background-color: ${(props) => props.theme.backgroundDark};
  }
`

function fixedHeaderContent() {
  return (
    <TableRow className="bg-[#1b1b1b]">
      <TableCell className="w-[40%]">URL</TableCell>
      <TableCell className="w-[7%]">Status</TableCell>
      <TableCell className="w-[8%]">Method</TableCell>
      <TableCell className="w-[12%]">Duration</TableCell>
      <TableCell className="w-[12%]">Size</TableCell>
      <TableCell className="w-[21%]">Waterfall</TableCell>
    </TableRow>
  )
}

function rowContent(
  _index: number,
  command: NetworkCommandType,
  firstTime: number,
  maxTime: number
) {
  const { payload, date } = command
  const { request, response, duration = 0 } = payload
  const { url, method } = request
  const { status } = response
  const size = response?.["Content-Length"] || JSON.stringify(response.body).length

  const durationStr =
    duration > 1000 ? `${(duration / 1000).toFixed(2)}s` : `${duration.toFixed(2)}ms`

  const waterfallWidth = (duration / (maxTime - firstTime)) * 100
  const waterfallLeft = ((date.getTime() - firstTime) / (maxTime - firstTime)) * 100
  const fill = status >= 200 && status < 300 ? "#34D399" : "#F87171"

  return (
    <>
      <TableCell className="flex-shrink-0">
        <div className="truncate">
          {url.replace(/^http(s):\/\/[^/]+/i, "").replace(/\?.*$/i, "")}
        </div>
      </TableCell>
      <TableCell className="flex-shrink-0">{status}</TableCell>
      <TableCell className="flex-shrink-0">{method}</TableCell>
      <TableCell className="flex-shrink-0">
        <div className="truncate">{durationStr}</div>
      </TableCell>
      <TableCell className="flex-shrink-0">{size}</TableCell>
      <TableCell className="!p-0">
        {/* Waterfall */}
        <WaterfallContainer>
          <WaterfallBar width={waterfallWidth} left={waterfallLeft} fill={fill} />
        </WaterfallContainer>
      </TableCell>
    </>
  )
}

function NetworkPage() {
  const [resizeEnabled, setResizeEnabled] = useState<boolean>(false)
  const { clearCommands, commands } = useContext(ReactotronContext)
  const [selectedRequest, setSelectedRequest] = useState<NetworkCommandType | null>(null)
  const [width, setWidth] = useState<number>(
    localStorage.getItem("networkInspectorWidth")
      ? parseInt(localStorage.getItem("networkInspectorWidth") as string)
      : 400
  )
  const {
    isSearchOpen,
    toggleSearch,
    closeSearch,
    setSearch,
    search,
    isReversed,
    toggleReverse,
    closeFilter,
    isFilterOpen,
    hiddenCommands,
    setHiddenCommands,
  } = useContext(TimelineContext)

  const filteredCommands = useMemo(() => {
    const cmds = filterCommands(commands, search, hiddenCommands).filter((a) =>
      a.type.startsWith("api.")
    )
    return (isReversed ? cmds.reverse() : cmds) as NetworkCommandType[]
  }, [commands, search, hiddenCommands, isReversed])

  const VirtuosoTableComponents: TableComponents<NetworkCommandType> = useMemo(
    () => ({
      Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
      )),
      Table: (props) => (
        <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }} />
      ),
      TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
      )),
      TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
      )),
    }),
    []
  )

  const TableRowMemo = useMemo(
    () =>
      React.forwardRef<HTMLTableRowElement, any>((props, ref) => (
        <TableRowStyled
          onClick={() => {
            setSelectedRequest((old) => {
              if (old === props.item) {
                return null
              }
              return props.item
            })
          }}
          className={classNames(
            selectedRequest && selectedRequest.messageId === props.item.messageId
              ? "!bg-gray-700"
              : "",
            "transition-colors"
          )}
          {...props}
          ref={ref}
        />
      )),
    [selectedRequest]
  )
  // @ts-expect-error ttt
  VirtuosoTableComponents.TableRow = TableRowMemo

  const [firstTime, maxTime] = useMemo(() => {
    if (filteredCommands.length === 0) return [0, 0] as const
    if (!isReversed) {
      return [
        filteredCommands[filteredCommands.length - 1].date.getTime(),
        filteredCommands[0].date.getTime(),
      ] as const
    }
    return [
      filteredCommands[0].date.getTime(),
      filteredCommands[filteredCommands.length - 1].date.getTime(),
    ] as const
  }, [filteredCommands, isReversed])

  const renderItemContent = useCallback(
    (index, command) => rowContent(index, command, firstTime, maxTime),
    [firstTime, maxTime]
  )

  return (
    <Container>
      <Header
        title="Network"
        isDraggable
        actions={[
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              toggleSearch()
            },
          },
          {
            tip: "Reverse Order",
            icon: MdSwapVert,
            onClick: () => {
              toggleReverse()
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearCommands()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput
              className="cleaner"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ButtonContainer
              onClick={() => {
                if (search === "") {
                  closeSearch()
                } else {
                  setSearch("")
                }
              }}
            >
              <FaTimes size={24} />
            </ButtonContainer>
          </SearchContainer>
        )}
      </Header>
      <NetworkPageContainer>
        {filteredCommands.length === 0 ? (
          <EmptyState icon={MdReorder} title="No Request">
            Once you make a network request, you will see it here.
          </EmptyState>
        ) : (
          <NetworkContainer>
            <Paper className="w-full h-full">
              <TableVirtuoso
                data={filteredCommands}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={renderItemContent}
              />
            </Paper>
            {!!selectedRequest && (
              <NetworkInspector className="z-[100] pb-[32px] right-0 fixed" style={{ width }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "5px",
                    backgroundColor: "transparent",
                    cursor: "col-resize",
                    zIndex: 1000,
                    paddingBottom: 32,
                  }}
                  onClick={() => {
                    setResizeEnabled(true)
                  }}
                  onMouseUp={() => {
                    setResizeEnabled(false)
                  }}
                  onMouseMove={(ev) => {
                    if (resizeEnabled) {
                      setWidth((f) => {
                        const newWidth = f - ev.movementX
                        localStorage.setItem("networkInspectorWidth", newWidth.toString())
                        return newWidth
                      })
                    }
                  }}
                />
                <ResponseDetailComponent command={selectedRequest} />
              </NetworkInspector>
            )}
          </NetworkContainer>
        )}
      </NetworkPageContainer>
      <TimelineFilterModal
        isOpen={isFilterOpen}
        onClose={() => {
          closeFilter()
        }}
        hiddenCommands={hiddenCommands}
        setHiddenCommands={setHiddenCommands}
      />
    </Container>
  )
}

const ResponseDetailComponent = ({ command }: { command: NetworkCommandType }) => {
  return (
    <ApiResponseDrawerCommand
      className="min-h-full"
      key={command.messageId}
      // @ts-expect-error ttt
      command={command}
      isOpen={true}
      copyToClipboard={clipboard.writeText}
      readFile={(path) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path, "utf-8", (err, data) => {
            if (err || !data) reject(new Error("Something failed"))
            else resolve(data)
          })
        })
      }}
    />
  )
}

export { NetworkPage }
export default NetworkPage
