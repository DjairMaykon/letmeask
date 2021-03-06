import { useAuth } from '../hooks/useAuth'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import { database } from '../services/firebase'

import { ReactComponent as IllustrationSvg } from '../assets/images/illustration.svg'
import { ReactComponent as LogoSvg } from '../assets/images/logo.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'

export function NewRoom() {
    const { user, hasCheckedUser } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if(newRoom.trim() === '') return;

        const roomRef = database.ref('rooms');
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        });

        history.push(`/admin/rooms/${firebaseRoom.key}`);
    }
    if(hasCheckedUser && !user?.id)
        return (<Redirect to='/' />)
    else
        return (
            <div id="page-auth">
                <aside>
                    <IllustrationSvg className='illustration-svg' />
                    {/* <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" /> */}
                    <strong>Crie salas de Q&amp;A ao-vivo</strong>
                    <p>Tire as dúvidas da sua audiência em tempo-real</p>
                </aside>
                <main>
                    <div className="main-content">
                        <LogoSvg className='logo-svg' />
                        {/* <img src={logoImg} alt="Letmeask" /> */}
                        <h2>Criar uma nova sala</h2>
                        <form onSubmit={handleCreateRoom}>
                            <input 
                                type="text"
                                placeholder="Nome da sala"
                                onChange={event => setNewRoom(event.target.value)}
                                value={newRoom}
                            />
                            <Button type="submit">
                                Criar sala
                            </Button>
                        </form>
                        <p>
                            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                        </p>
                    </div>
                </main>
            </div>
        )
}