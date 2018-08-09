export interface IBoard {
    name: string
    slug: string
    summary: string
    timestamp: number
}

export interface IPaging {
    previous?: string
    next?: string
}
