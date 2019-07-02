
import './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CareerHistory from "../CareerHistory/CareerHistory";
import AcademicBackground from "../AcademicBackground/AcademicBackground";
import ProjectExperience from "../ProjectExperience/ProjectExperience";
import Certifications from "../Certifications/Certifications";


const styles = (theme: any) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: '20px',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'HiraginoSans-W4',
  },
  expandableMenu: {
    backgroundColor: '#F4F4F4'
  },
  exopandableContent: {
    backgroundColor: '#FCFCFC',
    fontFamily: 'HiraginoSans-W4',
  },

});

function SimpleExpansionPanel(props: any) {
  const { classes } = props;
  return (
    <div className="faqContainer">
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>どのような職種の方を採用できますか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            主にIT分野に特化した人材がプラットフォームに登録しています。
            <br/>
            AI開発、機械学習、UI/UXデザイナー、日本国内では採用が難しいとされる人材の採用ができます。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>求職者は現在どこに居住していますか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            Onetroには世界中の求職者が登録しています。
            <br/>
  国内外問わず、様々なエリアで活躍する人材に出会うことができます。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>どのような年齢層の方が登録していますか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            主に22歳から30歳までの若手層が登録しています。
            <br/>
  インターンシップ参加を希望する学生から、3年以上の業務経験のあるエンジニアまで。国外に在住する優秀層にアプローチすることができます。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>新卒の採用は可能ですか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            はい、可能です。
            <br/>
  新卒学生も数多く登録しています。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>求職者の日本語レベルはどのくらいですか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            登録者の80%が英語でのコミュニケーションがメインの人材です。
            <br/>
  日本語レベルを有する人材も登録していますが、Onetroは日本語レベル問わず、日本での就業を望むITエキスパートを主な対象としたプラットフォームです。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>採用者に対するサポートが必要ない場合はどうすれば良いですか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            採用後のサポートはカスタマイズ可能です。
            <br/>
  必要なサポートのみご依頼ください。また、上記に記載されていないサポートをご希望の場合は、お気軽にお問い合わせください。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>他に質問がある場合はどうすれば良いですか？</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
            <a href="mailto:contact@willings.co.jp">contact@willings.co.jp</a>、もしくは<a href="https://willings.co.jp/contact">こちら</a>のお問い合わせフォームからお気軽にお問い合わせください。
            <br/>
  2営業日以内にご返信させていただきます。
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);