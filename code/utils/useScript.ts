import { useState, useEffect } from "react"
import { RenderTarget } from "framer"

const cachedScripts = []

/**
 * Roughly equivalent to importing a script using
 *
 * ```html
 * <script src="..."></script>
 * ```
 *
 * @param src the script to load
 * @returns [loaded, error] where loaded is a boolean value indicating if the script has loaded and
 * error is a boolean value indicating if there wasn error loading the script.
 */
export function useScript(src: string) {
    const isPreview = RenderTarget.current() === RenderTarget.preview

    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false,
        wasCached: false,
    })

    useEffect(() => {
        if (!isPreview) {
            // Only load the script during preview.
            return
        }

        // If cachedScripts array already includes src that means another instance ...
        // ... of this hook already loaded this script, so no need to load again.
        if (cachedScripts.indexOf(src) !== -1) {
            setState({
                loaded: true,
                error: false,
                wasCached: true,
            })
        } else {
            cachedScripts.push(src)

            // Create script
            let script = document.createElement("script")
            script.src = src
            // script.async = true

            // Script event listener callbacks for load and error
            const onScriptLoad = () => {
                setState({
                    loaded: true,
                    error: false,
                    wasCached: false,
                })
            }

            const onScriptError = () => {
                // Remove from cachedScripts we can try loading again
                const index = cachedScripts.indexOf(src)
                if (index >= 0) cachedScripts.splice(index, 1)
                script.remove()

                setState({
                    loaded: true,
                    error: true,
                    wasCached: false,
                })
            }

            script.addEventListener("load", onScriptLoad)
            script.addEventListener("error", onScriptError)

            // const headFirstChild = document.head.firstChild;

            // if(!headFirstChild) {
            //   document.head.append
            // }

            // // Add script to document body
            // document.body.appendChild(script)

            document.head.prepend(script)

            // Remove event listeners on cleanup
            return () => {
                script.removeEventListener("load", onScriptLoad)
                script.removeEventListener("error", onScriptError)
            }
        }
    }, [src, isPreview]) // Only re-run effect if script src changes

    return [state.loaded, state.error, state.wasCached]
}
