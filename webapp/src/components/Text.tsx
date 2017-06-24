import * as React from "react"

export const Text = ({message}) => {
    let prev: string = ""
    const messageArr = message.split("\n")
    const output = messageArr.map(
        (text, index) => {
            if (text.trim().length > 0) {
                prev = text
                return <span key={index}>{text}{(index !== messageArr.length - 1) && <br/>}</span>
            }
            if (text !== prev) {
                prev = text
                return <br key={index}/>
            }
        },
    )
    return (
        <p>
            {message.length > 0 ? output : null}
        </p>
    )
}
