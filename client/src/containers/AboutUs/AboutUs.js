import React, { Component } from "react";
import Picker, { TYPE_YEAR } from '../../components/UI/Picker/Picker';
import TextInput from "../../components/UI/TextInput/TextInput";

class AboutUs extends Component {

    render() {
        return (
            <div>AboutUs
                <Picker type={TYPE_YEAR} from={1950} to={2010}/>
                <TextInput name='name' placeholder='placeholder' />
            </div>
        );
    }

}

export default AboutUs;