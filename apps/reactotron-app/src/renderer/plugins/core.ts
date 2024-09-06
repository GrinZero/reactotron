import { ReactotronContext } from "reactotron-core-ui"

export type ReactotronContextProps =
  typeof ReactotronContext extends React.Context<infer P> ? P : never

export type TimeLinePlugin<T = unknown> = (options: T) => {
  meta: {
    value: string
    text: string
  }
  render: (context: ReactotronContextProps) => void
}

export interface ReactotronPlugin {
  type: "timeline"
}
