export { }

declare global {
    var GameAudiosToLoad: []
    var GameImagesToLoad: []

    const ConfigConst: {
        KEY: "cn40'9@W+9)S&7§:e9+.{&y&uÙtA!h[3R-31:l'5]]:h$0>@ui!0z$FIiU£lb9H6BFST+*§[TwSdjm7.6)26N§=>)068geSUeY£!R%[£0!£%+8.IQ&(N/&Ipi%)Lm;.B3}D/1hvnSNlZJA]G[,2}v(9[<}-73z=/pJ$kQ0UQhp<n<]--x!=S.O;.§§*tBPwE§£CmgiXK"
        DISCORD: "https://discord.gg/5mF5AHnRCr"
        GITHUB: "https://github.com/ShadowoftheRedFox/Kyrazail-Adventure-Dev.git"
        LANGUAGE: GameLanguage
        ZINDEX: {
            UNKNOWN: 0
            MAP: 1
            MAPANIMATED: 2
            ENTITIES: 3
            MAPOVER: 4
            MAPEFFECT: 5
            FIGHT: 6
            PLAYERQUIPEMENT: 7
            DIALOGUE: 8
            PAUSE: 9
            MAIN: 900
            INTRODUCTION: 950
            TRANSITION: 998
            LOADING: 999
            ERROR: 1000
        }
        TIP: string[]
        TITLE: string[]
        CONTAINER: HTMLElement | null
        MAINCONTAINER: HTMLElement | null
        DEBUG: boolean
    }

    const GameConfig: {
        willUpdate: false
        targetFps: 60
        alwaysRun: false
        /**
         * Combine KEYs name to a functionnality.
         * @see [all KEY name here](https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/#a-full-list-of-key-event-values)
         * @warn It is strongly not recommended to put same keys at two different functionnality, it may cause unexpected behaviors.
         */
        keyboard: {
            up: string[]
            down: string[]
            right: string[]
            left: string[]
            run: string[]
        }
    }

    const LoadingScreenManager: {
        w: number
        h: number

        progress: number
        interval: number
        progressMax: number
        progressLast: number
        refreshSpeed: number
        progressSmooth: number
        progressAnimation: number
        message: string

        ctx: CanvasRenderingContext2D | null
        viewport: HTMLCanvasElement | null

        trailingStep: number
        trailingCount: number
        trailingSpeed: number

        tipIndex: number
        tipCount: number
        tipSpeed: number

        stripeStep: number
        stripeSpeed: number
        stripeAlpha: number
        stripeColor: string

        animationW: number
        animationH: number
        animationStep: number
        animationImage: null
        animationMargin: number
        animationLastStep: number
        animationStepCount: number
        animationStepSpeed: number
        animationStepSpeedDistance: number
        animationPositionSpeed(w: number): number
        animationPosition: number
        calledEqual: false

        init(callWhenEqual: () => void): void
        end(): void
        edit(): void
        bar(): void
        animate(): void
        tip(): void
        title(): void
        addProgress(n: number): void
        setMaxProgress(n: number): void
        createPattern(color: string | "grey", alpha: number | 1): CanvasPattern
        progressFunction(): void
    }

    /**
     * Event handler for the game.
     */
    const GameEvent: {
        /** Will launch the given function when the given event is emited somewhere.*/
        on(event: string, listener: (...any: any[]) => {} | any): () => void
        /** Will launch the given function when the given event is emited somewhere, one time.*/
        once(event: string, listener: (...any: any[]) => {} | any): void
        /** Emit the given event, if there is a listener somewhere of the given event, he will fire.*/
        emit(event: string, ...args: any[]): void
        /** Remove a listener from an event.*/
        removeListener(event: string, listener: () => {} | any): void
        /** Remove all listener from an event is the event parameter is found, otherwise, delete all event.*/
        removeAllListener(event: string): void
    }

    const WindowManager: {
        data: {
            viewport: null
            ctx: CanvasRenderingContext2D
            created: boolean
        }
        init(): void
        beforeUnloadSetup(): void
        closeGame(): boolean
        reloadGame(): void
        /**
         * Show error on screen and stops the game.
         * @param error The error.
         */
        fatal(error: Error): void
    }

    const ScriptLoaderManager: {
        setup(plugins: GameScriptPreLoad[], number: number, call: () => {}): Promise<() => {}>
        parameters(name: string): object | {}
        _scripts: string[]
        _errorUrls: string[]
        _parameters: object
    }

    const DataLoaderManager: {
        setup(plugins: GameScriptPreLoad[], number: number, call: () => {}): Promise<() => {}>
        _datas: string[]
        _errorUrls: string[]
        _dataLoaded: object
    }

    const Utils: {
        /**
         * Return current date using the language format.
         * 
         * @method getDate
         * @static
         * @example "19/09/2009"
         */
        getDate(): string

        /**
         * Return the exact date in dd/mm/yyyy hh:mm:ss format.
         * 
         * @method getExactDate
         * @static
         * @example '05/17/2012 10:52:21'
         */
        getExactDate(): string

        /**
         * Remove any duplicate from the array, so it has every item once.
         * 
         * @method RemoveDuplicate
         * @param a The array we want to remove duplicates.
         * @since v1.0.2.5
         */
        RemoveDuplicate(a: any[]): any[]

        /**
         * Checks whether the browser is Android Chrome.
         *
         * @static
         * @method isAndroidChrome
         * @return {Boolean} True if the browser is Android Chrome
         */
        isAndroidChrome(): boolean

        /**
         * Checks whether the browser is Mobile Safari.
         *
         * @static
         * @method isMobileSafari
         * @return {Boolean} True if the browser is Mobile Safari
         */
        isMobileSafari(): boolean

        /**
         * Checks whether the platform is a mobile device.
         *
         * @static
         * @method isMobileDevice
         * @return {Boolean} True if the platform is a mobile device
         */
        isMobileDevice(): boolean

        /**
         * Checks whether the platform is NW.js.
         *
         * @static
         * @method isNwjs
         * @return {Boolean} True if the platform is NW.js
         */
        isNwjs(): boolean
        /** 
         * Convert an amount of ms in a string.
         * @param ms The amount of ms to convert.
         */
        convertDate(ms: number): string
    }

    const KeyboardTrackerManager: {
        init(): void
        /**
         * Check if at least one of the key inside if the array is pressed.
         * @param array An array of key to check.
         */
        pressed(array: string[]): boolean
        array: string[]
        map: { [name: string]: boolean }
    }

    const MouseTrackerManager: {
        init(): void
        /**
         * Whether or not the pointer is being pushed down.
         */
        holding: boolean;
        /**
         * Whether or not the cursor is moving.
         */
        moving: boolean;

        /**
         * The last move of each pointer.
         */
        lastMove: { [id: number]: { x: number, y: number, date: number, id: number } };
        /**
         * The last couple of move of each pointer.
         */
        oldMove: { [id: number]: { x: number, y: number, date: number, id: number } };

        /**
         * The spawn coordinates of each cursor.
         */
        spawnCoos: { [id: number]: { x: number, y: number, date: number, id: number } };

        /**
         * Check whether or not the mouse is over the given rectangle. Every frame, reset to false coordinate and saves true ones.
         * To get the current check over without the frame reset, switch old to true.
         * @param x
         * @param y
         * @param w
         * @param h
         * @param old If we include a check on old coordinates
         * @returns {boolean} If it's over ot not.
         */
        checkOver(x: number, y: number, w: number, h: number, old?: boolean): boolean

        /**
         * Check whether or not the mouse is clicking over the given rectangle. 
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {boolean} If it's holding over ot not.
         */
        clickOver(x: number, y: number, w: number, h: number): boolean

        getCursorVector(id: number): Vector2D
    }

    /**
     * All rectangle are created centered by the given x y coordinates.
     */
    const RectangleCreator: {
        /**
         * Draws a rounded rectangle using the current state of the canvas.
         * If you omit the last three params, it will draw a rectangle
         * outline with a 5 pixel border radius
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} [radius = 5] The corner radius. It can also be an object to specify different radius for corners
         * @param {Number} [radius.tl = 0] Top left
         * @param {Number} [radius.tr = 0] Top right
         * @param {Number} [radius.br = 0] Bottom right
         * @param {Number} [radius.bl = 0] Bottom left
         * @param {Boolean} [fill = false] Whether to fill the rectangle.
         * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
         */
        roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius?: number, fill?: boolean, stroke?: boolean): void
        /**
         * Create a frame with the given parameters. Draw it like a stroke rectangle with shady background.
         * @param scope Scope.
         * @param ctx The context to draw on to.
         * @param x Upper left corner x coordinate.
         * @param y Upper left corner x coordinate.
         * @param w Width of the rectangle.
         * @param h Heigth of the rectangle.
         */
        frameRectangleTrans(scope: GameScope, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void
        /**
         * Create a frame with the given parameters. Draw it like a stroke rectangle.
         * @param scope Scope.
         * @param ctx The context to draw on to.
         * @param x Upper left corner x coordinate.
         * @param y Upper left corner x coordinate.
         * @param w Width of the rectangle.
         * @param h Heigth of the rectangle.
         */
        frameRectangle(scope: GameScope, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void
        /**
         * Create a frame with the given parameters. Draw it like a stroke rectangle with an image inside.
         * @param scope Scope.
         * @param ctx The context to draw on to.
         * @param x Upper left corner x coordinate.
         * @param y Upper left corner x coordinate.
         * @param w Width of the rectangle.
         * @param h Heigth of the rectangle.
         * @param imageToDraw The image you want to draw inside the frame.
         * @param ix Upper left corner x coordinate of the image.
         * @param iy Upper left corner x coordinate of the image.
         * @param iw Width of the rectangle of the image.
         * @param ih Heigth of the rectangle of the image.
         */
        frameRectangle(scope: GameScope, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, imageToDraw: HTMLImageElement, ix: number, iy: number, iw: number, ih: number): void
    }

    const ArrowDrawer: {
        /**
         * Draw a pixelised arrow.
         * @param a direction the arrow is pointing
         * @param c color of the arrow
         * @returns the arrow image on the canvas
         */
        pixel(a: ("up" | "down" | "right" | "left") | "right", c: (string | CanvasGradient | CanvasPattern) | "black"): HTMLCanvasElement
        /**
         * Draw an arrow hat.
         * @param a direction the arrow is pointing
         * @param c color of the arrow
         * @returns the arrow image on the canvas
         */
        hat(a: ("up" | "down" | "right" | "left") | "right", c: (string | CanvasGradient | CanvasPattern) | "black"): HTMLCanvasElement
    }

    const GameSaveManager: {
        /**
         * Create a save file and download it if online, write a file if on app.
         * @param SaveFileName The name of the file that will be downloaded.
         */
        save(SaveFileName: string): void

        /**
         * Load when on the app all the files in the save folder.
         * Return string[] on reject.
         */
        load(): Promise<GameSaveLoadObject>

        /**
         * Get the amount of save file in the save folder.
         * If error, reject error.
         * If online, or no savae file, return 0.
         * Doesn't count autosave files.
         */
        getSaveNumber(): Promise<number | 0>

        /**
         * Where the last autosave has been made.
         */
        lastAutoSave: 1 | 2

        /**
         * Create an auto save file and save in the lastAutoSave.
         */
        autoSave(): void
    }

    /**
     * Remove any duplicate from the array, so it has every item once.
     */
    function RemoveDuplicate(a: any[]): any[]

    /**
     * Edit the canvas element on the html page to the new dimension.
     * @param canvas canvas element
     * @param neww width of the canvas
     * @param newh heigth of the canvas
     */
    function regenerateCanvas(canvas: HTMLCanvasElement, neww: number, newh: number): void

    /**
     * Create a canvas element on the html page.
     * @param w width of the canvas
     * @param h heigth of the canvas
     * @param i z-index of the canvas
     */
    function generateCanvas(w: number, h: number, i?: number): HTMLCanvasElement

    /**
     * Get the pixel ratio depending of the current device.
     * @param context the wanted context ration
     */
    function getPixelRatio(context: CanvasRenderingContext2D): number

    /**
     * Regenerate all canvas element to the given dimension.
     * @param neww The new window width
     * @param newh The new window height
     */
    function regenerateAllCanvas(neww: number, newh: number): void

    /**
     * Remove an element off the dom.
     * @param id The id of the element to remove
     * @returns The success or not of the operation
     */
    function removeElement(id: string): boolean

    function TransitionEffectBuild(scope: GameScope, duration: number): void
    function TransitionEffectFade(scope: GameScope, duration: number): void
    function TransitionEffectCancel(scope: GameScope): void

    /**
     * Draw an underline under a given text and position.
     * @param context The context to draw onto.
     * @param text The text that will be underlined.
     * @param x The text x position.
     * @param y The text y position.
     * @param color The underline line color.
     * @param textSize The size of the text.
     * @param align The alignment of the text.
     */
    function underline(context: CanvasRenderingContext2D, text: string, x: number, y: number, color: string | CanvasGradient | CanvasPattern, textSize: string, align: CanvasTextAlign): void

    /**
     * Translate a code message and return the translated message.
     * 
     * Arguments must be passed in the correct order, and translated before if needed. (Maybe it will be done automatically).
     * @param messageCode The code message to translate.
     * @param args The arguments if needed.
     * @returns The translated message.
     * @example GameTranslate("CheckPlayerNameCorrect", "Kyra")
     * // if the game is in language "en":
     * => "Your name is Kyra, is that correct?"
     * @since v1.0.2.5
     */
    function GameTranslate(messageCode: string, args?: any[] | undefined): string


    interface Window {
        /** The game object. */
        game: GameScope
    }

    interface Array<T> {
        /** 
         * Return a random element of the array. 
         */
        random(): T | undefined
        /**
         * Check whether the two arrays are the same.
         * @param array The array to compare to.
         */
        equals(array: any[]): boolean
        /**
         * Return the element starting by the end of the array.
         * @param n The index starting from the end. Default is 0.
         */
        last(n: number | 0): T

        /**
         * Return the index of the element starting from the end.
         * @param n the index starting from the end. Default is 0.
         */
        reverseIndex(n: number | 0): number

        [n: number]: T
    }

    interface String {
        /**
         * Check whether the string contains a given string.
         * Basically the same as inclides, but has a wider support range.
         * @param string The string ti search for.
         */
        contains(string: string): boolean
        /**
         * Replaces %1, %2 and so on in the string to the arguments.
         * Return a formatted string.
         * @param args The value to replace, in order.
         * @example
         * "%1 %2 and %3".format("0", "8", "7") => "0 8 and 7"
         * "%3 %2 and %1".format("0", "8", "7") => "7 8 and 0"
         */
        format(...args: any): string
        /**
         * Put a capital letter on the first character of each words.
         */
        CapitalizeFirstLetterSentence(): string
        /** 
         * Put a capital letter on the first character of the string.
         */
        CapitalizeFirstLetterWord(): string
    }

    interface Number {
        /**
         * Return a number between the given range.
         * @param min The lower boundary.
         * @param max The upper boundary.
         */
        clamp(min: number, max: number): number
    }

    interface Math {
        /**
         * Return a random sign.
         */
        randomSign(): 1 | -1
    }
}