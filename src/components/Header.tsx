import { Navbar, Container, Nav, Button, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';  // Import the CSS file
import { LoginDialog } from './LoginDialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from './LoginContext';
import { deleteLogin, getLogin } from '../backend/api';

export const Header = () => {

  const { loginInfo, setLoginInfo } = useLoginContext();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  const doLogout = async () => {
    try {
      const response = await deleteLogin();
      console.log('Logout-Antwort:', response);
      setLoginInfo(false);
      navigate('/');
    } catch (error) {
      console.error('Logout fehlgeschlagen:', error);
    }
  };
  

  return (<Navbar bg="primary" variant="dark" expand="lg" className='sticky-top'>
  <Container fluid>
      <LinkContainer to="/">
          <Navbar.Brand>Trinkprotokolle</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to={"/"}>
              <Nav.Link>Übersicht</Nav.Link>
            </LinkContainer>
              {loginInfo && loginInfo.role === "a" && (
                  <LinkContainer to="/admin">
                      <Nav.Link>Admin</Nav.Link>
                  </LinkContainer>
              )}
              {loginInfo && (
                  <LinkContainer to="/prefs">
                      <Nav.Link>Prefs</Nav.Link>
                  </LinkContainer>
              )}
          </Nav>
          <Nav>
              <NavItem>
                  {loginInfo ? (
                      <Button onClick={doLogout} variant="dark" className="mx-2">Logout</Button>
                  ) : (
                      <Button onClick={() => setShowLoginDialog(true)} variant="dark" className="mx-2">Login</Button>
                  )}
                  <LoginDialog open={showLoginDialog} onHide={() => setShowLoginDialog(false)} />
              </NavItem>
          </Nav>
      </Navbar.Collapse>
  </Container>
</Navbar>
  );
};
