import { useAuth } from '../hooks/useAuth'
import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';


import { database } from '../services/firebase'

import { ReactComponent as IllustrationSvg } from '../assets/images/illustration.svg'
import { ReactComponent as LogoSvg } from '../assets/images/logo.svg'
import { ReactComponent as GoogleIconSvg } from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useEffect } from 'react';

type HomeState = {
    state?: {
        roomIsEnded?: boolean,
        roomNotExists?: boolean
    }
}

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    const location = history.location as HomeState;

    useEffect(() => {
        if (location.state?.roomIsEnded) {
            toast.error('Room is ended.');
        }
        if (location.state?.roomNotExists) {
            toast.error('Room not exists.');
        }
    }, []);
    

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === '') return;

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if(!roomRef.exists()) {
            toast.error('Room does not exists.');
            return;
        }
        if(roomRef.val().endedAt) {
            toast.error('Room is closed.');
            return;
        }

        let route = `/rooms/${roomCode}`;
        if (user && roomRef.val().authorId === user?.id) route = 'admin' + route;

        history.push(route);
    }

    return (
        <div id="page-auth">
            <aside>
                <IllustrationSvg className='illustration-svg' />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <LogoSvg className='logo-svg' />
                    <button onClick={handleCreateRoom} className="create-room">
                        <GoogleIconSvg />
                        Crie a sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
            <Toaster
                position="top-left"
                reverseOrder={false}
            />
        </div>
    )
}