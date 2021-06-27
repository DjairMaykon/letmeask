import { ReactComponent as CopySvg } from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode(props: RoomCodeProps) {
    function copyCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className="room-code" onClick={copyCodeToClipboard}>
            <div>
                <CopySvg />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}