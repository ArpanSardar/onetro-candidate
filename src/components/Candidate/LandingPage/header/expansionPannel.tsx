
import './style.css';

import faqHeader from '../../../../assets/images/faqHeader.png';

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
          <Typography className={classes.heading}>Which kind of experts can be hired through this ?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
          Any one who is an IT professional can be start applying Onetro.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>What is the age of candidates ?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
          From a fresher to a mid career (19-35 years old), all can apply to Onetro.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Can freshers also get placements in Japan through Onetro?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
          Yes, Freshers can also get placed in Japan through Onetro.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>What is the japanese level of the candidates ?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
          We know this is an important one. It is not necessary to know Japanese as the idea of Onetro is to make Japan more foreign friendly.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel id="exandable">
        <ExpansionPanelSummary className={classes.expandableMenu} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Besides all the supports mentioned above, can we ask other help if we need ?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.exopandableContent}>
          <Typography align='left'>
          Yes, Team Onetro will help in anything related to your placement through us.
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