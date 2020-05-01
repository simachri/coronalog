import React, { Fragment, useState } from 'react';
import propTypes from 'prop-types';
import classes from '../auth.module.scss'

import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

const Signup = ( props ) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState({
        input_1: '',
        input_2: ''
    });
    const [vendor, setVendor] = useState(props.vendors ? props.vendors[0].value : null);

    let vendorsSelect = null;
    if (props.vendors) {
        const elementConfig = {
            name: 'vendor',
            options: props.vendors
        }
        vendorsSelect = (
            <Input
                elementType='select'
                val={vendor}
                inputChangedHandler={event => setVendor(event.target.value)}
                elementConfig={elementConfig}
                label='Vendor'
            />
        )
    }
    
    let submitButton = (
        <Button click={() => props.onSubmit(username, password.input_1, password.input_2, vendor)}>
            Registrieren
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
                        name: 'username',
                        placeholder: 'Dein Nutzername',
                        type: 'text'
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
                        name: 'username',
                        placeholder: 'Dein Passwort',
                        type: 'password'
                    }}
                    val={password.input_1}
                    inputChangedHandler={event => setPassword({...password, input_1: event.target.value})}
                />
            </div>
            <div className={classes.PasswordInput}>
                <Input
                    elementType='input'
                    elementConfig={{
                        name: 'username',
                        placeholder: 'Password wiederholen',
                        type: 'password'
                    }}
                    val={password.input_2}
                    inputChangedHandler={event => setPassword({...password, input_2: event.target.value})}
                />
            </div>
            <div className={classes.VendorInput}>
                {vendorsSelect}
            </div>
            <div className={classes.Submit}>
                {submitButton}
            </div>
        </Fragment>
    );

}
Signup.propTypes = {
    onSubmit: propTypes.func.isRequired,
    loading: propTypes.bool,
    vendors: propTypes.arrayOf(propTypes.shape({
        value: propTypes.string,
        label: propTypes.string,
    })),
}


export default Signup;