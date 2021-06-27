import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { ReactComponent as LogoSvg } from '../assets/images/logo.svg'
import { ReactComponent as LikeSvg } from '../assets/images/like.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

export function Room() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    const { user, signInWithGoogle } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') return;
        if(!user) throw new Error('You must be logged in.')

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);
    }

    async function handleLikeQuestion(questionId: string, likeId?: string) {
        const likeRef = database.ref(`rooms/${roomId}/questions/${questionId}/likes`);
        if (likeId) {
            await likeRef.child(likeId).remove();
        } else {
            await likeRef.push({authorId: user?.id});
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <LogoSvg className='logo-svg' />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && (<span>{questions.length} pergunta(s)</span>) }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {
                            user ?
                            (
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>
                            ) :
                            (
                                <span>Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button></span>
                            )
                        }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                <div className="questions-list">
                    {questions.map(question => {
                        return( 
                            <Question
                                key={question.id}
                                {...question}
                            >
                                <button 
                                    className={cx(
                                        'like-button',
                                        {'liked': question.likeId},
                                        {'disabled': question.isAnswered}
                                    )}
                                    disabled={question.isAnswered}
                                    type="button"
                                    aria-label="Like Question"
                                    onClick={() => !question.isAnswered && handleLikeQuestion(question.id, question.likeId)}
                                >
                                    <span>{question.likeCount}</span>
                                    <LikeSvg />
                                </button>
                            </Question> 
                        )
                    })}
                </div>
            </main>
        </div>
    );
}