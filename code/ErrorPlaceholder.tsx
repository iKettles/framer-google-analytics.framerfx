import * as React from "react"

interface ErrorPlaceholderProps {
    title: string
    message: string
}

const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = (props) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                fontSize: 16,
                fontWeight: 500,
                textAlign: "center",
                color: "rgb(255, 0, 85)",
                backgroundColor: "rgb(242, 219, 224)",
                border: "1px solid rgb(246, 193, 204)",
                padding: 32,
            }}
        >
            <h4>{props.title}</h4>
            <p>{props.message}</p>
        </div>
    )
}

export default ErrorPlaceholder
