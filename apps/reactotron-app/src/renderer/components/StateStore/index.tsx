/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { HTMLAttributes, useMemo, useState } from "react"
import { cls } from "@/util/cls"
import styled, { useTheme } from "styled-components"
import "./index.css"
import { Tooltip } from "reactotron-core-ui"
import debounce from "lodash.debounce"
import JsonViewer from "@andypf/json-viewer/dist/esm/react/JsonViewer"

export interface StateStoreProps extends HTMLAttributes<HTMLDivElement> {
  state: any
}

const SearchInput = styled.input`
  width: 100%;
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
  transition: all 0.2s;
`

export const StateStore: React.FC<StateStoreProps> = ({ className, state }) => {
  const theme = useTheme()

  const [search, setSearch] = useState(null)

  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value)
      }, 300),
    []
  )

  const content = useMemo(() => {
    if (!state) {
      return null
    }
    return Object.entries(state)
      .filter(([key]) => (key || "").toLowerCase().includes((search || "").toLowerCase()))
      .map(([key, value]) => {
        const isObject = typeof value === "object" && value !== null
        return (
          <div
            key={key}
            className={cls(
              "flex flex-row items-center w-full border-color-inherit hover:border-gray-300 transition-colors border border-solid border-color-inherit"
            )}
          >
            <div
              className="w-[18vw] flex-shrink-0 overflow-hidden pl-[8px]"
              title={key}
              data-for={`state-store-${key}`}
              data-tip={key}
            >
              {key}
              <Tooltip id={`state-store-${key}`} multiline />
            </div>
            <div className="w-3/4 border-l border-solid p-[8px] border-color-inherit flex-shrink-0">
              {isObject ? (
                <JsonViewer data={value} theme="classic-dark" />
              ) : value !== undefined ? (
                JSON.stringify(value)
              ) : (
                "undefined"
              )}
            </div>
          </div>
        )
      })
  }, [state, search])

  return (
    <div
      className={cls("w-full", className)}
      style={{
        color: theme.foreground,
        borderColor: theme.chromeLine,
      }}
    >
      <SearchInput
        className="search-input"
        onChange={(e) => {
          debounceSearch(e.target.value)
        }}
      />
      <div
        className="flex flex-row items-start w-full font-bold"
        style={{
          borderColor: theme.line,
        }}
      >
        <div className="w-[18vw] border border-solid p-[8px] border-color-inherit flex-shrink-0">
          Key
        </div>
        <div className="w-3/4 border border-l-0 border-solid p-[8px] border-color-inherit flex-shrink-0">
          Value
        </div>
      </div>
      {content}
    </div>
  )
}
