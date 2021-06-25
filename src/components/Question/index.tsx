import { ReactNode } from 'react';
import cx from 'classnames'
import './style.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string,
        avatar: string
    };
    isAnswered: boolean;
    isHighlighted: boolean;
    children?: ReactNode;
};

export function Question({
    content, author, children, isAnswered, isHighlighted
}: QuestionProps) {
    return (
        <div className={cx(
            'question',
            {'answered': isAnswered },
            {'highlighted': isHighlighted && !isAnswered}
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}