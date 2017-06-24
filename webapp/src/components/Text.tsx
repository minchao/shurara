import * as React from "react"

export const Text = ({message}) => {
    const output = message.split("\n").map(
        (text, index) => {
            if (text.trim().length > 0) {
                return <p key={index}>{text}</p>
            }
            return <br key={index}/>
        },
    )
    return (
        <div>
            {message.length > 0 ? output : null}
        </div>
    )
}
