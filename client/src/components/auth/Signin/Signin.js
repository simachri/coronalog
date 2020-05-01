import React, { Fragment, useState } from 'react';
import propTypes from 'prop-types';
import classes from '../auth.module.scss'

import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

const Signin = ( props ) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    let submitButton = (
        <Button click={() => props.onSubmit(username, password)}>
            Anmelden
        </Button>
    );
    if(props.loading){
        submitButton = <Spinner />;
    }

    return (
        <Fragment>
            <div className={classes.UsernameInput}>
                <Input 
                    elementType='input'
                    elementConfig={{
                        type: 'text',
                        placeholder: 'Dein Nutzername',
                        name: 'username',
                    }}
                    val={username}
                    inputChangedHandler={event => setUsername(event.target.value)}
                    verify={/^(?!\s*$).+/}
                />
            </div>
            <div className={classes.PasswordInput}>
                <Input
                    elementType='input'
                    elementConfig={{
                        type: 'password',
                        name: 'password',
                        placeholder: 'Dein Passwort'
                    }}
                    val={password}
                    inputChangedHandler={event => setPassword(event.target.value)}
                    verify={/^.{8,}$/} //min 8 characters
                />
            </div>
            <div className={classes.Submit}>
                {submitButton}
            </div>
        </Fragment>
    );

}
Signin.propTypes = {
    onSubmit: propTypes.func.isRequired,
    loading: propTypes.bool,
}


export default Signin;