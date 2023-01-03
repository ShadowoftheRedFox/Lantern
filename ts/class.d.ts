export { }

declare global {
    class GameInterfaces {
        /**
         * @param {GameInterfacesOptions} options
         * @param {GameScope} scope 
         */
        constructor(options: GameInterfacesOptions, scope: GameScope)
        asOwnCanvas: Boolean
        canvasGroup: string
        interfaceCanvas: HTMLCanvasElement | undefined

        zindex: number

        requiredImage: string[]
        requiredAudio: string[]

        transitionSpawnDuration: number
        transitionLeaveDuration: number
        transitionSpawn: boolean
        transitionLeave: boolean

        activated: boolean
        spawned: boolean
        needsUpdate: boolean
        resized: boolean

        validateOptions(options: GameInterfacesOptions, scope: GameScope): void
        render(scope: GameScope): void
        update(scope: GameScope): GameScope
    }

    class Vector2D {
        constructor(pX: number, pY: number)
        getX(): number
        setX(pX: number): void
        getY(): number
        setY(pY: number): void
        add(v: number): Vector2D
        subtract(v: number): Vector2D
        multiply(scalar: number): Vector2D
        divide(scalar: number): Vector2D
        length(): number
        normalise(): number
        /**
         * Vector from ptA to ptB.
         */
        from(ptA: Point2D, ptB: Point2D): Vector2D
    }

    class Point2D {
        constructor(pX: number, pY: number)
        getX(): number
        setX(pX: number): void
        getY(): number
        setY(pY: number): void
    }
}