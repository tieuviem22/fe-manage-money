export interface userInterface {
    username: string
}
export interface paramsTable {
    total: number,
    current: number,
    pageSize: number,
    createdAt: [string, string]
}
export interface itemNote {
    createdAt: string,
    description: string,
    money: number,
    title: string,
    _id: string,
    key: string
}
export interface generalState {
    totalMoney: number,
    items: {
      money: number,
      createdAt: string
    }[]
  }
