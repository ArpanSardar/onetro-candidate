import React, { Component } from "react";
import preview from "../../../assets/images/introPreview.png"

import {
    firebaseService,
    candidateAuth,
    candidateDatabase,
    candidateStorage,
    companyDatabase,
    companyStorage
} from "../../../services/FirebaseCandidateService";
import imgloader from '../../../assets/images/imgloader.gif'
import {
    countries,
    expertisationOptions,
    workExperienceOptions,
    skillsets,
    languages
} from "../HomePage/AutoComplete/data";
import {
    AutoComplete, Select,
    Upload, Card,
    DatePicker, Popover,
    Form, Input, Alert, Spin,
    Typography, Row, Col, Modal,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message
} from 'antd';
const { Title, Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import './style.css';


interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class ProfileComplete extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {

        };
    }


    render() {

        return (

            <Card title={<Title level={4} style={{ marginBottom: 0, textAlign: 'center' }}>Profile Completed !</Title>}>
                <Row>
                    <ButtonGroup style={{ width: '100%' }}>
                        <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
                            <Icon type="left" />
                            Go back
                        </Button>
                        <Button style={{ width: '50%' }} type="default" disabled={true}>
                            Go forward
                            <Icon type="right" />
                        </Button>
                    </ButtonGroup>
                </Row>
                <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                <Layout>
                    {/* <Header>Header</Header> */}
                    <Content className="contentClass">
                        <Progress type="circle" percent={100} />
                    </Content>
                    <Footer className="contentClass">
                        <Title level={3} style={{ marginBottom: 0 }}>You' re all set !</Title>
                        <p>Thanks for registering on Onetro. We are working on bringing the best for you to be able to get a job
                    in Japan. We will contact you soon with further steps. Again thanks for your coopration.<br />
                            If you have any queries, please contact <br /><big><b>"onetro_support@willings.co.jp"</b></big></p>
                    </Footer>
                </Layout>


            </Card>
        )
    }

}



export default ProfileComplete;

