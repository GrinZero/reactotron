import { CommandType } from "reactotron-core-contract"
export const GROUPS: {
  name: string
  items: { value: string; text: string }[]
}[] = [
  {
    name: "All",
    items: [{ value: "all" as const, text: "All" }],
  },
  {
    name: "Informational",
    items: [
      { value: CommandType.Log, text: "Log" },
      { value: CommandType.Image, text: "Image" },
      { value: CommandType.Display, text: "Custom Display" },
    ],
  },
  {
    name: "General",
    items: [
      { value: CommandType.ClientIntro, text: "Connection" },
      { value: CommandType.Benchmark, text: "Benchmark" },
      { value: CommandType.ApiResponse, text: "API" },
    ],
  },
  {
    name: "Async Storage",
    items: [{ value: CommandType.AsyncStorageMutation, text: "Mutations" }],
  },
  {
    name: "State & Sagas",
    items: [
      { value: CommandType.StateActionComplete, text: "Action" },
      { value: CommandType.SagaTaskComplete, text: "Saga" },
      { value: CommandType.StateValuesChange, text: "Subscription Changed" },
    ],
  },
]

export const ALL_COMMANDS = GROUPS.reduce((acc, group) => {
  return acc.concat(group.items.map((item) => item.value))
}, [] as string[])
