export type LocaleMessages = Record<string, string>;

export type LocalePack = {
  code: string;
  name: string;
  messages: LocaleMessages;
};
