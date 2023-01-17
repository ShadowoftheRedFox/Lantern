export { }

import "./core"
import "./data"
import "./declaration"
import "./type"
import "./class"

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

    type GameObject = {
        x: number,
        y: number,
        px: number,
        py: number,
        points: Point[],
        transparent: boolean,
        physical: boolean,
        id: number,
        color: string,
        form: "rectangle" | "circle" | "triangle",
        rotation: number,
        size: number
    }

    type Point = { x: number, y: number }
}