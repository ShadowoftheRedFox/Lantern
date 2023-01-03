export { }

import "./core.d.ts"
import "./data.d.ts"
import "./declaration.d.ts"
import "./type.d.ts"
import "./class.d.ts"

declare global {
    type Light = {
        x: number,
        y: number,
        px: number,
        py: number,
        id: number,
        radius: number,
        color: string,
        points: Point[],
        render: Point[],
        on: boolean
    }

    type Point = { x: number, y: number }
}