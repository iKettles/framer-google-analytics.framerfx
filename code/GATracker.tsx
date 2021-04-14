import * as React from "react"
import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsInCurrentNavigationTarget,
} from "framer"
import ErrorPlaceholder from "./ErrorPlaceholder"
import { useScript } from "./utils/useScript"
import { useScreenName } from "./utils/useScreenName"

interface GATrackerProps {
    id: string
    width: number
    height: number
    trackingId?: string
    screenName: string
    showInstructions: boolean
}

export const GATracker: React.FC<GATrackerProps> = (props) => {
    const { trackingId } = props
    const screenName = useScreenName(props.id)
    const isInTarget = useIsInCurrentNavigationTarget()
    const [loaded, error, wasCached] = useScript(
        `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    )

    React.useEffect(() => {
        if (!loaded || error || !trackingId || wasCached) {
            return
        }

        gtag("js", new Date())
        gtag("config", trackingId, {
            send_page_view: false,
            transport_type: "xhr",
            linker: {
                domains: ["framercanvas.com", "framer.com"],
            },
            cookie_flags: "max-age:7200;secure;samesite=none",
        })
    }, [loaded, error, trackingId])

    React.useEffect(() => {
        if (
            RenderTarget.current() !== RenderTarget.preview ||
            !loaded ||
            error ||
            !screenName.current ||
            !trackingId ||
            !isInTarget ||
            !screenName.current
        ) {
            return
        }
        gtag("event", "page_view", {
            page_title: screenName.current,
            page_location: window.location.origin,
            page_path: `/${encodeURIComponent(screenName.current)}`,
            send_to: trackingId,
        })
    }, [isInTarget, screenName, loaded, error, trackingId])

    if (error) {
        return (
            <ErrorPlaceholder
                title={"Error loading GA"}
                message={"We were unable to load the Google Analytics script."}
            />
        )
    }

    if (!trackingId) {
        return (
            <ErrorPlaceholder
                title={"Missing Tracking ID"}
                message={
                    "You need to add a valid GA Measurement ID to the property controls of this component ->"
                }
            />
        )
    }

    if (RenderTarget.current() === RenderTarget.thumbnail) {
        return <Icon />
    }

    if (RenderTarget.current() === RenderTarget.canvas) {
        if (!props.showInstructions) {
            return <Icon />
        }

        return <Instructions />
    }

    return null
}

GATracker.defaultProps = {
    width: 500,
    height: 600,
}

addPropertyControls(GATracker, {
    trackingId: {
        type: ControlType.String,
        title: "Tracking ID",
        placeholder: "G-XXXXXXXXXX",
    },
    showInstructions: {
        type: ControlType.Boolean,
        title: "Instructions",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "hide",
    },
})

function Icon() {
    return (
        <svg
            style={{
                width: "100%",
                height: "100%",
                maxWidth: "50px",
                maxHeight: "50px",
            }}
            version="1.1"
            id="Layer_1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 2195.9 2430.9"
            xmlSpace="preserve"
        >
            <path
                style={{ fill: "#F9AB00" }}
                d="M2195.9 2126.7c.9 166.9-133.7 302.8-300.5 303.7-12.4.1-24.9-.6-37.2-2.1-154.8-22.9-268.2-157.6-264.4-314V316.1c-3.7-156.6 110-291.3 264.9-314 165.7-19.4 315.8 99.2 335.2 264.9 1.4 12.2 2.1 24.4 2 36.7v1823z"
            />
            <path
                style={{ fill: "#E37400" }}
                d="M301.1 1828.7c166.3 0 301.1 134.8 301.1 301.1s-134.8 301.1-301.1 301.1S0 2296.1 0 2129.8s134.8-301.1 301.1-301.1zm792.2-912.5c-167.1 9.2-296.7 149.3-292.8 316.6v808.7c0 219.5 96.6 352.7 238.1 381.1 163.3 33.1 322.4-72.4 355.5-235.7 4.1-20 6.1-40.3 6-60.7v-907.4c.3-166.9-134.7-302.4-301.6-302.7-1.7 0-3.5 0-5.2.1z"
            />
        </svg>
    )
}

function Instructions(props) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                fontSize: 16,
                fontWeight: 500,
                textAlign: "left",
                color: "#bb88ff",
                backgroundColor: "#2f2546",
                border: "1px solid #8855ff",
                padding: 32,
                overflow: "hidden",
            }}
        >
            <h3>Instructions 🔎 </h3>
            <ol style={{ lineHeight: 2 }}>
                <li>
                    <b>Tracking ID</b>: Enter your Google Analytics Measurement
                    ID in the component's property controls {"->"}
                </li>
                <li>
                    <b>Instructions</b>: Enable/disable this option to show or
                    hide these instructions on the canvas. Remember, this
                    component will not appear when you're previewing your
                    prototype!
                </li>
                <li>
                    <b>Usage</b>: Drop this component into the screens you want
                    to track, ensuring it appears in the layers panel as a child
                    of the screen. The screen name will be automatically
                    determined, meaning every time you visit a page in your
                    prototype it will create a page view on Google Analytics
                    using the name of your screen as the Page Title. If you
                    don't rename your screens this won't work well so be sure to
                    name them appropriately!
                </li>
                <li>
                    <b>Any questions/feature requests?</b> Contact
                    iain@framer.com
                </li>
            </ol>
        </div>
    )
}

declare global {
    interface Window {
        dataLayer: any[]
    }
}

export function gtag(..._args: any[]) {
    window.dataLayer = window.dataLayer || []

    window.dataLayer.push(arguments)
}
