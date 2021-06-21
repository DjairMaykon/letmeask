type ButtonProps = {
    children?: string,
    text?: string
}

export function Button(props: ButtonProps) {
    return (
        <button>{ props.children || props.text || 'Default' }</button>
    )
}