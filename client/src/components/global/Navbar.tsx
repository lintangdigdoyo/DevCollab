import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { setColor, setShadow } from '../../styles';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import VideocamIcon from '@material-ui/icons/Videocam';
import GitHubIcon from '@material-ui/icons/GitHub';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SettingsIcon from '@material-ui/icons/Settings';
import { Store } from '../../store';
import { NavbarInitialState } from '../../reducers/navbarReducer';
import { SelectedType } from '../../actions/navbarTypes';
import { ProjectInitialState } from '../../reducers/projectReducer';
import { AuthInitialState } from '../../reducers/authReducer';
import { AccessPermission } from '../../actions/projectTypes';
import { loadRepo } from '../../actions/githubActions';
import { GithubInitialState } from '../../reducers/githubReducer';
import socket from '../../utils/socketio';

interface NavbarProps {
  loadRepo: (projectId: string) => Promise<void>;
  navbar: NavbarInitialState;
  project: ProjectInitialState;
  auth: AuthInitialState;
  github: GithubInitialState;
}

const Navbar: React.FC<NavbarProps> = ({
  loadRepo,
  navbar,
  project: { selectedProject },
  auth: { user },
  github: { repo },
}) => {
  useEffect(() => {
    loadRepo(selectedProject?._id ?? '');
  }, [selectedProject, loadRepo]);

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  useEffect(() => {
    //Join to repository room
    socket.emit('join repo', { repoId: repo?.node_id });

    //Emit commit listener
    socket.emit('listen commit', { repoId: repo?.node_id });

    return () => {
      socket.emit('leave repo', { repoId: repo?.node_id });
    };
  }, [repo?.node_id]);

  useEffect(() => {
    //Listen every github commit
    socket.on('receive commit', (data: string) => {
      console.log(data);
    });
  }, []);

  return (
    <Container>
      <ul>
        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/activity`}
            selected={navbar.selected === SelectedType.Activity}
          >
            <ImportExportIcon />
            <Text>Activity</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/tasks`}
            selected={navbar.selected === SelectedType.Task}
          >
            <PlaylistAddCheckIcon />
            <Text>Tasks</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/discussions`}
            selected={navbar.selected === SelectedType.Discussions}
          >
            <QuestionAnswerIcon />
            <Text>Discussions</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/meeting-rooms`}
            selected={navbar.selected === SelectedType.Meeting}
          >
            <VideocamIcon />
            <Text>Meeting Rooms</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/github-activity`}
            selected={navbar.selected === SelectedType.Github}
          >
            <GitHubIcon />
            <Text>GitHub Activity</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/notes`}
            selected={navbar.selected === SelectedType.Notes}
          >
            <NoteAddIcon />
            <Text>Notes</Text>
            <div />
          </StyledLink>
        </li>

        <li>
          <StyledLink
            to={`/projects/${selectedProject?._id}/files`}
            selected={navbar.selected === SelectedType.Files}
          >
            <AttachFileIcon />
            <Text>Files</Text>
            <div />
          </StyledLink>
        </li>
        {userProject?.accessPermission === AccessPermission.Admin && (
          <li>
            <StyledLink to={`/projects/${selectedProject?._id}/edit`}>
              <SettingsIcon />
              <Text>Settings</Text>
              <div />
            </StyledLink>
          </li>
        )}
      </ul>
    </Container>
  );
};

const mapStateToProps = (state: Store) => ({
  navbar: state.navbar,
  project: state.project,
  auth: state.auth,
  github: state.github,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadRepo: (projectId: string) => dispatch(loadRepo(projectId)),
});

const Container = styled.nav`
  background-color: ${setColor.mainWhite};
  box-shadow: ${setShadow.main};
  width: 100%;
  margin: 20px 0;
  border-radius: 10px;

  ul {
    display: flex;
    justify-content: space-evenly;
    height: 70px;
  }
  li {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const StyledLink = styled(Link)<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  outline: none;
  user-select: none;
  color: ${({ selected }) =>
    selected ? setColor.primaryDark : setColor.lightBlack};
  transition: 0.2s ease-in-out;

  div {
    transition: 0.2s ease-in-out;
    width: 100%;
    border-top: ${({ selected }) =>
        selected ? setColor.primaryDark : setColor.mainWhite}
      3px solid;
  }

  &:hover {
    color: ${({ selected }) => !selected && setColor.primary};
  }
`;

const Text = styled.span`
  font-weight: 600;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
