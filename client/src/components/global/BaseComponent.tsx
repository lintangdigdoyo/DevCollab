import React, { useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Store } from '../../store';
import { clearProject } from '../../actions/projectActions';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { setColor } from '../../styles';
import Sidebar from '../sidebar/Sidebar';
import { AuthInitialState } from '../../reducers/authReducer';
import { ProjectInitialState } from '../../reducers/projectReducer';
import Navbar from '../global/Navbar';

interface BaseComponentProps {
  clearProject: () => void;
  auth: AuthInitialState;
  project: ProjectInitialState;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  children,
  clearProject,
  auth: { isAuthenticated, notFound },
  project: { selectedProject },
}) => {
  useEffect(() => {
    return () => clearProject();
  }, [clearProject]);

  return (
    <Fragment>
      {isAuthenticated && !notFound ? (
        <Container>
          <Sidebar />
          <ChildrenContainer>
            {selectedProject && (
              <Fragment>
                <Navigation>
                  <Previous to='/projects'>
                    <ArrowBackIosIcon />
                    <span>Projects</span>
                  </Previous>
                  <Title>{selectedProject.name}</Title>
                </Navigation>
                <Navbar />
              </Fragment>
            )}
            {children}
          </ChildrenContainer>
        </Container>
      ) : (
        children
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearProject: () => dispatch(clearProject()),
});

const Container = styled.div`
  background-color: ${setColor.mainGrey};
  display: flex;
  min-height: 100vh;
`;

const ChildrenContainer = styled.div`
  padding: 25px 30px;
  margin-left: 23%;
  width: 100%;
  overflow: hidden;
`;

const Navigation = styled.div`
  color: ${setColor.primary};
  display: flex;
  align-items: center;
`;

const Previous = styled(Link)`
  color: ${setColor.lightBlack};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const Title = styled.h2`
  margin: 0 15px;
  color: ${setColor.mainBlack};
  font-weight: 500;
`;

export default connect(mapStateToProps, mapDispatchToProps)(BaseComponent);