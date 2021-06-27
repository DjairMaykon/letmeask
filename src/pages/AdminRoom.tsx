import { ReactNode, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { ReactComponent as LogoSvg } from '../assets/images/logo.svg'
import { ReactComponent as CheckSvg } from '../assets/images/check.svg'
import { ReactComponent as AnswerSvg } from '../assets/images/answer.svg'
import { ReactComponent as DeleteSvg } from '../assets/images/delete.svg'
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
                        <LogoSvg className='logo-svg' />
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
                                                <CheckSvg />
                                            </button>
                                            <button
                                                className='highlight-button'
                                                type="button"
                                                onClick={() => {handleHighlightQuestion(question.id)}}
                                            >
                                                <AnswerSvg />
                                            </button>
                                        </>
                                    ) }
                                    <button
                                        type="button"
                                        onClick={() => {handleDeleteQuestion(question.id)}}
                                    >
                                        <DeleteSvg />
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