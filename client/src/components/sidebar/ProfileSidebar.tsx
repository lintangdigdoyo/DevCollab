import React from 'react';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { Store } from '../../store';
import { setColor } from '../../styles';
import dummyImage from '../../assets/pexels-photo-220453.jpeg';
import { AuthInitialState } from '../../reducers/authReducer';
import UserMenu from '../global/UserMenu';

interface ProfileSidebarProps {
  auth: AuthInitialState;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ auth: { user } }) => {
  const classes = useStyles();

  return (
    <Container>
      <ProfileContainer>
        <Img src={dummyImage} alt='profile' />
        <UserInformation>
          <h4>
            {user?.firstName} {user?.lastName}
          </h4>
          <h5>{user?.email}</h5>
        </UserInformation>
      </ProfileContainer>
      <UserMenu>
        <StyledMoreVertIcon className={classes.fontSizeLarge} />
      </UserMenu>
    </Container>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

const useStyles = makeStyles(() =>
  createStyles({
    fontSizeLarge: {
      fontSize: '30px',
    },
  })
);

const Container = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${setColor.primary};
  color: ${setColor.mainWhite};
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Img = styled.img`
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 100%;
  margin-right: 10px;
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const UserInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  h4 {
    font-weight: 600;
    margin-bottom: 5px;
  }
  h5 {
    font-weight: 500;
  }
`;

const StyledMoreVertIcon = styled(MoreVertIcon)`
  align-self: flex-start;
  color: ${setColor.mainWhite};
  &:hover {
    color: ${setColor.mainGrey};
  }
  height: 20px;
  cursor: pointer;
`;

export default connect(mapStateToProps)(ProfileSidebar);
