import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
    likeCount: number,
    likeId?: string
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isHighlighted: boolean,
    isAnswered: boolean,
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [hasCheckedRoom, setHasCheckedRoom] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            if (databaseRoom) {
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
    
                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                    }
                });
                const sortedQuestions = parsedQuestions.sort((a, b) => a.isAnswered ? 1 : b.isAnswered ? -1 : b.likeCount - a.likeCount);
                setTitle(databaseRoom.title);
                setQuestions(sortedQuestions);
                setAuthorId(databaseRoom.authorId);
            } else {
                history.push('/rooms/missing');
            }
            setHasCheckedRoom(true);
        });
        
        return () => {
            roomRef.off('value');
        };
    }, [roomId, user?.id, history]);

    return { questions, title, authorId, hasCheckedRoom };
}