import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { setColor, setRem } from '../../styles';
import { setAlert, removeAlert } from '../../actions/alertActions';
import validateEmail from '../../utils/validateEmail';
import { Button, RoundedButton } from '../global/Button';
import ALert from '../global/Alert';
import { AccessPermission, ProjectData } from '../../actions/projectTypes';
import { UserType } from '../../actions/authTypes';
import { MessageType } from '../../actions/alertTypes';
import { Form, InputContainer } from '../global/FormContainer';

interface ProjectFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  user: UserType;
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  setAlert: (
    message: string,
    messageType: MessageType,
    location: string
  ) => void;
  removeAlert: (location: string) => void;
  update?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  handleSubmit,
  projectData,
  setProjectData,
  user,
  setAlert,
  removeAlert,
  update,
}) => {
  //Members state
  const [members, setMembers] = useState<string>('');

  //Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  //Handle member that will be added to project
  const handleAddMembers = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const emailValidated = validateEmail(members);

    //Check if email already added
    const emailExist = projectData.members.filter(
      (member) => member.email === members
    );

    if (emailExist.length !== 0 || members === user?.email) {
      setAlert('Email already on the list', MessageType.Fail, 'members');
    } else if (members !== '' && emailValidated) {
      setProjectData((prevData) => ({
        ...prevData,
        members: [
          ...prevData.members,
          { email: members, accessPermission: AccessPermission.ReadOnly },
        ],
      }));

      removeAlert('members');
      setMembers('');
    } else {
      setAlert('Please include a valid email', MessageType.Fail, 'members');
    }
  };

  //Handle member permission
  const handleChangeEditPermission = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: AccessPermission = parseInt(e.target.value);

    let changePermission = projectData.members.find(
      (data) => data.email === e.target.name
    );

    if (changePermission) {
      changePermission.accessPermission = value;
    }

    setProjectData({
      ...projectData,
      members: projectData.members.map((member) =>
        member.email === e.target.name ? changePermission ?? member : member
      ),
    });
  };

  //Handle delete member on the list
  const handleDeleteMember = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setProjectData({
      ...projectData,
      members: projectData.members.filter(
        (member) => member.email !== e.currentTarget?.value
      ),
    });
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='name'>
            Project Name <span>*</span>
          </label>
          <input
            name='name'
            autoComplete='off'
            spellCheck='false'
            id='name'
            type='text'
            placeholder='Enter the name of the project'
            onChange={handleChange}
            value={projectData.name}
          />
        </InputContainer>

        <InputContainer>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            id='description'
            rows={8}
            placeholder='Describe the project'
            onChange={handleChange}
            value={projectData.description}
          />
        </InputContainer>

        <Fragment>
          <InputContainer>
            <label htmlFor='members'>Invite Members</label>
            <AddMemberContainer>
              <input
                type='email'
                id='members'
                name='members'
                placeholder='Enter member email'
                onChange={(e) => setMembers(e.target.value)}
                value={members}
              />
              <RoundedButton onClick={handleAddMembers} aria-label='add member'>
                <AddIcon fontSize='small' />
              </RoundedButton>
            </AddMemberContainer>
          </InputContainer>
          <label htmlFor='members'>Project Access Permission</label>

          <InputContainer id='members'>
            <MemberEmail>{user?.email}</MemberEmail>
            <Select disabled style={{ cursor: 'not-allowed' }}>
              <option value={AccessPermission.Admin}>Owner</option>
            </Select>
            {projectData.members.map((member, index) => (
              <Fragment key={index}>
                <MemberEmail>{member.email}</MemberEmail>
                <PermissionContainer>
                  <Select
                    name={member.email}
                    defaultValue={
                      member.accessPermission ?? AccessPermission.ReadOnly
                    }
                    onChange={handleChangeEditPermission}
                  >
                    <option value={AccessPermission.Admin}>Owner</option>
                    <option value={AccessPermission.ReadWriteDelete}>
                      Member
                    </option>
                    <option value={AccessPermission.ReadOnly}>Client</option>
                  </Select>
                  <RoundedButton
                    id={member.email}
                    value={member.email}
                    onClick={handleDeleteMember}
                    danger
                  >
                    <CloseIcon fontSize='small' color='secondary' />
                  </RoundedButton>
                </PermissionContainer>
              </Fragment>
            ))}
          </InputContainer>
        </Fragment>

        <StyledButton
          aria-label='create project'
          extrasmall={'extrasmall' && 1}
        >
          {!update ? 'Create Project' : 'Update Project'}
        </StyledButton>
        <StyledButton
          aria-label='cancel'
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
          as={Link}
          to='/projects'
        >
          Cancel
        </StyledButton>
      </Form>

      <ALert />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setAlert: (message: string, messageType: MessageType, location: string) =>
    dispatch(setAlert(message, messageType, location)),
  removeAlert: (location: string) => dispatch(removeAlert(location)),
});

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-right: 10px;
`;

const Select = styled.select`
  width: 200px;
  padding: 5px;
  height: 30px;
  border-radius: 5px;
  border: solid ${setColor.lightBlack} 1px;
  outline: none;
`;

const AddMemberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const PermissionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MemberEmail = styled.div`
  color: ${setColor.mainBlack};
  font-weight: 500;
  font-size: ${setRem(14)};
  margin-top: 10px;
  margin-bottom: 5px;
`;

export default connect(null, mapDispatchToProps)(ProjectForm);
