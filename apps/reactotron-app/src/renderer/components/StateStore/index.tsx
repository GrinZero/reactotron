/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { HTMLAttributes, useMemo, useState } from "react"
import { cls } from "@/util/cls"
import styled, { useTheme } from "styled-components"
import "./index.css"
import { Tooltip } from "reactotron-core-ui"
import debounce from "lodash.debounce"
// import JsonViewer from "@andypf/json-viewer/dist/esm/react/JsonViewer"
import ReactJson from "react-json-view-18"
import { FaPlus } from "react-icons/fa"
import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material"
import { MdDelete } from "react-icons/md"

const Input = styled.input`
  margin-right: 4px;
  width: 100%;
  border: 0;
  padding: 8px 5px;
  font-size: 14px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  color: ${(props) => props.theme.foregroundDark};
`

const H2Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${(props) => props.theme.foregroundDark};
`

export interface StateStoreProps extends HTMLAttributes<HTMLDivElement> {
  state: any
  readonly?: boolean
  onStateChange?: (key: string, value: any) => void
  onDelete?: (key: string) => void
  /**
   * @default false
   */
  allowDelete?: boolean
  /**
   * @default false
   */
  allowAdd?: boolean
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

const ModalContainer = styled.form`
  background-color: ${(props) => props.theme.backgroundSubtleDark};
`

export const StateStore: React.FC<StateStoreProps> = ({
  className,
  state,
  readonly = false,
  allowDelete = false,
  allowAdd = false,
  onStateChange,
  onDelete,
}) => {
  const theme = useTheme()

  const [search, setSearch] = useState(null)

  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value)
      }, 300),
    []
  )

  const [addModalOpen, setAddModalOpen] = useState(false)

  const handleClickAdd = () => {
    // 弹出新增 Key & 对应类型的表单
    // 点击确定后，将新增的 key & value 加入 state
    // 点击取消后，不做任何操作
    setAddModalOpen(true)
  }

  const content = useMemo(() => {
    if (!state) {
      return null
    }
    return Object.entries(state)
      .filter(([key]) => (key || "").toLowerCase().includes((search || "").toLowerCase()))
      .map(([key, value]) => {
        const isObject = typeof value === "object" && value !== null

        const ele = (() => {
          if (!readonly) {
            if (isObject) {
              return (
                <ReactJson
                  src={value}
                  theme="monokai"
                  onEdit={(add) => {
                    onStateChange?.(key, add.updated_src)
                  }}
                  onAdd={(add) => {
                    onStateChange?.(key, add.updated_src)
                  }}
                  onDelete={(add) => {
                    onStateChange?.(key, add.updated_src)
                  }}
                />
              )
            }

            if (typeof value === "string") {
              return (
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    onStateChange?.(key, e.target.value)
                  }}
                  className="cleaner"
                />
              )
            }

            if (typeof value === "number") {
              return (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    onStateChange?.(key, parseInt(e.target.value))
                  }}
                  className="cleaner"
                />
              )
            }

            if (typeof value === "boolean") {
              return (
                <label className="flex flex-row gap-1 items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => {
                      onStateChange?.(key, e.target.checked)
                    }}
                    className="cleaner"
                  />
                  <span>{value ? "true" : "false"}</span>
                </label>
              )
            }
          }

          if (isObject) {
            return <ReactJson src={value} theme="monokai" />
          }
          return value !== undefined ? JSON.stringify(value) : "undefined"
        })()

        return (
          <div
            key={key}
            className={cls(
              "flex flex-row items-center w-full border-color-inherit hover:border-gray-300 transition-colors border border-solid border-color-inherit"
            )}
          >
            <div
              className="w-[18vw] flex-shrink-0 overflow-hidden p-[8px] break-words cursor-auto"
              title={key}
              data-for={`state-store-${key}`}
              data-tip={key}
              onClick={() => {
                // electron copy
                navigator.clipboard.writeText(key)
                alert("Copied!")
              }}
            >
              {key}
              {allowDelete && (
                <button
                  className="transform translate-x-1 translate-y-[2px]"
                  onClick={() => {
                    onDelete?.(key)
                  }}
                >
                  <MdDelete />
                </button>
              )}
              <Tooltip id={`state-store-${key}`} multiline />
            </div>
            <div className="border-l border-solid p-[8px] border-color-inherit flex-shrink-0 flex-1">
              {ele}
            </div>
          </div>
        )
      })
  }, [state, search, allowDelete, readonly, onStateChange, onDelete])

  return (
    <div
      className={cls("w-full", className)}
      style={{
        color: theme.foreground,
        borderColor: theme.chromeLine,
      }}
    >
      <SearchInput
        className="cleaner"
        onChange={(e) => {
          debounceSearch(e.target.value)
        }}
        placeholder="Search"
      />
      <div
        className="flex flex-row items-start w-full font-bold border border-solid"
        style={{
          borderColor: theme.line,
        }}
      >
        <div className="w-[18vw] p-[8px] border-color-inherit flex-shrink-0 flex items-center">
          Key
          {allowAdd && (
            <button className="ml-1" onClick={handleClickAdd}>
              <FaPlus />
            </button>
          )}
        </div>
        <div className="border-l border-solid p-[8px] border-color-inherit flex-shrink-0 flex-1">
          Value
        </div>
      </div>
      {content}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalContainer
          className="flex flex-col gap-2 w-[80vw] h-[40vh] mx-auto my-[30vh] p-4 rounded-xl shadow-md cleaner"
          onSubmit={(e) => {
            e.preventDefault()
            const target = e.target as HTMLFormElement

            const keyEle = target.querySelector("#addKeyKey") as HTMLInputElement
            const valueTypeEle = target.querySelector("#addKeyValueType") as HTMLSelectElement

            const value = (() => {
              if (valueTypeEle.value === "string") {
                return ""
              }
              if (valueTypeEle.value === "number") {
                return 0
              }
              if (valueTypeEle.value === "object") {
                return {}
              }
              return null
            })()

            onStateChange?.(keyEle.value, value)
            setAddModalOpen(false)
            alert("Added!")
          }}
          id="addKey"
        >
          <H2Title>Add new key & value</H2Title>
          <TextField
            id="addKeyKey"
            label="key"
            placeholder="Enter the storage key"
            className="cleaner"
          />
          <FormControl fullWidth>
            <InputLabel id="value-type-label">valueType</InputLabel>
            <Select
              placeholder="Enter the storage type"
              label="valueType"
              labelId="value-type-label"
              id="addKeyValueType"
              defaultValue={"string"}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="object">Object</MenuItem>
            </Select>
          </FormControl>
          <div className="w-full flex-row justify-end flex">
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </div>
        </ModalContainer>
      </Modal>
    </div>
  )
}
