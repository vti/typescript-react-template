import * as React from 'react';
import { Field, reduxForm, Form, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';

import { NumberInputReduxForm, LabeledButton, SubheadingText } from "./ui-shared/";
import { CounterAction } from "./Counter/CounterAction";
import { CounterValueProps } from './Counter';
import { Paper } from 'material-ui';

/** Localizable strings from React-intl. */
const messages = defineMessages({
  counter_form_submit: {
    id: "counter_form_submit",
    defaultMessage: "submit" ,
  },
  counter_form_clear: {
    id: "counter_form_clear",
    defaultMessage: "clear"  
  },
  counter_form_title: {
    id: "counter_form_title",
    defaultMessage: "A Redux-Form with Validation (Max 100)"
  }
});

/** A validation function used by the field. */
function max100(value: any) : React.ReactNode {
  return (value && value >= 100) 
    ? true
    : null;
}

/** The properties of the Counter form component. */
export type CounterFormProperties = InjectedFormProps<{}, CounterValueProps>;

/** An example of using Redux-form. */
export class BaseCounterForm extends React.PureComponent<CounterFormProperties> 
{
  submit({value}, dispatch) {
    dispatch(CounterAction.createReplaceAction(value));
  }

  render(): React.ReactNode {
    const { 
      pristine, submitting, reset, handleSubmit 
    } = this.props;
    
    return (
      <Paper elevation={4}>
        <SubheadingText text={messages.counter_form_title} />
        <Form onSubmit={handleSubmit(this.submit)}>
          <div>
            <Field
              name='value'
              component={NumberInputReduxForm}
              label="Input Value"
              validate={max100}         
            />
            <div>
              <LabeledButton 
                submit={true}
                label={messages.counter_form_submit}
                disabled={ this.props.invalid ||  pristine || submitting }
              />              
              <LabeledButton 
                label={messages.counter_form_clear}
                disabled={pristine || submitting} 
                onClick={reset}
              />
            </div>
          </div>
        </Form>
      </Paper>
    );
  }
}

/** Create a function for creating a Redux form, along with the label used for storing the form data,  */
export const createCounterForm = reduxForm<{}, Partial<CounterValueProps>>({ form: 'CounterForm' });

/** Call the create Counter Form higher-order component to actually create the component.  */
export const UnconnectedCounterForm = createCounterForm(BaseCounterForm);

/** The function for getting the current counter state from the store. */
export const mapStateToProps = (state: any): Partial<CounterValueProps> => ({
   value: state.counter.value as number 
});

/** Create the counter  */
export const CounterForm = connect(mapStateToProps)(UnconnectedCounterForm);