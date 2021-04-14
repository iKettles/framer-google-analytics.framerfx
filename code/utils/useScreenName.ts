import * as React from "react"

export function useScreenName(
    id: string
): React.MutableRefObject<string | null> {
    const screenNameRef = React.useRef(null)

    React.useLayoutEffect(() => {
        const domElement = document.getElementById(id)

        if (domElement) {
            const closestNavigation = domElement.closest(
                `[data-framer-component-type="NavigationContainer"]`
            )
            if (closestNavigation && closestNavigation.children.length > 0) {
                const screen = closestNavigation.children[0]

                // The screen we found was a responsive layout, return its currently visible child
                if (
                    screen.children.length > 0 &&
                    // @ts-ignore
                    screen.children[0].dataset.component === "ResponsiveLayout"
                ) {
                    screenNameRef.current =
                        // @ts-ignore
                        screen.children[0].dataset.activeScreenName
                } else {
                    screenNameRef.current = getScreenName(screen)
                }
            }
        }
    }, [])

    return screenNameRef
}

function getScreenName(screen: Element) {
    // @ts-ignore
    if (screen && screen.dataset && screen.dataset.framerName) {
        // @ts-ignore
        return screen.dataset.framerName
    }

    return null
}
