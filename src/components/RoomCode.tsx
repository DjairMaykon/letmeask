import { MdContentCopy } from 'react-icons/md';
import { IconContext } from 'react-icons/lib';

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
                <IconContext.Provider value={{ className: 'icon' }}>
                    <MdContentCopy />
                </IconContext.Provider>
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}