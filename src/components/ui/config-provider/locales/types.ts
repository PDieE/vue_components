import type { zhCN } from './zh-CN'

type DefaultMessages = typeof zhCN

export type UiMessages = {
  [Group in keyof DefaultMessages]: Record<keyof DefaultMessages[Group], string>
}

export type UiMessageKey = {
  [Group in keyof DefaultMessages]: `${Group}.${keyof DefaultMessages[Group] & string}`
}[keyof DefaultMessages]

type Message<K extends UiMessageKey> =
  K extends `${infer Group extends keyof DefaultMessages}.${infer Name}`
    ? Name extends keyof DefaultMessages[Group]
      ? DefaultMessages[Group][Name] & string
      : never
    : never

type MessageParameter<S extends string> = S extends `${string}{${infer Name}}${infer Rest}`
  ? Name | MessageParameter<Rest>
  : never

export type UiMessageArgs<K extends UiMessageKey> =
  MessageParameter<Message<K>> extends never
    ? []
    : [params: Record<MessageParameter<Message<K>>, string | number>]
