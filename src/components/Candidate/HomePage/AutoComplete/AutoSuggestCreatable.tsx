import React from "react";
import Select from "react-select";
import CreatableSelect from 'react-select/lib/Creatable';


interface IProps {
  options?: any;
  className?: any;
  isMulti: boolean;
  defaultValue: any;
}

interface DispProps {
  handleChange: (value: string) => void;
}

interface IState {
  selectedOption: any;
}

class AutoSuggestCreatable extends React.Component<IProps & DispProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedOption: ""
    };
  }
  handleChange = (selectedOption: any) => {
    this.setState({ selectedOption: selectedOption });
    // console.log(selectedOption);
    var arr:any=[];
    var i:any=0;
    // if (this.props.isMulti == true) {
        
        selectedOption.map((option:any)=>{
        var data={
            id: i=i+1,
            value:option.value,
            label:option.value
        }
        arr.push(data);
        })
      this.props.handleChange(arr);
    // } else {
    //   this.props.handleChange(selectedOption.value);
    // }
  };
  render() {
    const defaultValue = this.props.defaultValue;
    return (
      <CreatableSelect
        // value={this.state.selectedOption}
        onChange={this.handleChange}
        options={defaultValue}
        isMulti={this.props.isMulti}
        // key={this.props.options.id}
        closeMenuOnSelect={false}
        defaultValue={defaultValue}
      />
    );
  }
}

export default AutoSuggestCreatable;
