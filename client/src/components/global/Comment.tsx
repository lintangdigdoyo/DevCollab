import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkdown from 'react-markdown';

import { media, setColor, setRem, setShadow } from '../../styles';
import avatar from '../../assets/profile-picture.png';
import Avatar from './Avatar';
import AlertDialog from './AlertDialog';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface CommentProps {
  comment: {
    _id: string;
    date: Date;
    user: {
      _id: string;
      firstName?: string;
      lastName?: string;
      avatar?: {
        url: string;
      };
    };
    comment: string;
  };
  projectId: string;
  itemId: string;
  user?: UserType;
  socketName: string;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  projectId,
  itemId,
  user,
  socketName,
}) => {
  //Use relativeTime plugin
  dayjs.extend(relativeTime);

  const handleClick = () => {
    socket.emit(socketName, {
      projectId,
      itemId,
      commentId: comment._id,
    });
  };

  return (
    <Container>
      <Avatar src={comment.user.avatar?.url ?? avatar} alt='avatar' size='40' />
      <CommentContainer>
        <Header>
          <h5>
            {comment.user.firstName} {comment.user.lastName}
          </h5>
          <span>{dayjs(comment.date).fromNow()}</span>
        </Header>

        <Text>
          <ReactMarkdown>{comment.comment}</ReactMarkdown>
        </Text>

        {comment.user._id === user?._id && (
          <AlertDialog
            title='Delete Comment'
            text="Are you sure want to delete this comment? This process can't be undone"
            firstButton='Delete'
            secondButton='Cancel'
            deleteButton
            deleteItem={handleClick}
          >
            <DeleteButton>Delete</DeleteButton>
          </AlertDialog>
        )}
      </CommentContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 25px 0;
  display: flex;
  align-items: center;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  h5 {
    font-weight: 600;
  }
  span {
    margin: 0 10px;
    font-size: ${setRem(14)};
    color: ${setColor.lightBlack};
    font-weight: 500;
  }
`;

const Text = styled.div`
  padding: 10px;
  margin: 3px 0;
  background-color: ${setColor.lightGrey};
  box-shadow: ${setShadow.light};
  align-self: flex-start;
  word-wrap: break-word;
  @media ${media.lg} {
    max-width: 700px;
  }
  @media ${media.md} {
    max-width: 500px;
  }
  @media ${media.sm} {
    max-width: 300px;
  }
  @media ${media.xs} {
    max-width: 200px;
  }
`;

const DeleteButton = styled.span`
  color: ${setColor.lightBlack};
  font-size: ${setRem(11)};
  text-decoration: underline;
  transition: ease-in-out 0.3s;
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default Comment;
