import { ReactNode, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { MdCancel, MdDelete } from 'react-icons/md'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { ModalConfirm } from '../components/ModalConfirm'
import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

type ModalConfirmProps = {
    modalIsOpen: boolean,
    icon: ReactNode,
    iconAlt?: string,
    modalTitle: string,
    modalContent: string,
    buttonConfirmText: string,
    onConfirm: () => void,
    onCancel: () => void
}

type RoomParams = {
    id: string;
}


export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title, authorId, hasCheckedRoom } = useRoom(roomId);
    const { user, hasCheckedUser } = useAuth();
    const history = useHistory();
    const [modalProps, setModalProps] = useState({} as ModalConfirmProps);

    async function handleEndRoom() {
        setModalProps({
            modalIsOpen: true,
            icon: (<MdCancel />),
            iconAlt: 'Encerrar icone',
            modalTitle: 'Encerrar sala',
            modalContent: 'Tem certeza que você deseja encerrar esta sala?',
            buttonConfirmText: 'Sim, encerrar',
            onConfirm: async () => {
                await database.ref(`rooms/${roomId}`).update({
                    endedAt: new Date()
                });
                history.push('/');
            },
            onCancel: () => setModalProps(Object.assign(modalProps, {modalIsOpen: false}))
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        setModalProps({
            modalIsOpen: true,
            icon: (<MdDelete />),
            iconAlt: 'Deletar Questão',
            modalTitle: 'Excluir pergunta',
            modalContent: 'Tem certeza que você deseja excluir esta pergunta?',
            buttonConfirmText: 'Sim, excluir',
            onConfirm: async () => {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
                setModalProps(Object.assign(modalProps, {modalIsOpen: false}))
            },
            onCancel: () => setModalProps(Object.assign(modalProps, {modalIsOpen: false}))
        });
    }

    async function handleAnswerQuestion(questionId: string) {
        const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);
        const isAnswered = !(await questionRef.get()).val().isAnswered;
        await questionRef.update({
            isAnswered: isAnswered
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);
        const isHighlighted = !(await questionRef.get()).val().isHighlighted;
        await questionRef.update({
            isHighlighted: isHighlighted
        });
    }

    if (hasCheckedUser && (!user || (hasCheckedRoom && authorId !== user.id)))
        return (<Redirect to={`/rooms/${roomId}`} />);
    else
        return (
            <div id="page-room">
                <header>
                    <div className="content">
                        <img src={logoImg} alt="Letmeask" />
                        <div>
                            <RoomCode code={roomId} />
                            <Button 
                                isOutlined
                                onClick={handleEndRoom}
                            >Encerrar a sala</Button>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="room-title">
                        <h1>Sala {title}</h1>
                        { questions.length > 0 && (<span>{questions.length} pergunta(s)</span>) }
                    </div>

                    <div className="questions-list">
                        {questions.map(question => {
                            return( 
                                <Question
                                    key={question.id}
                                    {...question}
                                >
                                    { !question.isAnswered && (
                                        <>
                                            <button
                                                className='answer-button'
                                                type="button"
                                                onClick={() => {handleAnswerQuestion(question.id)}}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button
                                                className='highlight-button'
                                                type="button"
                                                onClick={() => {handleHighlightQuestion(question.id)}}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </>
                                    ) }
                                    <button
                                        type="button"
                                        onClick={() => {handleDeleteQuestion(question.id)}}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Question>
                            )
                        })}
                    </div>
                    <ModalConfirm
                        {...modalProps}
                    ></ModalConfirm>
                </main>
            </div>
        );
}